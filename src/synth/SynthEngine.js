import { LPFModule } from "./modules/LPFModule";
import { OscillatorModule } from "./modules/OscillatorModule";
import { ReverbModule } from "./modules/ReverbModule";
import { setSmoothLevel } from "./utils";

// TODO: review playNote() and stopNote() if we can move something to OscillatorModule
// TODO: review the setters if we can move something to OscillatorModule
// TODO: can we organize setters better?

export class SynthEngine {
    constructor() {
        this.audioCtx = new AudioContext();

        this.masterGain = this.audioCtx.createGain();
        this.analyser = this.audioCtx.createAnalyser();

        // modules
        this.oscillators = [
            new OscillatorModule(this.audioCtx),
            new OscillatorModule(this.audioCtx),
        ];
        this.lpf = new LPFModule(this.audioCtx);
        this.reverb = new ReverbModule(this.audioCtx);

        this.activeVoices = new Map();

        // connection chain
        this.lpf.output.connect(this.reverb.input);
        this.reverb.output.connect(this.analyser);
        this.analyser.connect(this.masterGain);
        this.masterGain.connect(this.audioCtx.destination);
    }

    playNote(frequency) {
        const voiceGain = this.audioCtx.createGain();
        voiceGain.gain.setValueAtTime(1, this.audioCtx.currentTime);
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

        const voiceId = Symbol();
        this.activeVoices.set(voiceId, { oscs, voiceGain });
        return voiceId;
    }

    stopNote(voiceId) {
        const voice = this.activeVoices.get(voiceId);
        if (!voice) return;

        setSmoothLevel(voice.voiceGain.gain, this.audioCtx.currentTime, 0);

        voice.oscs.forEach((osc) => {
            osc.osc.stop(this.audioCtx.currentTime + 0.05);
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

    // setAnalyserFftSize(fftSize) {
    //     this.analyser.fftSize = fftSize;
    // }

    // setAnalyserTimeDomainData(dataArray) {
    //     this.analyser.getFloatTimeDomainData(dataArray);
    // }

    // setLPFCutoff(cutoff) {
    //     this.lpf.setCutoff(cutoff);
    // }

    // setLPFQuality(Q) {
    //     this.lpf.setQ(Q);
    // }

    // setReverbMix(dry, wet) {
    //     this.reverb.setDryWet(dry, wet);
    // }
}
