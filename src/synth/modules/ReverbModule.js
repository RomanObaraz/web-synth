import { BaseModule } from "./BaseModule";

export class ReverbModule extends BaseModule {
    initModule() {
        this.convolver = this.audioCtx.createConvolver();
        this.wet = this.audioCtx.createGain();
        this.dry = this.audioCtx.createGain();

        this.loadImpulse();

        this.setDryWet(1, 0);
    }

    route() {
        this.input.connect(this.dry).connect(this.output);
        this.input.connect(this.convolver).connect(this.wet).connect(this.output);
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

    setDryWet(dry, wet) {
        this.dry.gain.setValueAtTime(dry, this.audioCtx.currentTime);
        this.wet.gain.setValueAtTime(wet, this.audioCtx.currentTime);
    }
}
