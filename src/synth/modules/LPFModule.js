export class LPFModule {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;

        this.input = audioCtx.createGain();
        this.output = audioCtx.createGain();

        this.filter = audioCtx.createBiquadFilter();
        this.filter.type = "lowpass";
        this.setCutoff(20000);
        this.setQ(1);

        this.enabled = true;
        this.toggleBypass(false);
    }

    setCutoff(frequency) {
        this.filter.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    }

    setQ(Q) {
        this.filter.Q.setValueAtTime(Q, this.audioCtx.currentTime);
    }

    toggleBypass(on) {
        this.enabled = !on;
        if (on) {
            // bypass
            this.input.disconnect();
            this.input.connect(this.output);
        } else {
            // full routing
            this.input.disconnect();
            this.input.connect(this.filter).connect(this.output);
        }
    }
}
