import { create } from "zustand";
import { useMIDIStore } from "./useMIDIStore";
import { useToggleStore } from "./useToggleStore";

export const usePresetStore = create((set, get) => ({
    presets: JSON.parse(localStorage.getItem("synth-presets") || "[]"),
    modules: {}, // component-level modules

    registerModule: (id, handlers) =>
        set((state) => ({ modules: { ...state.modules, [id]: handlers } })),

    unregisterModule: (id) =>
        set((state) => {
            const { [id]: _, ...rest } = state.modules;
            return { modules: rest };
        }),

    savePreset: (name) => {
        const modules = get().modules;
        const moduleStates = Object.fromEntries(
            Object.entries(modules).map(([id, h]) => [id, h.getState()])
        );

        const data = {
            midi: useMIDIStore.getState().getPresetState(),
            toggles: useToggleStore.getState().getPresetState(),
            modules: moduleStates,
        };

        const preset = { name, data };
        const updated = [...get().presets.filter((p) => p.name !== name), preset];
        localStorage.setItem("synth-presets", JSON.stringify(updated));
        set({ presets: updated });
    },

    loadPreset: (name) => {
        const preset = get().presets.find((p) => p.name === name);
        if (!preset) return;

        const { midi, toggles, modules } = preset.data;

        useMIDIStore.getState().applyPresetState(midi);
        useToggleStore.getState().applyPresetState(toggles);

        for (const [id, data] of Object.entries(modules || {})) {
            const mod = get().modules[id];
            if (mod?.setState) mod.setState(data);
        }
    },

    deletePreset: (name) => {
        const updated = get().presets.filter((p) => p.name !== name);
        localStorage.setItem("synth-presets", JSON.stringify(updated));
        set({ presets: updated });
    },
}));
