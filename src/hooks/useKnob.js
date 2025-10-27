import { useCallback, useEffect } from "react";

import { useMIDIStore } from "../stores/useMIDIStore";
import { mapFrom01Linear, mapTo01Linear, NormalisableRange } from "../utils/math";
import { useParamDisplayStore } from "../stores/useParamDisplayStore";

export const useKnob = (params, moduleLabel, paramLabel, isInterpolated = false) => {
    const knob = useMIDIStore((state) => state.knobs[params.cc]);
    const setKnobValue = useMIDIStore((state) => state.setKnobValue);
    const notifyChange = useParamDisplayStore((state) => state.notifyChange);
    let mapTo01;
    let mapFrom01;

    if (isInterpolated) {
        const normalisableRange = new NormalisableRange(params.min, params.max, params.center);
        mapTo01 = (x) => normalisableRange.mapTo01(x);
        mapFrom01 = (x) => normalisableRange.mapFrom01(x);
    } else {
        mapTo01 = (x, min, max) => mapTo01Linear(x, min, max);
        mapFrom01 = (x, min, max) => mapFrom01Linear(x, min, max);
    }

    const value = knob !== undefined ? mapFrom01(knob, params.min, params.max) : params.default;

    const setValue = useCallback(
        (newValue) => {
            const normalized = mapTo01(newValue, params.min, params.max);
            setKnobValue(params.cc, normalized);
        },
        [setKnobValue, params.cc, params.min, params.max, mapTo01]
    );

    useEffect(() => {
        notifyChange(moduleLabel, paramLabel, Math.round(value));
    }, [value, notifyChange, moduleLabel, paramLabel]);

    useEffect(() => {
        if (knob === undefined) setValue(params.default);
    }, [knob, setValue, params.default]);

    return { value, setValue };
};
