import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";
import { useKnob } from "../../hooks/useKnob";
import { knobMap } from "../../utils/knobMap";

export const Oscillator = ({ id, moduleId }) => {
    const [waveform, setWaveform] = useState("sawtooth");

    const levelParams = knobMap[moduleId].level;
    const { value: level, setValue: setLevel } = useKnob(levelParams);

    const detuneParams = knobMap[moduleId].detune;
    const { value: detune, setValue: setDetune } = useKnob(detuneParams);

    const pulseWidthParams = knobMap[moduleId].pulseWidth;
    const { value: pulseWidth, setValue: setPulseWidth } = useKnob(pulseWidthParams);

    const { synth } = useSynth();

    useEffect(() => {
        synth.setWaveform(id, waveform);

        if (waveform === "pulse") {
            setPulseWidth(pulseWidthParams.default);
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
                    onChange={(e) => setWaveform(e.target.value)}
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
                        valueDisplayRoundPrecision={2}
                        onValueChange={(v) => setPulseWidth(Number(v.toFixed(2)))}
                    />
                )}
            </div>
        </div>
    );
};
