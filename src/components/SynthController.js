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
            if (midi) handleKeyDown(midi, "keyboard");
        },
        onKeyUp: (key) => {
            const midi = getKeyMIDI(key);
            if (midi) handleKeyUp(midi, "keyboard");
        },
    });

    useMIDIKeyboard({
        onKeyDown: (midi) => handleKeyDown(midi, "MIDIKeyboard"),
        onKeyUp: (midi) => handleKeyUp(midi, "MIDIKeyboard"),
    });

    const handleKeyDown = (midi, device) => {
        if (!midi) return;

        const frequency = MIDIToFrequency(midi);
        const voiceId = synth.playNote(frequency);
        addVoice({ voiceId, midi, device });
    };

    const handleKeyUp = (midi, device) => {
        if (!midi) return;

        let voiceIdToRemove = null;
        for (const [voiceId, voice] of activeVoices.entries()) {
            if (voice.midi === midi && voice.device === device) {
                voiceIdToRemove = voiceId;
                break;
            }
        }

        if (!voiceIdToRemove) return;

        synth.stopNote(voiceIdToRemove);
        removeVoice(voiceIdToRemove);
    };
};
