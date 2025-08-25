export class DistortionModule {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;

        this.input = audioCtx.createGain();
        this.output = audioCtx.createGain();

        this.waveShaper = this.audioCtx.createWaveShaper();
        this.waveShaper.oversample = "4x";
        this.dryGain = this.audioCtx.createGain();
        this.wetGain = this.audioCtx.createGain();
        this.setDrive(0);
        this.setMix(0);
        this.updateCurve();

        this.enabled = true;
        this.toggleBypass(false);
    }

    setDrive(drive) {
        this.drive = drive;
        this.updateCurve();
    }

    setMix(mix) {
        this.mix = mix;
        this.dryGain.gain.setValueAtTime(1 - this.mix, this.audioCtx.currentTime);
        this.wetGain.gain.setValueAtTime(this.mix, this.audioCtx.currentTime);
    }

    updateCurve() {
        const nSamples = 44100;
        const curve = new Float32Array(nSamples);
        const deg = Math.PI / 180;
        for (let i = 0; i < nSamples; i++) {
            const x = (i * 2) / nSamples - 1;
            curve[i] = ((3 + this.drive) * x * 20 * deg) / (Math.PI + this.drive * Math.abs(x));
        }
        this.waveShaper.curve = curve;
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
            this.input.connect(this.dryGain).connect(this.output);
            this.input.connect(this.waveShaper).connect(this.wetGain).connect(this.output);
        }
    }
}
