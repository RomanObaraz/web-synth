import { useCallback } from "react";

import { KnobBase } from "./KnobBase";

export const KnobLinear = ({
    variant,
    label,
    value,
    valueDefault = 0,
    valueMin = 0,
    valueMax = 100,
    onValueChange,
    valueDisplayRoundPrecision = 0,
    valueDisplayUnit = "%",
}) => {
    const valueRawRoundFn = useCallback(
        (value) => Number(value?.toFixed(valueDisplayRoundPrecision)),
        [valueDisplayRoundPrecision]
    );
    const valueRawDisplayFn = useCallback(
        (value) => `${valueRawRoundFn(value)}${valueDisplayUnit}`,
        [valueRawRoundFn, valueDisplayUnit]
    );

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
        />
    );
};
