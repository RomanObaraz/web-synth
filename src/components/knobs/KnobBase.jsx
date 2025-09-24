import { useEffect, useId, useState } from "react";
import { KnobHeadless, KnobHeadlessLabel, KnobHeadlessOutput } from "react-knob-headless";
import { KnobBaseThumb } from "./KnobBaseThumb";
import { mapFrom01Linear, mapTo01Linear } from "../../utils/math";

export const KnobBase = ({
    label,
    valueDefault,
    valueMin,
    valueMax,
    valueRawRoundFn,
    valueRawDisplayFn,
    onValueRawChange,
    mapTo01 = mapTo01Linear,
    mapFrom01 = mapFrom01Linear,
}) => {
    const [valueRaw, setValueRaw] = useState(valueDefault);
    const knobId = useId();
    const labelId = useId();
    const value01 = mapTo01(valueRaw, valueMin, valueMax);
    const dragSensitivity = 0.006;

    useEffect(() => {
        setValueRaw(valueDefault);
    }, [valueDefault]);

    return (
        <div
            className="w-16 flex flex-col gap-0.5 justify-center items-center
            text-xs select-none outline-none focus-within:outline-1
            focus-within:outline-offset-4 focus-within:outline-stone-300"
        >
            <KnobHeadlessLabel id={labelId}>{label}</KnobHeadlessLabel>
            <KnobHeadless
                className="relative w-16 h-16 outline-none"
                id={knobId}
                aria-labelledby={labelId}
                valueMin={valueMin}
                valueMax={valueMax}
                valueRaw={valueRaw}
                valueRawRoundFn={valueRawRoundFn}
                valueRawDisplayFn={valueRawDisplayFn}
                dragSensitivity={dragSensitivity}
                axis="xy"
                mapTo01={mapTo01}
                mapFrom01={mapFrom01}
                onValueRawChange={(v) => {
                    onValueRawChange(v);
                    setValueRaw(v);
                }}
            >
                <KnobBaseThumb value01={value01} />
            </KnobHeadless>
            <KnobHeadlessOutput htmlFor={knobId}>{valueRawDisplayFn(valueRaw)}</KnobHeadlessOutput>
        </div>
    );
};
