class PulseOscillatorProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            {
                name: "frequency",
                defaultValue: 440,
                minValue: 0,
                maxValue: 20000,
                automationRate: "a-rate",
            },
            {
                name: "detune",
                defaultValue: 0,
                minValue: -1200,
                maxValue: 1200,
                automationRate: "a-rate",
            },
            {
                name: "pulseWidth",
                defaultValue: 0.5,
                minValue: 0.05,
                maxValue: 0.95,
                automationRate: "a-rate",
            },
        ];
    }

    constructor() {
        super();
        this.phase = 0;
        this.isPlaying = false;

        this.port.onmessage = (e) => {
            if (e.data === "start") this.isPlaying = true;
            if (e.data === "stop") this.isPlaying = false;
        };
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const channel = output[0];

        if (!this.isPlaying) {
            channel.fill(0);
            return true;
        }

        const sr = sampleRate;
        const freq = parameters.frequency;
        const detune = parameters.detune;
        const pw = parameters.pulseWidth;

        for (let i = 0; i < channel.length; i++) {
            const f = freq.length > 1 ? freq[i] : freq[0];
            const d = detune.length > 1 ? detune[i] : detune[0];
            const width = pw.length > 1 ? pw[i] : pw[0];

            const freqHz = f * Math.pow(2, d / 1200);

            this.phase += freqHz / sr;
            if (this.phase >= 1) this.phase -= 1;

            channel[i] = this.phase < width ? 1 : -1;
        }

        return true;
    }
}

registerProcessor("pulse-oscillator-processor", PulseOscillatorProcessor);
