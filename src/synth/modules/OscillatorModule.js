// TODO: figure out what to do with commented code
// TODO: how do we connect/disconnect it depending on the bypass option??

export class OscillatorModule {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;

        this.output = audioCtx.createGain();

        this.waveform = "triangle";
        this.level = 1;
        this.detune = 0;

        this.enabled = true;
        this.toggleBypass(false);
    }

    createOscillator(frequency) {
        if (!this.enabled) return null;

        const osc = this.audioCtx.createOscillator();
        osc.type = this.waveform;
        osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
        osc.detune.setValueAtTime(this.detune, this.audioCtx.currentTime);

        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(this.level, this.audioCtx.currentTime);

        osc.connect(gain);
        // gain.connect(this.output);

        return { osc, gain };
    }

    // playNote(frequency) {
    //     if (!this.enabled) return;

    //     const osc = this.audioCtx.createOscillator();
    //     osc.type = this.waveform;
    //     osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    //     osc.detune.setValueAtTime(this.detune, this.audioCtx.currentTime);

    //     const gain = this.audioCtx.createGain();
    //     gain.gain.setValueAtTime(this.level, this.audioCtx.currentTime);

    //     osc.connect(gain).connect(this.output);

    //     osc.start();

    //     const voiceId = Symbol();
    //     this.activeVoices.set(voiceId, { osc, gain });
    // }

    // stopNote(voiceId) {
    //     const voice = this.activeVoices.get(voiceId);
    //     if (voice) {
    //         // time shenanigans remove clipping sound on note stop
    //         voice.gain.gain.cancelScheduledValues(this.audioCtx.currentTime);
    //         voice.gain.gain.setValueAtTime(voice.gain.gain.value, this.audioCtx.currentTime);
    //         voice.gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.03);

    //         voice.osc.stop(this.audioCtx.currentTime + 0.05);

    //         this.activeVoices.delete(voiceId);
    //     }
    // }

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
        if (on) {
            // bypass
            // kill all voices when disabling
            for (const { osc, gain } of this.activeVoices.values()) {
                osc.stop();
                gain.disconnect();
            }
            this.activeVoices.clear();
        }
    }
}
