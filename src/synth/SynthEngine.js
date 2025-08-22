import { LPFModule } from "./modules/LPFModule";
import { OscillatorModule } from "./modules/OscillatorModule";
import { ReverbModule } from "./modules/ReverbModule";

// TODO: review playNote() and stopNote() if we can move something to OscillatorModule
// TODO: review the setters if we can move something to OscillatorModule
// TODO: look to commented disconnects in stopNote() after implementing bypass switch
// TODO: they produce clipping sound
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
        // this.osc1.output.connect(this.lpf.input);
        // this.osc2.output.connect(this.lpf.input);
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

        voice.voiceGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        voice.voiceGain.gain.setValueAtTime(voice.voiceGain.gain.value, this.audioCtx.currentTime);
        voice.voiceGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.03);

        voice.oscs.forEach((osc) => {
            osc.osc.stop(this.audioCtx.currentTime + 0.05);
            // osc.osc.disconnect();
        });

        // voice.voiceGain.disconnect();

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
            oscs[oscIndex].gain.gain.setValueAtTime(level, this.audioCtx.currentTime);
        }
    }

    setDetune(oscIndex, detune) {
        this.oscillators[oscIndex].setDetune(detune);

        for (const { oscs } of this.activeVoices.values()) {
            oscs[oscIndex].osc.detune.setValueAtTime(detune, this.audioCtx.currentTime);
        }
    }

    setAnalyserFftSize(fftSize) {
        this.analyser.fftSize = fftSize;
    }

    setAnalyserTimeDomainData(dataArray) {
        this.analyser.getFloatTimeDomainData(dataArray);
    }

    setLPFCutoff(cutoff) {
        this.lpf.setCutoff(cutoff);
    }

    setLPFQuality(Q) {
        this.lpf.setQ(Q);
    }

    setReverbMix(dry, wet) {
        this.reverb.setDryWet(dry, wet);
    }
}
