export class Envelope {
    constructor(audioCtx, { attack, decay, sustain, release }) {
        this.audioCtx = audioCtx;

        this.attack = attack;
        this.decay = decay;
        this.sustain = sustain;
        this.release = release;
        this._min = 0.001; // floor for exponential ramps

        this.source = audioCtx.createConstantSource();
        this.source.offset.value = 0;
        this.output = this.source;
        this.source.start();
    }

    connect(destination) {
        this.output.connect(destination);
    }

    disconnect(destination) {
        this.output.disconnect(destination);
    }

    triggerAttack(isRetrigger = false) {
        const now = this.audioCtx.currentTime;
        const parameter = this.source.offset;

        parameter.cancelScheduledValues(now);
        parameter.setValueAtTime(Math.max(isRetrigger ? parameter.value : 0, this._min), now);

        // attack
        const attack = Math.max(this.attack, 0.02);
        parameter.exponentialRampToValueAtTime(1, now + attack);

        // decay
        const sustain = Math.max(this.sustain, this._min);
        if (this.decay > 0) {
            parameter.exponentialRampToValueAtTime(sustain, now + attack + this.decay);
        } else {
            parameter.setValueAtTime(sustain, now + attack);
        }
    }

    triggerRelease() {
        const now = this.audioCtx.currentTime;
        const parameter = this.source.offset;

        parameter.cancelScheduledValues(now);
        parameter.setValueAtTime(Math.max(parameter.value, this._min), now);

        // release
        if (this.release > 0) {
            parameter.exponentialRampToValueAtTime(this._min, now + this.release);
        } else {
            parameter.setValueAtTime(this._min, now);
        }
    }

    setADSR({ attack, decay, sustain, release }) {
        if (attack !== undefined) this.attack = attack;
        if (decay !== undefined) this.decay = decay;
        if (sustain !== undefined) this.sustain = sustain;
        if (release !== undefined) this.release = release;
    }
}
