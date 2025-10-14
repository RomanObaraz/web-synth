import { useCallback, useEffect } from "react";
import { useMIDIStore } from "../stores/useMIDIStore";
import { mapFrom01Linear, mapTo01Linear } from "../utils/math";

export const useKnob = (params) => {
    const knob = useMIDIStore((state) => state.knobs[params.cc]);
    const setKnobValue = useMIDIStore((state) => state.setKnobValue);

    const value =
        knob !== undefined ? mapFrom01Linear(knob, params.min, params.max) : params.default;

    const setValue = useCallback(
        (newValue) => {
            const normalized = mapTo01Linear(newValue, params.min, params.max);
            setKnobValue(params.cc, normalized);
        },
        [setKnobValue, params.cc, params.min, params.max]
    );

    useEffect(() => {
        if (knob === undefined) setValue(params.default);
    }, [knob, setValue, params.default]);

    return { value, setValue };
};
