// useNoteController.js
import { useSynth } from "../hooks/useSynth";
import { useVoiceStore } from "../stores/useVoiceStore";
import { MIDIToFrequency } from "../utils/math";

export const useNoteController = () => {
    const { synth } = useSynth();
    const { activeVoices, addVoice, removeVoice } = useVoiceStore();

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

    return { handleKeyDown, handleKeyUp };
};
