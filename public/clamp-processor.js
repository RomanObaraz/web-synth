class MinMaxClampProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            {
                name: "min",
                defaultValue: 40,
                minValue: 0,
                maxValue: 1e6,
                automationRate: "k-rate",
            },
            {
                name: "max",
                defaultValue: 22050,
                minValue: 0,
                maxValue: 1e6,
                automationRate: "k-rate",
            },
            {
                name: "softness",
                defaultValue: 0,
                minValue: 0,
                maxValue: 10,
                automationRate: "k-rate",
            },
        ];
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];
        if (!input || input.length === 0 || output.length === 0) return true;

        const inChan = input[0];
        const outChan = output[0];

        const minP = parameters.min;
        const maxP = parameters.max;
        const sftP = parameters.softness;

        const N = outChan.length;
        for (let i = 0; i < N; i++) {
            const v = inChan ? inChan[i] : 0;

            const min = minP.length > 1 ? minP[i] : minP[0];
            const max = maxP.length > 1 ? maxP[i] : maxP[0];
            const k = sftP.length > 1 ? sftP[i] : sftP[0];

            let y = v;
            if (k > 0) {
                // Soft saturating clamp using tanh: maps R→(min,max) smoothly
                // Normalize to [-1,1], saturate, then back to [min,max]
                const mid = 0.5 * (min + max);
                const rng = 0.5 * (max - min);
                y = mid + rng * Math.tanh((k * (v - mid)) / rng);
            } else {
                // Hard clamp
                if (y < min) y = min;
                else if (y > max) y = max;
            }
            outChan[i] = y;
        }
        return true;
    }
}

registerProcessor("min-max-clamp-processor", MinMaxClampProcessor);
