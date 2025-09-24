import { useCallback } from "react";
import { KnobBase } from "./knobBase";

export const KnobLinear = ({
    label,
    valueDefault = 0,
    valueMin = 0,
    valueMax = 100,
    onValueRawChange,
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
            label={label}
            valueDefault={valueDefault}
            valueMin={valueMin}
            valueMax={valueMax}
            onValueRawChange={onValueRawChange}
            valueRawRoundFn={valueRawRoundFn}
            valueRawDisplayFn={valueRawDisplayFn}
        />
    );
};
