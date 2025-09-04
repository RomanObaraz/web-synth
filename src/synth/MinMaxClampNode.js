export class MinMaxClampNode extends AudioWorkletNode {
    constructor(audioCtx, { min = 40, max = audioCtx.sampleRate * 0.49, softness = 0 } = {}) {
        super(audioCtx, "min-max-clamp-processor", {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [1],
        });

        this.parameters.get("min").setValueAtTime(min, audioCtx.currentTime);
        this.parameters.get("max").setValueAtTime(max, audioCtx.currentTime);
        this.parameters.get("softness").setValueAtTime(softness, audioCtx.currentTime);
    }
}
