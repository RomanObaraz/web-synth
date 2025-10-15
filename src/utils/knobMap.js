export const knobMap = {
    "osc-0": {
        level: { cc: 112, min: 0, max: 100, default: 10 },
        detune: { cc: 74, min: -100, max: 100, default: 0 },
        pulseWidth: { cc: 71, min: 5, max: 95, default: 50 },
    },
    "osc-1": {
        level: { cc: 114, min: 0, max: 100, default: 10 },
        detune: { cc: 18, min: -100, max: 100, default: 0 },
        pulseWidth: { cc: 19, min: 5, max: 95, default: 50 },
    },
    "subOsc-0": {
        level: { cc: 76, min: 0, max: 100, default: 10 },
    },
    ampEnvelope: {
        attack: { cc: null, min: 0, max: 10, default: 0, center: 2 },
        decay: { cc: null, min: 0, max: 10, default: 0, center: 2 },
        sustain: { cc: null, min: 0, max: 100, default: 100 },
        release: { cc: null, min: 0, max: 10, default: 0.1, center: 2 },
    },
    lpf: {
        cutoff: { cc: 16, min: 20, max: 20000, default: 20000, center: 1000 },
        resonance: { cc: 17, min: 0, max: 20, default: 2 },
        envDepth: { cc: 91, min: -2000, max: 2000, default: 0 },
        attack: { cc: null, min: 0, max: 10, default: 0, center: 2 },
        decay: { cc: null, min: 0, max: 10, default: 0, center: 2 },
        sustain: { cc: null, min: 0, max: 100, default: 100 },
        release: { cc: null, min: 0, max: 10, default: 0.1, center: 2 },
    },
    reverb: {
        dry: { cc: 77, min: 0, max: 100, default: 100 },
        wet: { cc: 93, min: 0, max: 100, default: 0 },
    },
    distortion: {
        drive: { cc: 73, min: 0, max: 100, default: 0 },
        mix: { cc: 75, min: 0, max: 100, default: 0 },
    },
    lfo: {
        rate: { cc: 79, min: 0, max: 20, default: 2 },
        depth: {
            vibrato: { cc: 72, min: 0, max: 100, default: 5 },
            tremolo: { cc: 72, min: 0, max: 100, default: 50 },
            wah: { cc: 72, min: 0, max: 5000, default: 100, center: 500 },
            pwm: { cc: 72, min: 0, max: 100, default: 40 },
        },
    },
};
