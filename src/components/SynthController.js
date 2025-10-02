import { useCallback } from "react";
import { useKeyboard } from "../hooks/useKeyboard";
import { useMIDIKeyboard } from "../hooks/useMIDIKeyboard";
import { useSynth } from "../hooks/useSynth";
import { useVoiceStore } from "../stores/useVoiceStore";
import { getKeyMIDI } from "../utils/keyboardMap";
import { MIDIToFrequency } from "../utils/math";

export const SynthController = () => {
    const { activeVoices, addVoice, removeVoice } = useVoiceStore();
    const { synth } = useSynth();

    useKeyboard({
        onKeyDown: (key) => {
            const midi = getKeyMIDI(key);
            if (midi) handleKeyDown(midi);
        },
        onKeyUp: (key) => {
            const midi = getKeyMIDI(key);
            if (midi) handleKeyUp(midi);
        },
    });

    useMIDIKeyboard({
        onKeyDown: (midi) => handleKeyDown(midi),
        onKeyUp: (midi) => handleKeyUp(midi),
    });

    const handleKeyDown = useCallback(
        (midi) => {
            if (!midi || activeVoices[midi]) return;

            const frequency = MIDIToFrequency(midi);
            const voiceId = synth.playNote(frequency);

            addVoice(midi, voiceId);
        },
        [activeVoices, addVoice, synth]
    );

    const handleKeyUp = useCallback(
        (midi) => {
            if (!midi || !activeVoices[midi]) return;

            const voiceId = activeVoices[midi];
            synth.stopNote(voiceId);

            removeVoice(midi);
        },
        [activeVoices, removeVoice, synth]
    );
};
