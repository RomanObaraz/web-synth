import { create } from "zustand";

export const useParamDisplayStore = create((set) => ({
    current: null, // { moduleLabel, paramLabel, value, timestamp }

    notifyChange: (moduleLabel, paramLabel, value) => {
        const timestamp = Date.now();
        set({
            current: {
                moduleLabel: moduleLabel.toUpperCase(),
                paramLabel: paramLabel.toUpperCase(),
                value: typeof value === "string" ? value.toUpperCase() : value,
                timestamp,
            },
        });

        // auto-clear after 1.5s
        setTimeout(() => {
            set((state) => (state.current?.timestamp === timestamp ? { current: null } : state));
        }, 1500);
    },
}));
