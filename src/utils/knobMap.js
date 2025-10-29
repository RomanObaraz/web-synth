export const knobMap = {
    "osc-0": {
        level: { cc: 112, min: 0, max: 100, default: 10 },
        detune: { cc: 74, min: -100, max: 100, default: 0 },
        pulseWidth: { cc: 71, min: 5, max: 95, default: 50 },
    },
    "osc-1": {
        level: { cc: 76, min: 0, max: 100, default: 10 },
        detune: { cc: 77, min: -100, max: 100, default: 0 },
        pulseWidth: { cc: 93, min: 5, max: 95, default: 50 },
    },
    "subOsc-0": {
        level: { cc: 73, min: 0, max: 100, default: 10 },
    },
    ampEnvelope: {
        attack: { cc: null, min: 0, max: 10, default: 0, center: 2 },
        decay: { cc: null, min: 0, max: 10, default: 0, center: 2 },
        sustain: { cc: null, min: 0, max: 100, default: 100 },
        release: { cc: null, min: 0, max: 10, default: 0.1, center: 2 },
    },
    lpf: {
        cutoff: { cc: 91, min: 20, max: 20000, default: 20000, center: 1000 },
        resonance: { cc: 79, min: 0, max: 20, default: 2 },
        envDepth: { cc: null, min: -5000, max: 5000, default: 0 },
        attack: { cc: null, min: 0, max: 10, default: 0, center: 2 },
        decay: { cc: null, min: 0, max: 10, default: 0, center: 2 },
        sustain: { cc: null, min: 0, max: 100, default: 100 },
        release: { cc: null, min: 0, max: 10, default: 0.1, center: 2 },
    },
    reverb: {
        mix: { cc: 17, min: 0, max: 100, default: 0 },
    },
    distortion: {
        drive: { cc: 114, min: 0, max: 100, default: 0 },
        mix: { cc: 18, min: 0, max: 100, default: 0 },
    },
    bitcrusher: {
        bitDepth: { cc: 19, min: 2, max: 16, default: 16 },
        sampleRate: { cc: 16, min: 200, max: 44100, default: 44100, center: 4000 },
    },
    lfo: {
        rate: { cc: 75, min: 0, max: 20, default: 2 },
        depth: {
            cc: 72,
            vibrato: { cc: 72, min: 0, max: 100, default: 5 },
            tremolo: { cc: 72, min: 0, max: 100, default: 50 },
            wah: { cc: 72, min: 0, max: 5000, default: 100, center: 500 },
            pwm: { cc: 72, min: 0, max: 100, default: 40 },
        },
    },
};
