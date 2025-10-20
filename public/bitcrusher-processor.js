class BitcrusherProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            {
                name: "bitDepth",
                defaultValue: 8,
                minValue: 1,
                maxValue: 16,
                automationRate: "k-rate",
            },
            {
                name: "sampleRateHz",
                defaultValue: 44100,
                minValue: 200,
                maxValue: 44100,
                automationRate: "k-rate",
            },
        ];
    }

    constructor() {
        super();
        this.counter = 0;
        this.lastSample = 0;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];
        if (!input.length) return true;

        const bitDepth = Math.max(1, Math.round(parameters.bitDepth[0]));
        const sampleRateHz = Math.max(1, parameters.sampleRateHz[0]);
        const hostRate = sampleRate; // sampleRate is AudioWorkletProcessor global

        // number of host samples to skip before next update
        const interval = hostRate / sampleRateHz;

        const step = 1 / Math.pow(2, bitDepth);

        for (let channel = 0; channel < input.length; channel++) {
            const inputChannel = input[channel];
            const outputChannel = output[channel];

            for (let i = 0; i < inputChannel.length; i++) {
                if (this.counter >= interval) {
                    this.counter -= interval;
                    this.lastSample = Math.round(inputChannel[i] / step) * step;
                }

                outputChannel[i] = this.lastSample;
                this.counter++;
            }
        }

        return true;
    }
}

registerProcessor("bitcrusher-processor", BitcrusherProcessor);
