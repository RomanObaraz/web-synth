export class PulseOscillator {
    constructor(audioCtx, frequency, detune, pulseWidth) {
        this.audioCtx = audioCtx;

        this.output = new AudioWorkletNode(audioCtx, "pulse-oscillator-processor", {
            numberOfOutputs: 1,
            outputChannelCount: [1],
        });

        this.type = "pulse";
        this.frequency = this.output.parameters.get("frequency");
        this.detune = this.output.parameters.get("detune");
        this.pulseWidth = this.output.parameters.get("pulseWidth");

        this.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        this.detune.setValueAtTime(detune, audioCtx.currentTime);
        this.pulseWidth.setValueAtTime(pulseWidth, audioCtx.currentTime);
    }

    connect(dest) {
        this.output.connect(dest);
    }

    disconnect() {
        this.output.disconnect();
    }

    start() {
        this.output.port.postMessage("start");
    }

    stop() {
        this.output.port.postMessage("stop");
    }

    setPulseWidth(pulseWidth) {
        this.pulseWidth.setValueAtTime(pulseWidth, this.audioCtx.currentTime);
    }
}
