import { BaseModule } from "./BaseModule";

export class LPFModule extends BaseModule {
    initModule() {
        this.filter = this.audioCtx.createBiquadFilter();
        this.filter.type = "lowpass";
        this.setCutoff(20000);
        this.setResonance(1);
    }

    route() {
        this.input.connect(this.filter).connect(this.output);
    }

    setCutoff(frequency) {
        this.filter.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    }

    setResonance(resonance) {
        this.filter.Q.setValueAtTime(resonance, this.audioCtx.currentTime);
    }
}
