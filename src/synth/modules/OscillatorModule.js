import { ModulationBus } from "../ModulationBus";
import { PulseOscillator } from "../PulseOscillator";
import { BaseModule } from "./BaseModule";

export class OscillatorModule extends BaseModule {
    initAudio(audioCtx) {
        this.audioCtx = audioCtx;
    }

    initModule() {
        this.waveform = "triangle";
        this.setLevel(1);
        this.setDetune(0);
        this.setPulseWidth(0.5);
    }

    createOscillator(frequency) {
        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(this.enabled ? this.level : 0, this.audioCtx.currentTime);

        const frequencyBus = new ModulationBus(this.audioCtx);

        let osc;
        if (this.waveform === "pulse") {
            osc = new PulseOscillator(this.audioCtx, frequency, this.detune, this.pulseWidth);
            frequencyBus.connect(osc.frequency);
        } else {
            osc = this.audioCtx.createOscillator();
            osc.type = this.waveform;
            osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
            osc.detune.setValueAtTime(this.detune, this.audioCtx.currentTime);
            frequencyBus.connect(osc.frequency);
        }

        osc.connect(gain);

        return { osc, gain, frequencyBus };
    }

    setWaveform(waveform) {
        this.waveform = waveform;
    }

    setLevel(level) {
        this.level = level;
    }

    setDetune(detune) {
        this.detune = detune;
    }

    setPulseWidth(width) {
        this.pulseWidth = Math.min(0.9, Math.max(0.1, width));
    }

    toggleBypass(on) {
        this.enabled = !on;
    }
}
