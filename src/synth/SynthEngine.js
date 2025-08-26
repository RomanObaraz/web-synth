import { Envelope } from "./Envelope";
import { DistortionModule } from "./modules/DistortionModule";
import { LPFModule } from "./modules/LPFModule";
import { OscillatorModule } from "./modules/OscillatorModule";
import { ReverbModule } from "./modules/ReverbModule";
import { setSmoothLevel } from "./utils";

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

        this.activeVoices = new Map();

        // modules
        this.oscillators = [
            new OscillatorModule(this.audioCtx),
            new OscillatorModule(this.audioCtx),
        ];
        this.lpf = new LPFModule(this.audioCtx);
        this.reverb = new ReverbModule(this.audioCtx);
        this.distortion = new DistortionModule(this.audioCtx);

        // connection chain
        this.lpf.output.connect(this.distortion.input);
        this.distortion.output.connect(this.reverb.input);
        this.reverb.output.connect(this.analyser);
        this.analyser.connect(this.masterGain);
        this.masterGain.connect(this.audioCtx.destination);
    }

    playNote(frequency) {
        const voiceGain = this.audioCtx.createGain();
        voiceGain.connect(this.lpf.input);

        const oscs = [];
        this.oscillators.forEach((oscillator) => {
            const osc = oscillator.createOscillator(frequency);
            if (osc) {
                osc.osc.start();
                osc.gain.connect(voiceGain);
                oscs.push(osc);
            }
        });

        const envelope = new Envelope(this.audioCtx, this.envelopeADSR);
        envelope.attachParameter(voiceGain.gain);
        envelope.triggerAttack();

        const voiceId = Symbol();
        this.activeVoices.set(voiceId, { oscs, voiceGain, envelope });
        return voiceId;
    }

    stopNote(voiceId) {
        const voice = this.activeVoices.get(voiceId);
        if (!voice) return;

        voice.envelope.triggerRelease();

        voice.oscs.forEach((osc) => {
            osc.osc.stop(this.audioCtx.currentTime + voice.envelope.release + 0.05);
        });

        this.activeVoices.delete(voiceId);
    }

    /*
     * SETTERS
     */

    setWaveform(oscIndex, waveform) {
        this.oscillators[oscIndex].setWaveform(waveform);

        for (const { oscs } of this.activeVoices.values()) {
            oscs[oscIndex].osc.type = waveform;
        }
    }

    setLevel(oscIndex, level) {
        this.oscillators[oscIndex].setLevel(level);

        for (const { oscs } of this.activeVoices.values()) {
            setSmoothLevel(oscs[oscIndex].gain.gain, this.audioCtx.currentTime, level);
        }
    }

    setDetune(oscIndex, detune) {
        this.oscillators[oscIndex].setDetune(detune);

        for (const { oscs } of this.activeVoices.values()) {
            oscs[oscIndex].osc.detune.setValueAtTime(detune, this.audioCtx.currentTime);
        }
    }

    setEnvelopeADSR(adsr) {
        this.envelopeADSR = { ...this.envelopeADSR, ...adsr };

        this.activeVoices.forEach((voice) => {
            if (voice.envelope) voice.envelope.setADSR(adsr);
        });
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
