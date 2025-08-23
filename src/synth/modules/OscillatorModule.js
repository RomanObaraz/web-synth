export class OscillatorModule {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;

        this.waveform = "triangle";
        this.level = 1;
        this.detune = 0;

        this.enabled = true;
        this.toggleBypass(false);
    }

    createOscillator(frequency) {
        const osc = this.audioCtx.createOscillator();
        osc.type = this.waveform;
        osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
        osc.detune.setValueAtTime(this.detune, this.audioCtx.currentTime);

        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(this.enabled ? this.level : 0, this.audioCtx.currentTime);

        osc.connect(gain);

        return { osc, gain };
    }

    setWaveform(waveform) {
        this.waveform = waveform;
    }

    setLevel(level) {
        this.level = level;
    }

    setDetune(detune) {
        this.detune = detune;
    }

    toggleBypass(on) {
        this.enabled = !on;
    }
}
