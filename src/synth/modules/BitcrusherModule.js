import { BaseModule } from "./BaseModule";

export class BitcrusherModule extends BaseModule {
    initModule() {
        this.bitcrusher = new AudioWorkletNode(this.audioCtx, "bitcrusher-processor", {
            parameterData: {
                bitDepth: 8,
                reduction: 1,
            },
        });
    }

    route() {
        this.input.connect(this.bitcrusher).connect(this.output);
    }

    setBitDepth(bitDepth) {
        this.bitcrusher.parameters
            .get("bitDepth")
            .setValueAtTime(bitDepth, this.audioCtx.currentTime);
    }

    setReduction(reduction) {
        this.bitcrusher.parameters
            .get("reduction")
            .setValueAtTime(reduction, this.audioCtx.currentTime);
    }
}
