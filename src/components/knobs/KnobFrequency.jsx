import { useCallback, useMemo } from "react";

import { KnobBase } from "./KnobBase";
import { NormalisableRange } from "../../utils/math";

export const KnobFrequency = ({
    variant,
    label,
    value,
    valueDefault = 20000,
    valueMin = 20,
    valueMax = 20000,
    valueCenter = 1000,
    onValueChange,
}) => {
    const normalisableRange = useMemo(
        () => new NormalisableRange(valueMin, valueMax, valueCenter),
        [valueMin, valueMax, valueCenter]
    );
    const mapTo01 = useCallback((x) => normalisableRange.mapTo01(x), [normalisableRange]);
    const mapFrom01 = useCallback((x) => normalisableRange.mapFrom01(x), [normalisableRange]);

    return (
        <KnobBase
            variant={variant}
            label={label}
            value={value}
            valueDefault={valueDefault}
            valueMin={valueMin}
            valueMax={valueMax}
            onValueChange={onValueChange}
            valueRawRoundFn={valueRawRoundFn}
            valueRawDisplayFn={valueRawDisplayFn}
            mapTo01={mapTo01}
            mapFrom01={mapFrom01}
        />
    );
};

const valueRawRoundFn = (x) => x;

const valueRawDisplayFn = (hz) => {
    if (hz < 100) {
        return `${hz.toFixed(1)} Hz`;
    }

    if (hz < 1000) {
        return `${hz.toFixed(0)} Hz`;
    }

    const kHz = hz / 1000;

    if (hz < 10000) {
        return `${kHz.toFixed(2)} kHz`;
    }

    return `${kHz.toFixed(1)} kHz`;
};
