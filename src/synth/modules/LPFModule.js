import { Envelope } from "../Envelope";
import { ModulationBus } from "../ModulationBus";
import { BaseModule } from "./BaseModule";

export class LPFModule extends BaseModule {
    initModule() {
        this.filter = this.audioCtx.createBiquadFilter();
        this.filter.type = "lowpass";

        this.baseCutoff = this.audioCtx.createConstantSource();
        this.setCutoff(20000);
        this.setResonance(1);
        this.baseCutoff.start();

        this.envAmount = this.audioCtx.createGain(); // controlled by UI

        this.envelope = new Envelope(this.audioCtx, {
            attack: 0,
            decay: 0,
            sustain: 1,
            release: 0,
        });

        this.cutoffBus = new ModulationBus(this.audioCtx);
    }

    route() {
        this.envelope.connect(this.envAmount);
        this.envAmount.connect(this.cutoffBus.input);
        this.baseCutoff.connect(this.filter.frequency);
        this.cutoffBus.connect(this.filter.frequency);
        this.input.connect(this.filter).connect(this.output);
    }

    triggerAttack() {
        this.envelope.triggerAttack();
    }

    triggerRelease() {
        this.envelope.triggerRelease();
    }

    setCutoff(frequency) {
        this.baseCutoff.offset.setValueAtTime(frequency, this.audioCtx.currentTime);
    }

    setResonance(resonance) {
        this.filter.Q.setValueAtTime(resonance, this.audioCtx.currentTime);
    }

    setEnvAmount(envAmount) {
        this.envAmount.gain.setValueAtTime(envAmount, this.audioCtx.currentTime);
    }

    setADSR(adsr) {
        this.envelope.setADSR(adsr);
    }
}
