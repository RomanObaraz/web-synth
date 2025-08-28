export class Envelope {
    constructor(audioCtx, { attack, decay, sustain, release }) {
        this.audioCtx = audioCtx;

        this.attack = attack;
        this.decay = decay;
        this.sustain = sustain;
        this.release = release;

        // AudioParam controlled by this envelope
        this.parameter = null;
    }

    attachParameter(audioParam) {
        this.parameter = audioParam;
        this.parameter.setValueAtTime(0, this.audioCtx.currentTime);
    }

    triggerAttack(isRetrigger = false) {
        if (!this.parameter) return;

        const now = this.audioCtx.currentTime;
        this.parameter.cancelScheduledValues(now);
        this.parameter.setValueAtTime(isRetrigger ? this.parameter.value : 0, now);

        // attack
        const attackTime = Math.max(this.attack, 0.001);
        this.parameter.linearRampToValueAtTime(1, now + attackTime);

        // decay to sustain
        this.parameter.linearRampToValueAtTime(this.sustain, now + attackTime + this.decay);
    }

    triggerRelease() {
        if (!this.parameter) return;

        const now = this.audioCtx.currentTime;
        this.parameter.cancelScheduledValues(now);
        this.parameter.setValueAtTime(this.parameter.value, now);

        // release
        this.parameter.linearRampToValueAtTime(0, now + this.release);
    }

    setADSR({ attack, decay, sustain, release }) {
        if (attack !== undefined) this.attack = attack;
        if (decay !== undefined) this.decay = decay;
        if (sustain !== undefined) this.sustain = sustain;
        if (release !== undefined) this.release = release;
    }
}
