let audioCtx;
let filter;
let reverbDryGain;
let reverbWetGain;
const activeVoices = new Map();
export let analyser;

const oscParams = [
    { level: 0.25, detune: 0, waveform: "square" }, // OSC-1
    { level: 0.25, detune: 0, waveform: "square" }, // OSC-2
];

// TODO: do I even need this?
const globalParams = {
    lpfCutoff: 20000,
    lpfQuality: 1,
    reverbDry: 1,
    reverbWet: 0,
};

export const initAudio = async () => {
    if (!audioCtx) {
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();

        filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(globalParams.lpfCutoff, audioCtx.currentTime);
        filter.Q.setValueAtTime(globalParams.lpfQuality, audioCtx.currentTime);

        const convolver = audioCtx.createConvolver();
        const leftBuffer = await fetch("/src/assets/impulses/hall-l.wav")
            .then((r) => r.arrayBuffer())
            .then((a) => audioCtx.decodeAudioData(a));
        const rightBuffer = await fetch("/src/assets/impulses/hall-r.wav")
            .then((r) => r.arrayBuffer())
            .then((a) => audioCtx.decodeAudioData(a));

        const stereoBuffer = audioCtx.createBuffer(2, leftBuffer.length, audioCtx.sampleRate);
        stereoBuffer.getChannelData(0).set(leftBuffer.getChannelData(0));
        stereoBuffer.getChannelData(1).set(rightBuffer.getChannelData(0));
        convolver.buffer = stereoBuffer;

        reverbDryGain = audioCtx.createGain();
        reverbWetGain = audioCtx.createGain();
        reverbDryGain.gain.setValueAtTime(1, audioCtx.currentTime);
        reverbWetGain.gain.setValueAtTime(0, audioCtx.currentTime);

        // visualisation WITHOUT reverb
        // filter.connect(analyser);
        // analyser.connect(reverbDryGain);
        // filter.connect(convolver);
        // convolver.connect(reverbWetGain);
        // reverbDryGain.connect(audioCtx.destination);
        // reverbWetGain.connect(audioCtx.destination);

        // visualisation WITH reverb
        filter.connect(reverbDryGain);
        filter.connect(convolver);
        convolver.connect(reverbWetGain);
        reverbDryGain.connect(analyser);
        reverbWetGain.connect(analyser);
        analyser.connect(audioCtx.destination);
    }
};

export const playNote = (frequency) => {
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(1, audioCtx.currentTime);

    const oscs = oscParams.map((params) => {
        const osc = audioCtx.createOscillator();
        osc.type = params.waveform;
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        osc.detune.setValueAtTime(params.detune, audioCtx.currentTime);

        const oscGain = audioCtx.createGain();
        oscGain.gain.setValueAtTime(params.level, audioCtx.currentTime);

        osc.connect(oscGain).connect(gain);
        osc.start();

        return { osc, oscGain };
    });

    gain.connect(filter);

    const voiceId = Symbol();
    activeVoices.set(voiceId, { oscs, gain, filter });

    return voiceId;
};

export const stopNote = (voiceId) => {
    const voice = activeVoices.get(voiceId);
    if (voice) {
        // time shenanigans remove clipping click sound on note stop
        voice.gain.gain.cancelScheduledValues(audioCtx.currentTime);
        voice.gain.gain.setValueAtTime(voice.gain.gain.value, audioCtx.currentTime);
        voice.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.03);
        voice.oscs.forEach(({ osc }) => osc.stop(audioCtx.currentTime + 0.05));
        activeVoices.delete(voiceId);
    }
};

export const setWaveform = (oscIndex, type) => {
    oscParams[oscIndex].waveform = type;
    for (const { oscs } of activeVoices.values()) {
        oscs[oscIndex].osc.type = type;
    }
};

export const setLevel = (oscIndex, level) => {
    oscParams[oscIndex].level = level;
    for (const { oscs } of activeVoices.values()) {
        oscs[oscIndex].oscGain.gain.setValueAtTime(level, audioCtx.currentTime);
    }
};

export const setDetune = (oscIndex, detune) => {
    oscParams[oscIndex].detune = detune;
    for (const { oscs } of activeVoices.values()) {
        oscs[oscIndex].osc.detune.setValueAtTime(detune, audioCtx.currentTime);
    }
};

export const setLPFCutoff = (cutoff) => {
    globalParams.lpfCutoff = cutoff;
    if (filter) filter.frequency.setValueAtTime(cutoff, audioCtx.currentTime);
};

export const setLPFQuality = (quality) => {
    globalParams.lpfQuality = quality;
    if (filter) filter.Q.setValueAtTime(quality, audioCtx.currentTime);
};

export const setReverbMix = (dry, wet) => {
    if (!reverbDryGain || !reverbWetGain) return;
    reverbDryGain.gain.setValueAtTime(dry, audioCtx.currentTime);
    reverbWetGain.gain.setValueAtTime(wet, audioCtx.currentTime);
};
