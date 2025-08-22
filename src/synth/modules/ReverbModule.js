export class ReverbModule {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;

        this.input = audioCtx.createGain();
        this.output = audioCtx.createGain();

        this.convolver = audioCtx.createConvolver();
        this.wet = audioCtx.createGain();
        this.dry = audioCtx.createGain();

        this.loadImpulse();

        this.setDryWet(1, 0);

        this.enabled = true;
        this.toggleBypass(false);
    }

    async loadImpulse() {
        const leftBuffer = await fetch("/src/assets/impulses/hall-l.wav")
            .then((r) => r.arrayBuffer())
            .then((a) => this.audioCtx.decodeAudioData(a));
        const rightBuffer = await fetch("/src/assets/impulses/hall-r.wav")
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

    toggleBypass(on) {
        this.enabled = !on;
        if (on) {
            // bypass
            this.input.disconnect();
            this.input.connect(this.output);
        } else {
            // full routing
            this.input.disconnect();
            this.input.connect(this.dry).connect(this.output);
            this.input.connect(this.convolver).connect(this.wet).connect(this.output);
        }
    }
}
