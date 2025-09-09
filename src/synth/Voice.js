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
            case "pwm":
                this.oscillators.forEach((osc) => {
                    lfo.connect(osc.pulseWidthBus.input);
                });
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

    setWaveform(index, waveform, oscModules) {
        // built-in osc case
        if (this.oscillators[index].osc.type !== "pulse" && waveform !== "pulse") {
            this.oscillators[index].osc.type = waveform;
            return;
        }

        // switching to or from pulse - crossfade
        // we need to recreate both all oscillators to keep them phase aligned
        this.oscillators.forEach((osc, i) => {
            if (!oscModules[i].enabled) return;

            const oldGain = osc.gain;
            const newOscWrapper = oscModules[i].createOscillator(osc.osc.frequency.value);
            newOscWrapper.gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
            newOscWrapper.gain.gain.linearRampToValueAtTime(
                oscModules[i].level,
                this.audioCtx.currentTime + 0.02
            );

            oldGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.02);

            // connect new one to the same destination
            newOscWrapper.gain.connect(this.voiceGain);
            newOscWrapper.osc.start();

            this.oscillators[i] = newOscWrapper;
        });
    }

    setLevel(index, level) {
        setSmoothLevel(this.oscillators[index].gain.gain, this.audioCtx.currentTime, level);
    }

    setDetune(index, detune) {
        this.oscillators[index].osc.detune.setValueAtTime(detune, this.audioCtx.currentTime);
    }

    setPulseWidth(index, pulseWidth) {
        this.oscillators[index].osc.setPulseWidth(pulseWidth);
    }

    setADSR(adsr) {
        this.envelope.setADSR(adsr);
    }
}
