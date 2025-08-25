export class BaseModule {
    constructor(audioCtx) {
        this.initAudio(audioCtx);
        this.initModule();
        this.initEnabled();
    }

    initAudio(audioCtx) {
        this.audioCtx = audioCtx;

        this.input = audioCtx.createGain();
        this.output = audioCtx.createGain();
    }

    initModule() {
        // specific module behaviour
    }

    initEnabled() {
        this.enabled = true;
        this.toggleBypass(false);
    }

    route() {
        // audio node routing
    }

    toggleBypass(on) {
        this.enabled = !on;
        if (on) {
            // bypass
            this.input.disconnect();
            this.input.connect(this.output);
        } else {
            this.input.disconnect();
            // full routing
            this.route();
        }
    }
}
