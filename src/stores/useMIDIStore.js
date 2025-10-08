import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { clamp, mapFrom01Linear, mapTo01Linear } from "../utils/math";

const KNOB_MIN = 0;
const KNOB_MAX = 127;
const KNOB_CENTER = 64;

export const useMIDIStore = create(
    subscribeWithSelector((set, get) => ({
        keys: new Set(), // pressed keys (notes)
        pads: {}, // { [cc]: boolean }
        knobs: {}, // { [cc]: { value: number (0–127), normalized: number (0–1) } }

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

        setKnobMIDICC: (cc, value) => {
            // handle relative #1 deltas
            const delta = value - KNOB_CENTER;
            const prevValue = get().knobs[cc]?.value ?? KNOB_CENTER;
            const newValue = clamp(prevValue + delta, KNOB_MIN, KNOB_MAX);

            set((state) => ({
                knobs: {
                    ...state.knobs,
                    [cc]: {
                        value: newValue,
                        normalized: mapTo01Linear(newValue, KNOB_MIN, KNOB_MAX),
                    },
                },
            }));
        },

        // called when knob changes via UI
        setKnobValue: (cc, normalizedValue) => {
            const newValue = clamp(
                mapFrom01Linear(normalizedValue, KNOB_MIN, KNOB_MAX),
                KNOB_MIN,
                KNOB_MAX
            );

            set((state) => ({
                knobs: {
                    ...state.knobs,
                    [cc]: {
                        value: newValue,
                        normalized: clamp(normalizedValue, 0, 1),
                    },
                },
            }));
        },
    }))
);
