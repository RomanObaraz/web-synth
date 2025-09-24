import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";

export const Oscillator = ({ id }) => {
    const [waveform, setWaveform] = useState("sawtooth");
    const [level, setLevel] = useState(10);
    const [detune, setDetune] = useState(0);
    const [pulseWidth, setPulseWidth] = useState(50);

    const { synth } = useSynth();

    useEffect(() => {
        synth.setWaveform(id, waveform);
    }, [synth, id, waveform]);

    useEffect(() => {
        synth.setLevel(id, level / 100);
    }, [synth, id, level]);

    useEffect(() => {
        synth.setDetune(id, detune);
    }, [synth, id, detune]);

    useEffect(() => {
        synth.setPulseWidth(id, pulseWidth / 100);
    }, [synth, id, pulseWidth]);

    return (
        <>
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

            <KnobLinear label="Level" valueDefault={10} onValueRawChange={(v) => setLevel(v)} />

            <KnobLinear
                label="Detune"
                valueDefault={0}
                valueMin={-100}
                valueMax={100}
                valueDisplayUnit=" cents"
                onValueRawChange={(v) => setDetune(Math.round(v))}
            />

            {waveform === "pulse" && (
                <KnobLinear
                    label="Pulse width"
                    valueDefault={50}
                    valueMin={5}
                    valueMax={95}
                    valueDisplayRoundPrecision={2}
                    onValueRawChange={(v) => setPulseWidth(Number(v.toFixed(2)))}
                />
            )}
        </>
    );
};
