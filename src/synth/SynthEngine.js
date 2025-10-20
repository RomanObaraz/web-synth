import { DistortionModule } from "./modules/DistortionModule";
import { LFOModule } from "./modules/LFOModule";
import { LPFModule } from "./modules/LPFModule";
import { OscillatorModule } from "./modules/OscillatorModule";
import { ReverbModule } from "./modules/ReverbModule";
import { BitcrusherModule } from "./modules/BitcrusherModule";
import { setSmoothLevel } from "./utils";
import { Voice } from "./Voice";

export class SynthEngine {
    constructor() {
        this.audioCtx = new AudioContext();

        this.masterGain = this.audioCtx.createGain();
        this.masterLimiter = this.audioCtx.createDynamicsCompressor();
        this.analyser = this.audioCtx.createAnalyser();

        this.envelopeParameters = {
            attack: 0,
            decay: 0,
            sustain: 1,
            release: 0,
            isEnabled: true,
        };

        this.voiceMode = "polyphonic";
        this.activeVoices = new Map();

        this.MAX_POLYPHONY = 16;
    }

    async init() {
        await Promise.all([
            this.audioCtx.audioWorklet.addModule("/clamp-processor.js"),
            this.audioCtx.audioWorklet.addModule("/pulse-oscillator-processor.js"),
            this.audioCtx.audioWorklet.addModule("/bitcrusher-processor.js"),
        ]);

        // modules
        this.oscillators = [
            new OscillatorModule(this.audioCtx),
            new OscillatorModule(this.audioCtx),
        ];
        this.subOscillators = [new OscillatorModule(this.audioCtx)];
        this.lpf = new LPFModule(this.audioCtx);
        this.reverb = new ReverbModule(this.audioCtx);
        this.distortion = new DistortionModule(this.audioCtx);
        this.bitcrusher = new BitcrusherModule(this.audioCtx);
        this.lfo = new LFOModule(this.audioCtx);
        this.lfoMode = "wah";

        // connection chain
        this.lpf.output.connect(this.distortion.input);
        this.distortion.output.connect(this.bitcrusher.input);
        this.bitcrusher.output.connect(this.reverb.input);
        this.reverb.output.connect(this.masterGain);
        this.masterGain.connect(this.masterLimiter);
        this.masterLimiter.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
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

        // polyphonic

        // check limit
        if (this.activeVoices.size >= this.MAX_POLYPHONY) {
            this.stealOldestVoice();
        }

        // (new voice))
        const voice = new Voice(
            this.audioCtx,
            frequency,
            this.oscillators,
            this.subOscillators,
            this.envelopeParameters,
            this.lpf.input
        );

        voice.connectLfo(this.lfo, this.lfoMode);
        voice.triggerAttack();
        this.lpf.triggerAttack();

        const voiceId = Symbol();
        this.activeVoices.set(voiceId, voice);
        this.updateMasterGain();

        return voiceId;
    }

    stopNote(voiceId) {
        const voice = this.activeVoices.get(voiceId);
        if (!voice) return;

        voice.triggerRelease();
        this.lpf.triggerRelease();

        voice.cleanupTimeout = setTimeout(() => {
            // if the voice is still in activeVoices (wasn't retriggered),
            // then kill it
            if (this.activeVoices.has(voiceId)) {
                voice.disconnectLfo(this.lfo, this.lfoMode);
                voice.stop();
                this.activeVoices.delete(voiceId);
            }
        }, voice.ampEnvelope.release * 1000 * (voice.ampEnvelope.enabled ? 1 : 0));
    }

    stealOldestVoice() {
        const oldestEntry = this.activeVoices.entries().next().value;
        if (!oldestEntry) return;

        const [oldestId, oldestVoice] = oldestEntry;

        // trigger a short release to avoid clicks
        oldestVoice.triggerRelease();
        this.lpf.triggerRelease();

        // cleanup just like in stopNote()
        clearTimeout(oldestVoice.cleanupTimeout);
        oldestVoice.cleanupTimeout = setTimeout(() => {
            oldestVoice.disconnectLfo(this.lfo, this.lfoMode);
            oldestVoice.stop();
            this.activeVoices.delete(oldestId);
        }, oldestVoice.ampEnvelope.release * 1000 * (oldestVoice.ampEnvelope.enabled ? 1 : 0));
    }

    // this is for loudness normalizaton when more than 1 voice active
    updateMasterGain() {
        const activeVoicesArray = Array.from(this.activeVoices.values()).filter(
            (voice) => !voice.isReleasing
        );
        const activeVoiceCount = activeVoicesArray.length || 1;

        const gain = 1 / Math.sqrt(activeVoiceCount);
        setSmoothLevel(this.masterGain.gain, this.audioCtx.currentTime, gain);
    }

    /*
     * SETTERS
     */

    setWaveform(oscIndex, waveform) {
        this.oscillators[oscIndex].setWaveform(waveform);

        for (const voice of this.activeVoices.values()) {
            voice.setWaveform(oscIndex, waveform, this.oscillators);
        }
    }

    setSubWaveform(oscIndex, waveform) {
        this.subOscillators[oscIndex].setWaveform(waveform);

        for (const voice of this.activeVoices.values()) {
            voice.setSubWaveform(oscIndex, waveform);
        }
    }

    setLevel(oscIndex, level) {
        this.oscillators[oscIndex].setLevel(level);

        for (const voice of this.activeVoices.values()) {
            voice.setLevel(oscIndex, level);
        }
    }

    setSubLevel(oscIndex, level) {
        this.subOscillators[oscIndex].setLevel(level);

        for (const voice of this.activeVoices.values()) {
            voice.setSubLevel(oscIndex, level);
        }
    }

    setDetune(oscIndex, detune) {
        this.oscillators[oscIndex].setDetune(detune);

        for (const voice of this.activeVoices.values()) {
            voice.setDetune(oscIndex, detune);
        }
    }

    setPulseWidth(oscIndex, pulseWidth) {
        this.oscillators[oscIndex].setPulseWidth(pulseWidth);

        for (const voice of this.activeVoices.values()) {
            voice.setPulseWidth(oscIndex, pulseWidth);
        }
    }

    setEnvelopeADSR(adsr) {
        this.envelopeParameters = { ...this.envelopeParameters, ...adsr };

        for (const voice of this.activeVoices.values()) {
            voice.setADSR(adsr);
        }
    }

    setVoiceMode(voiceMode) {
        this.voiceMode = voiceMode === "retrigger" ? "retrigger" : "polyphonic";
    }

    setLfoMode(mode) {
        this.lfo.disconnect();
        for (const voice of this.activeVoices.values()) {
            voice.clearConnectedLfo();
        }

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

            for (const { oscillators } of this.activeVoices.values()) {
                setSmoothLevel(
                    oscillators[oscIndex].gain.gain,
                    this.audioCtx.currentTime,
                    bypass ? 0 : this.oscillators[oscIndex].level
                );
            }
        } else if (moduleId.startsWith("subOsc-")) {
            const subOscIndex = parseInt(moduleId.split("-")[1], 10);

            this.subOscillators[subOscIndex].toggleBypass(bypass);

            for (const { subOscillators } of this.activeVoices.values()) {
                setSmoothLevel(
                    subOscillators[subOscIndex].gain.gain,
                    this.audioCtx.currentTime,
                    bypass ? 0 : this.subOscillators[subOscIndex].level
                );
            }
        } else if (moduleId === "ampEnvelope") {
            this.envelopeParameters.isEnabled = !bypass;

            for (const { ampEnvelope } of this.activeVoices.values()) {
                ampEnvelope.toggleBypass(bypass);
            }
        } else {
            this[moduleId].toggleBypass(bypass);
        }
    }
}
