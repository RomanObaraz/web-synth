import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { padMap } from "../utils/padMap";

export const useToggleStore = create(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                toggles: Object.fromEntries(padMap.map((pad) => [pad.moduleId, true])), // { [moduleId]: true/false }

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
    )
);
