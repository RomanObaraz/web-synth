export class Envelope {
    constructor(audioCtx, { attack, decay, sustain, release }) {
        this.audioCtx = audioCtx;

        this.attack = attack;
        this.decay = decay;
        this.sustain = sustain;
        this.release = release;

        this.parameter = null; // AudioParam controlled by this envelope
        this._min = 0.001; // floor for exponential ramps
    }

    attachParameter(audioParam) {
        this.parameter = audioParam;
        this.parameter.setValueAtTime(0, this.audioCtx.currentTime);
    }

    triggerAttack(isRetrigger = false) {
        if (!this.parameter) return;

        const now = this.audioCtx.currentTime;
        this.parameter.cancelScheduledValues(now);

        this.parameter.setValueAtTime(
            Math.max(isRetrigger ? this.parameter.value : 0, this._min),
            now
        );

        // attack
        if (this.attack <= 0) {
            this.parameter.setValueAtTime(1, now);
        } else {
            this.parameter.exponentialRampToValueAtTime(1, now + this.attack);
        }

        // decay to sustain
        const sustain = Math.max(this.sustain, this._min);
        if (this.decay > 0) {
            this.parameter.exponentialRampToValueAtTime(sustain, now + this.attack + this.decay);
        } else {
            this.parameter.setValueAtTime(sustain, now + this.attack);
        }
    }

    triggerRelease() {
        if (!this.parameter) return;

        const now = this.audioCtx.currentTime;
        this.parameter.cancelScheduledValues(now);
        this.parameter.setValueAtTime(Math.max(this.parameter.value, this._min), now);

        // release
        if (this.release > 0) {
            this.parameter.exponentialRampToValueAtTime(this._min, now + this.release);
        } else {
            this.parameter.setValueAtTime(this._min, now);
        }
    }

    setADSR({ attack, decay, sustain, release }) {
        if (attack !== undefined) this.attack = attack;
        if (decay !== undefined) this.decay = decay;
        if (sustain !== undefined) this.sustain = sustain;
        if (release !== undefined) this.release = release;
    }
}
