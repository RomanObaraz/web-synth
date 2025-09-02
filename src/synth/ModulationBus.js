export class ModulationBus {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;
        this.input = audioCtx.createGain();
        this.output = audioCtx.createGain();
        this.input.connect(this.output);
    }

    connect(audioParam) {
        this.output.connect(audioParam);
    }

    disconnect(audioParam) {
        this.output.disconnect(audioParam);
    }
}
