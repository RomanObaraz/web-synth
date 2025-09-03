import { ModulationBus } from "../ModulationBus";
import { BaseModule } from "./BaseModule";

export class OscillatorModule extends BaseModule {
    initAudio(audioCtx) {
        this.audioCtx = audioCtx;
    }

    initModule() {
        this.waveform = "triangle";
        this.setLevel(1);
        this.setDetune(0);
    }

    createOscillator(frequency) {
        const osc = this.audioCtx.createOscillator();
        osc.type = this.waveform;
        osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
        osc.detune.setValueAtTime(this.detune, this.audioCtx.currentTime);

        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(this.enabled ? this.level : 0, this.audioCtx.currentTime);

        const frequencyBus = new ModulationBus(this.audioCtx);
        frequencyBus.connect(osc.frequency);

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

    toggleBypass(on) {
        this.enabled = !on;
    }
}
