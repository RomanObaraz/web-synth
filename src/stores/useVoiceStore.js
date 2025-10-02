import { create } from "zustand";

export const useVoiceStore = create((set) => ({
    activeVoices: {},

    addVoice: (midi, voiceId) =>
        set((state) => {
            if (state.activeVoices[midi]) return state;

            const newVoices = { ...state.activeVoices, [midi]: voiceId };
            return { activeVoices: newVoices };
        }),

    removeVoice: (midi) =>
        set((state) => {
            if (!state.activeVoices[midi]) return state;

            const newVoices = { ...state.activeVoices };
            delete newVoices[midi];
            return { activeVoices: newVoices };
        }),
}));
