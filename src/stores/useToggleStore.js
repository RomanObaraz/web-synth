import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { padMap } from "../utils/padMap";

export const useToggleStore = create(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                toggles: Object.fromEntries(padMap.map((pad) => [pad.moduleId, true])), // { [moduleId]: boolean }

                setToggle: (moduleId, isEnabled) =>
                    set((state) => ({
                        toggles: { ...state.toggles, [moduleId]: isEnabled },
                    })),

                isEnabled: (moduleId) => {
                    const toggles = get().toggles;
                    return toggles[moduleId] ?? true;
                },

                getPresetState: () => ({
                    toggles: get().toggles,
                }),

                applyPresetState: (data) => {
                    if (!data) return;
                    set({ toggles: { ...get().toggles, ...data.toggles } });
                },
            }),
            { name: "toggle-storage" }
        )
    )
);
