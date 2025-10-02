import { create } from "zustand";

export const useVoiceStore = create((set) => ({
    activeVoices: new Map(),

    addVoice: ({ voiceId, midi, device }) =>
        set((state) => {
            if (state.activeVoices.has(voiceId)) return state;

            const newVoices = new Map(state.activeVoices);
            newVoices.set(voiceId, { midi, device });
            return { activeVoices: newVoices };
        }),

    removeVoice: (voiceId) =>
        set((state) => {
            if (!state.activeVoices.has(voiceId)) return state;

            const newVoices = new Map(state.activeVoices);
            newVoices.delete(voiceId);
            return { activeVoices: newVoices };
        }),
}));
