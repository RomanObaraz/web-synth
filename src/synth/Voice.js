import { Envelope } from "./Envelope";
import { setSmoothLevel } from "./utils";

export class Voice {
    constructor(audioCtx, frequency, oscillators, lpf, envelopeADSR, destination) {
        this.audioCtx = audioCtx;
        this.frequency = frequency;

        this.voiceGain = this.audioCtx.createGain();
        this.voiceGain.connect(destination);

        // create oscillators for this voice
        this.oscillators = oscillators.map((oscillator) => {
            const osc = oscillator.createOscillator(frequency);
            osc.osc.start();
            osc.gain.connect(this.voiceGain);
            return osc;
        });

        this.lpf = lpf;

        // envelope
        this.envelope = new Envelope(audioCtx, envelopeADSR);
        this.envelope.attachParameter(this.voiceGain.gain);
        this.triggerAttack();

        this.cleanupTimeout = null;
    }

    retrigger() {
        if (this.cleanupTimeout) {
            clearTimeout(this.cleanupTimeout);
            this.cleanupTimeout = null;
        }

        this.triggerAttack(true);
    }

    triggerAttack(isRetrigger = false) {
        this.envelope.triggerAttack(isRetrigger);
        this.lpf.triggerAttack();
    }

    triggerRelease() {
        this.envelope.triggerRelease();
        this.lpf.triggerRelease();
    }

    stop() {
        this.oscillators.forEach((osc) => osc.osc.stop());
    }

    setWaveform(index, waveform) {
        this.oscillators[index].osc.type = waveform;
    }

    setLevel(index, level) {
        setSmoothLevel(this.oscillators[index].gain.gain, this.audioCtx.currentTime, level);
    }

    setDetune(index, detune) {
        this.oscillators[index].osc.detune.setValueAtTime(detune, this.audioCtx.currentTime);
    }

    setADSR(adsr) {
        this.envelope.setADSR(adsr);
    }
}
