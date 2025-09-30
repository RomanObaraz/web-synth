import { Envelope } from "./Envelope";
import { ModulationBus } from "./ModulationBus";
import { getSubOscFrequency, setSmoothLevel } from "./utils";

export class Voice {
    constructor(audioCtx, frequency, oscillators, subOscillators, envelopeParameters, destination) {
        this.audioCtx = audioCtx;
        this.frequency = frequency;

        this.voiceGain = audioCtx.createGain();
        this.voiceGain.gain.value = 0;
        this.voiceGain.connect(destination);

        // create oscillators for this voice
        this.oscillators = oscillators.map((oscillator) => {
            const osc = oscillator.createOscillator(frequency);
            osc.osc.start();
            osc.gain.connect(this.voiceGain);
            return osc;
        });

        this.subOscillators = subOscillators.map((oscillator, i) => {
            // need to use exactly OscillatorModule here for detune value,
            // as the oscillator itself may have not yet set it (with time)
            const subFrequency = getSubOscFrequency(frequency, oscillators[i].detune);
            const osc = oscillator.createOscillator(subFrequency);
            osc.osc.start();
            osc.gain.connect(this.voiceGain);
            return osc;
        });

        this.ampBus = new ModulationBus(audioCtx);
        this.ampBus.connect(this.voiceGain.gain);

        this.ampEnvelope = new Envelope(audioCtx, envelopeParameters);
        this.ampEnvelope.connect(this.ampBus.input);

        this.connectedLfos = []; // need when change to/from pulse wave drops LFOs

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
        this.ampEnvelope.triggerAttack(isRetrigger);
    }

    triggerRelease() {
        this.ampEnvelope.triggerRelease();
    }

    stop() {
        [...this.oscillators, ...this.subOscillators].forEach((o) => o.osc.stop());
    }

    connectLfo(lfo, mode) {
        switch (mode) {
            case "vibrato":
                [...this.oscillators, ...this.subOscillators].forEach((osc) => {
                    lfo.connect(osc.frequencyBus.input);
                });
                break;
            case "tremolo":
                lfo.connect(this.ampBus.input.gain);
                break;
            case "pwm":
                [...this.oscillators, ...this.subOscillators].forEach((osc) => {
                    lfo.connect(osc.pulseWidthBus.input);
                });
                break;
        }

        this.connectedLfos.push({ lfo, mode });
    }

    disconnectLfo(lfo, mode) {
        switch (mode) {
            case "vibrato":
                [...this.oscillators, ...this.subOscillators].forEach((osc) => {
                    lfo.disconnect(osc.frequencyBus.input);
                });
                break;
            case "tremolo":
                lfo.disconnect(this.ampBus.input.gain);
                break;
            case "pwm":
                [...this.oscillators, ...this.subOscillators].forEach((osc) => {
                    lfo.disconnect(osc.pulseWidthBus.input);
                });
                break;
        }

        this.connectedLfos = this.connectedLfos.filter(
            (entry) => !(entry.lfo === lfo && entry.mode === mode)
        );
    }

    clearConnectedLfo() {
        this.connectedLfos = [];
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
            const newOsc = oscModules[i].createOscillator(osc.osc.frequency.value);
            newOsc.gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
            newOsc.gain.gain.linearRampToValueAtTime(
                oscModules[i].level,
                this.audioCtx.currentTime + 0.02
            );

            oldGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.02);

            // connect new one to the same destination
            newOsc.gain.connect(this.voiceGain);
            newOsc.osc.start();

            this.oscillators[i] = newOsc;

            // reconnect all previously connected LFOs for this new oscillator
            this.connectedLfos.forEach(({ lfo, mode }) => {
                switch (mode) {
                    case "vibrato":
                        lfo.connect(newOsc.frequencyBus.input);
                        break;
                    case "pwm":
                        lfo.connect(newOsc.pulseWidthBus.input);
                        break;
                }
            });
        });
    }

    setSubWaveform(index, waveform) {
        this.subOscillators[index].osc.type = waveform;
    }

    setLevel(index, level) {
        setSmoothLevel(this.oscillators[index].gain.gain, this.audioCtx.currentTime, level);
    }

    setSubLevel(index, level) {
        setSmoothLevel(this.subOscillators[index].gain.gain, this.audioCtx.currentTime, level);
    }

    setDetune(index, detune) {
        this.oscillators[index].osc.detune.setValueAtTime(detune, this.audioCtx.currentTime);

        // we can't just change sub osc detune here, so calculate correct frequency
        const subFrequency = getSubOscFrequency(this.frequency, detune);
        this.subOscillators[index]?.osc.frequency.setValueAtTime(
            subFrequency,
            this.audioCtx.currentTime
        );
    }

    setPulseWidth(index, pulseWidth) {
        const clampedPulseWidth = Math.min(0.95, Math.max(0.05, pulseWidth));
        this.oscillators[index].osc.pulseWidth.setValueAtTime(
            clampedPulseWidth,
            this.audioCtx.currentTime
        );
    }

    setADSR(adsr) {
        this.ampEnvelope.setADSR(adsr);
    }
}
