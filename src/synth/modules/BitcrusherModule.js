import { BaseModule } from "./BaseModule";

export class BitcrusherModule extends BaseModule {
    initModule() {
        this.bitcrusher = new AudioWorkletNode(this.audioCtx, "bitcrusher-processor", {
            parameterData: {
                bitDepth: 16,
                sampleRateHz: 44100,
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

    setSampleRate(sampleRate) {
        this.bitcrusher.parameters
            .get("sampleRateHz")
            .setValueAtTime(sampleRate, this.audioCtx.currentTime);
    }
}
