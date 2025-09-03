import { DistortionModule } from "./modules/DistortionModule";
import { LFOModule } from "./modules/LFOModule";
import { LPFModule } from "./modules/LPFModule";
import { OscillatorModule } from "./modules/OscillatorModule";
import { ReverbModule } from "./modules/ReverbModule";
import { setSmoothLevel } from "./utils";
import { Voice } from "./Voice";

// TODO: bug with LFO when hold 2 notes and release one of them (release from ADSR fucks up)
// TODO: implement PWM?
// TODO: other variant of filter envelope?
// TODO: should I move Envelope out of LPFModule and Voice?

export class SynthEngine {
    constructor() {
        this.audioCtx = new AudioContext();

        this.masterGain = this.audioCtx.createGain();
        this.analyser = this.audioCtx.createAnalyser();

        this.envelopeADSR = {
            attack: 0,
            decay: 0,
            sustain: 1,
            release: 0,
        };

        this.voiceMode = "polyphonic";
        this.activeVoices = new Map();

        // modules
        this.oscillators = [
            new OscillatorModule(this.audioCtx),
            new OscillatorModule(this.audioCtx),
        ];
        this.lpf = new LPFModule(this.audioCtx);
        this.reverb = new ReverbModule(this.audioCtx);
        this.distortion = new DistortionModule(this.audioCtx);
        this.lfo = new LFOModule(this.audioCtx);
        this.lfoMode = "wah";

        // connection chain
        this.lpf.output.connect(this.distortion.input);
        this.distortion.output.connect(this.reverb.input);
        this.reverb.output.connect(this.analyser);
        this.analyser.connect(this.masterGain);
        this.masterGain.connect(this.audioCtx.destination);
    }

    playNote(frequency) {
        // retrigger voice mode
        if (this.voiceMode === "retrigger") {
            const existingVoice = [...this.activeVoices].find(
                ([, value]) => value.frequency === frequency
            );

            if (existingVoice) {
                const voiceId = existingVoice[0];
                const voice = existingVoice[1];

                voice.retrigger();
                return voiceId;
            }
        }

        // polyphonic (new voice))
        const voice = new Voice(
            this.audioCtx,
            frequency,
            this.oscillators,
            this.lpf,
            this.envelopeADSR,
            this.lpf.input
        );

        voice.connectLfo(this.lfo, this.lfoMode);

        const voiceId = Symbol();
        this.activeVoices.set(voiceId, voice);
        return voiceId;
    }

    stopNote(voiceId) {
        const voice = this.activeVoices.get(voiceId);
        if (!voice) return;

        voice.triggerRelease();

        voice.cleanupTimeout = setTimeout(() => {
            // if the voice is still in activeVoices (wasn't retriggered),
            // then kill it
            if (this.activeVoices.has(voiceId)) {
                voice.disconnectLfo(this.lfo, this.lfoMode);
                voice.stop();
                this.activeVoices.delete(voiceId);
            }
        }, voice.envelope.release * 1000);
    }

    /*
     * SETTERS
     */

    setWaveform(oscIndex, waveform) {
        this.oscillators[oscIndex].setWaveform(waveform);

        for (const voice of this.activeVoices.values()) {
            voice.setWaveform(oscIndex, waveform);
        }
    }

    setLevel(oscIndex, level) {
        this.oscillators[oscIndex].setLevel(level);

        for (const voice of this.activeVoices.values()) {
            voice.setLevel(oscIndex, level);
        }
    }

    setDetune(oscIndex, detune) {
        this.oscillators[oscIndex].setDetune(detune);

        for (const voice of this.activeVoices.values()) {
            voice.setDetune(oscIndex, detune);
        }
    }

    setEnvelopeADSR(adsr) {
        this.envelopeADSR = { ...this.envelopeADSR, ...adsr };

        for (const voice of this.activeVoices.values()) {
            voice.setADSR(adsr);
        }
    }

    setVoiceMode(voiceMode) {
        this.voiceMode = voiceMode === "retrigger" ? "retrigger" : "polyphonic";
    }

    setLfoMode(mode) {
        this.lfo.disconnect();
        this.lfoMode = mode;

        if (mode === "wah") {
            this.lfo.connect(this.lpf.cutoffBus.input);
        } else {
            for (const voice of this.activeVoices.values()) {
                voice.connectLfo(this.lfo, mode);
            }
        }
    }

    setBypass(moduleId, bypass) {
        if (moduleId.startsWith("osc-")) {
            const oscIndex = parseInt(moduleId.split("-")[1], 10);

            this.oscillators[oscIndex].toggleBypass(bypass);

            for (const { oscs } of this.activeVoices.values()) {
                setSmoothLevel(
                    oscs[oscIndex].gain.gain,
                    this.audioCtx.currentTime,
                    bypass ? 0 : this.oscillators[oscIndex].level
                );
            }
        } else {
            this[moduleId].toggleBypass(bypass);
        }
    }
}
