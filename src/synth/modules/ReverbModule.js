import { BaseModule } from "./BaseModule";

export class ReverbModule extends BaseModule {
    initModule() {
        this.convolver = this.audioCtx.createConvolver();
        this.wetGain = this.audioCtx.createGain();
        this.dryGain = this.audioCtx.createGain();

        this.loadImpulse();

        this.setMix(0.5);
    }

    route() {
        this.input.connect(this.dryGain).connect(this.output);
        this.input.connect(this.convolver).connect(this.wetGain).connect(this.output);
    }

    async loadImpulse() {
        const leftBuffer = await fetch("/src/assets/impulses/great-hall-l.wav")
            .then((r) => r.arrayBuffer())
            .then((a) => this.audioCtx.decodeAudioData(a));
        const rightBuffer = await fetch("/src/assets/impulses/great-hall-r.wav")
            .then((r) => r.arrayBuffer())
            .then((a) => this.audioCtx.decodeAudioData(a));

        const stereoBuffer = this.audioCtx.createBuffer(
            2,
            leftBuffer.length,
            this.audioCtx.sampleRate
        );

        stereoBuffer.getChannelData(0).set(leftBuffer.getChannelData(0));
        stereoBuffer.getChannelData(1).set(rightBuffer.getChannelData(0));

        this.convolver.buffer = stereoBuffer;
    }

    setMix(mix) {
        this.dryGain.gain.setValueAtTime(1 - mix, this.audioCtx.currentTime);
        this.wetGain.gain.setValueAtTime(mix, this.audioCtx.currentTime);
    }
}
