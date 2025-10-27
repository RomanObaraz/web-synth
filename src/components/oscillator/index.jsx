import { useState, useEffect, useRef } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";
import { useKnob } from "../../hooks/useKnob";
import { knobMap } from "../../utils/knobMap";
import { usePresetBridge } from "../../hooks/usePresetBridge";
import { useParamDisplayStore } from "../../stores/useParamDisplayStore";

export const Oscillator = ({ id, moduleId, label }) => {
    const [waveform, setWaveform] = useState("sine");

    const levelParams = knobMap[moduleId].level;
    const { value: level, setValue: setLevel } = useKnob(levelParams, label, "Level");

    const detuneParams = knobMap[moduleId].detune;
    const { value: detune, setValue: setDetune } = useKnob(detuneParams, label, "Detune");

    const pulseWidthParams = knobMap[moduleId].pulseWidth;
    const { value: pulseWidth, setValue: setPulseWidth } = useKnob(
        pulseWidthParams,
        label,
        "PulseWidth"
    );

    const { synth } = useSynth();
    const notifyChange = useParamDisplayStore((state) => state.notifyChange);

    const pulseWidthFromPreset = useRef(null); // hack for proper setPulseWidth on preset load

    usePresetBridge(
        moduleId,
        () => ({ waveform, level, detune, pulseWidth }),
        (data) => {
            if (!data) return;
            if (data.waveform) setWaveform(data.waveform);
            if (data.level !== undefined) setLevel(data.level);
            if (data.detune !== undefined) setDetune(data.detune);
            if (data.pulseWidth !== undefined) pulseWidthFromPreset.current = data.pulseWidth;
        }
    );

    useEffect(() => {
        synth.setWaveform(id, waveform);

        if (waveform === "pulse") {
            if (pulseWidthFromPreset.current !== null) {
                setPulseWidth(pulseWidthFromPreset.current);
                pulseWidthFromPreset.current = null;
            } else {
                setPulseWidth(pulseWidthParams.default);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [synth, id, waveform]);

    useEffect(() => {
        synth.setLevel(id, level / 100);
    }, [synth, id, level]);

    useEffect(() => {
        synth.setDetune(id, detune);
    }, [synth, id, detune]);

    useEffect(() => {
        if (waveform === "pulse") {
            synth.setPulseWidth(id, pulseWidth / 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [synth, id, pulseWidth]);

    return (
        <div className="flex flex-col gap-4">
            <FormControl fullWidth>
                <InputLabel id={`wave-oscillator-label-${id}`}>Wave</InputLabel>
                <Select
                    id={`wave-oscillator-${id}`}
                    labelId={`wave-oscillator-label-${id}`}
                    label="Wave"
                    value={waveform}
                    onChange={(e) => {
                        const value = e.target.value;
                        setWaveform(value);
                        notifyChange(label, "Wave", value);
                    }}
                >
                    <MenuItem value="sine">Sine</MenuItem>
                    <MenuItem value="pulse">Pulse</MenuItem>
                    <MenuItem value="triangle">Triangle</MenuItem>
                    <MenuItem value="sawtooth">Sawtooth</MenuItem>
                </Select>
            </FormControl>

            <div className="flex justify-center gap-4 min-w-40">
                <KnobLinear
                    label="Level"
                    value={level}
                    valueDefault={levelParams.default}
                    onValueChange={(v) => setLevel(v)}
                />

                <KnobLinear
                    label="Detune"
                    value={detune}
                    valueDefault={detuneParams.default}
                    valueMin={detuneParams.min}
                    valueMax={detuneParams.max}
                    valueDisplayUnit=" cents"
                    onValueChange={(v) => setDetune(Math.round(v))}
                />

                {waveform === "pulse" && (
                    <KnobLinear
                        label="PW"
                        value={pulseWidth}
                        valueDefault={pulseWidthParams.default}
                        valueMin={pulseWidthParams.min}
                        valueMax={pulseWidthParams.max}
                        onValueChange={(v) => setPulseWidth(Math.round(v))}
                    />
                )}
            </div>
        </div>
    );
};
