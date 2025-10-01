import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useMIDIStore = create(
    subscribeWithSelector((set) => ({
        keys: new Set(), // pressed keys (notes)
        pads: {}, // { [cc]: boolean }

        pressKey: (note) =>
            set((state) => {
                const keys = new Set(state.keys);
                keys.add(note);
                return { keys };
            }),

        releaseKey: (note) =>
            set((state) => {
                const keys = new Set(state.keys);
                keys.delete(note);
                return { keys };
            }),

        togglePad: (cc, isOn) =>
            set((state) => {
                const pads = { ...state.pads, [cc]: isOn };
                console.log("pads updated:", pads);
                return { pads };
            }),
    }))
);
