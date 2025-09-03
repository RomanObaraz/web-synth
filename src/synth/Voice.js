import { Envelope } from "./Envelope";
import { ModulationBus } from "./ModulationBus";
import { setSmoothLevel } from "./utils";

// TODO: I don't like lpf being passed here, but where to trigger it's attack/release?

export class Voice {
    constructor(audioCtx, frequency, oscillators, lpf, envelopeADSR, destination) {
        this.audioCtx = audioCtx;
        this.frequency = frequency;
        this.lpf = lpf;

        this.voiceGain = this.audioCtx.createGain();
        this.voiceGain.gain.value = 0;
        this.voiceGain.connect(destination);

        // create oscillators for this voice
        this.oscillators = oscillators.map((oscillator) => {
            const osc = oscillator.createOscillator(frequency);
            osc.osc.start();
            osc.gain.connect(this.voiceGain);
            return osc;
        });

        this.ampBus = new ModulationBus(this.audioCtx);
        this.ampBus.connect(this.voiceGain.gain);

        this.envelope = new Envelope(this.audioCtx, envelopeADSR);
        this.envelope.connect(this.ampBus.input);

        this.cleanupTimeout = null;
        this.triggerAttack();
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

    connectLfo(lfo, mode) {
        switch (mode) {
            case "vibrato":
                this.oscillators.forEach((osc) => {
                    lfo.connect(osc.frequencyBus.input);
                });
                break;
            case "tremolo":
                lfo.connect(this.ampBus.input.gain);
                break;
        }
    }

    disconnectLfo(lfo, mode) {
        switch (mode) {
            case "vibrato":
                this.oscillators.forEach((osc) => {
                    lfo.disconnect(osc.frequencyBus.input);
                });
                break;
            case "tremolo":
                lfo.disconnect(this.ampBus.input.gain);
                break;
        }
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
