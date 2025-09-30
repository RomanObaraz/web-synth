import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useToggleStore = create(
    persist(
        (set, get) => ({
            toggles: {}, // { [moduleId]: true/false }

            setToggle: (moduleId, isEnabled) =>
                set((state) => ({
                    toggles: { ...state.toggles, [moduleId]: isEnabled },
                })),

            isEnabled: (moduleId) => {
                const toggles = get().toggles;
                return toggles[moduleId] ?? true;
            },
        }),
        { name: "toggle-storage" }
    )
);
