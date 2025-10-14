import { useId } from "react";
import { KnobHeadless, KnobHeadlessLabel, KnobHeadlessOutput } from "react-knob-headless";
import { KnobBaseThumb } from "./KnobBaseThumb";
import { mapFrom01Linear, mapTo01Linear } from "../../utils/math";
import { styled } from "@mui/material";

const StyledKnobBase = styled("div", {
    name: "KnobBase",
    slot: "root",
})(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    fontFamily: theme.typography.fontFamily,
    userSelect: "none",
    WebkitUserSelect: "none",
    outlineStyle: "none",
}));

export const KnobBase = ({
    label,
    value,
    valueDefault,
    valueMin,
    valueMax,
    valueRawRoundFn,
    valueRawDisplayFn,
    onValueChange,
    mapTo01 = mapTo01Linear,
    mapFrom01 = mapFrom01Linear,
}) => {
    const knobId = useId();
    const labelId = useId();
    const value01 = mapTo01(value, valueMin, valueMax);
    const dragSensitivity = 0.006;

    const handleDoubleClick = () => {
        onValueChange(valueDefault);
    };

    return (
        <StyledKnobBase>
            <KnobHeadlessLabel id={labelId}>{label}</KnobHeadlessLabel>
            <KnobHeadless
                className="relative w-16 h-16 outline-none"
                id={knobId}
                aria-labelledby={labelId}
                valueMin={valueMin}
                valueMax={valueMax}
                valueRaw={value}
                valueRawRoundFn={valueRawRoundFn}
                valueRawDisplayFn={valueRawDisplayFn}
                dragSensitivity={dragSensitivity}
                axis="xy"
                mapTo01={mapTo01}
                mapFrom01={mapFrom01}
                onValueRawChange={onValueChange}
                onDoubleClick={handleDoubleClick}
            >
                <KnobBaseThumb value01={value01} />
            </KnobHeadless>
            <KnobHeadlessOutput htmlFor={knobId}>{valueRawDisplayFn(value)}</KnobHeadlessOutput>
        </StyledKnobBase>
    );
};
