import { useCallback, useMemo } from "react";

import { KnobBase } from "./KnobBase";
import { NormalisableRange } from "../../utils/math";

export const KnobTime = ({
    variant,
    label,
    value,
    valueDefault = 0,
    valueMin = 0,
    valueMax = 10,
    valueCenter = 2,
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

const valueRawDisplayFn = (s) => {
    if (s < 1) {
        const ms = s * 1000;
        return `${ms.toFixed(0)} ms`;
    }

    return `${s.toFixed(2)} s`;
};
