import { BaseModule } from "./BaseModule";

export class LFOModule extends BaseModule {
    initAudio(audioCtx) {
        this.audioCtx = audioCtx;
    }

    initModule() {
        this.osc = this.audioCtx.createOscillator();
        this.gain = this.audioCtx.createGain();

        this.setWaveform("sine");
        this.setRate(1);
        this.setDepth(0);

        this.osc.connect(this.gain);
        this.osc.start();
    }

    connect(audioParam) {
        this.gain.connect(audioParam);
    }

    disconnect(audioParam) {
        this.gain.disconnect(audioParam);
    }

    setWaveform(waveform) {
        this.osc.type = waveform;
    }

    setRate(rate) {
        this.osc.frequency.setValueAtTime(rate, this.audioCtx.currentTime);
    }

    setDepth(depth) {
        this.depth = depth;
        this.gain.gain.setValueAtTime(depth, this.audioCtx.currentTime);
    }

    toggleBypass(on) {
        this.enabled = !on;
        this.gain.gain.setValueAtTime(this.enabled ? this.depth : 0, this.audioCtx.currentTime);
    }
}
