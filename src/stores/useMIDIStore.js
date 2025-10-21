import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { clamp } from "../utils/math";

const KNOB_CENTER = 64 / 127;

export const useMIDIStore = create(
    subscribeWithSelector((set, get) => ({
        keys: new Set(), // pressed keys (notes)
        pads: {}, // { [cc]: boolean }
        knobs: {}, // { [cc]: number (0–1) }
        knobsEnabled: {}, // { [cc]: boolean }

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
                return { pads };
            }),

        setKnobMIDICC: (cc, normalizedValue) => {
            // handle relative #1 deltas
            const delta = normalizedValue - KNOB_CENTER;
            const prevValue = get().knobs[cc] ?? KNOB_CENTER;
            const newValue = clamp(prevValue + delta, 0, 1);

            set((state) => {
                if (state.knobsEnabled[cc] === false) return {};

                return { knobs: { ...state.knobs, [cc]: newValue } };
            });
        },

        // called when knob changes via UI
        setKnobValue: (cc, normalizedValue) => {
            set((state) => {
                if (state.knobsEnabled[cc] === false) return {};

                return { knobs: { ...state.knobs, [cc]: clamp(normalizedValue, 0, 1) } };
            });
        },

        setKnobEnabled: (cc, isEnabled) => {
            set((state) => ({
                knobsEnabled: {
                    ...state.knobsEnabled,
                    [cc]: isEnabled,
                },
            }));
        },

        getPresetState: () => ({
            knobs: get().knobs,
            knobsEnabled: get().knobsEnabled,
        }),

        applyPresetState: (data) => {
            if (!data) return;

            set({
                knobs: data.knobs ?? {},
                knobsEnabled: data.knobsEnabled ?? {},
            });
        },
    }))
);
