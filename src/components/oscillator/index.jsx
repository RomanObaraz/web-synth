import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material";
import { useSynth } from "../../hooks/useSynth";

export const Oscillator = ({ id }) => {
    const [waveform, setWaveform] = useState("pulse");
    const [level, setLevel] = useState(10);
    const [detune, setDetune] = useState(0);
    const [pulseWidth, setPulseWidth] = useState(0.5);

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
        synth.setPulseWidth(id, pulseWidth);
    }, [synth, id, pulseWidth]);

    return (
        <div>
            <FormControl fullWidth>
                <InputLabel id="wave">Wave</InputLabel>
                <Select
                    labelId="wave"
                    value={waveform}
                    label="Wave"
                    onChange={(e) => setWaveform(e.target.value)}
                >
                    <MenuItem value="sine">Sine</MenuItem>
                    <MenuItem value="pulse">Pulse</MenuItem>
                    <MenuItem value="triangle">Triangle</MenuItem>
                    <MenuItem value="sawtooth">Sawtooth</MenuItem>
                </Select>
            </FormControl>

            <div>
                <Typography gutterBottom>Level: {level}</Typography>
                <Slider
                    value={level}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(e) => setLevel(e.target.value)}
                />
            </div>

            <div>
                <Typography gutterBottom>Detune: {detune}</Typography>
                <Slider
                    value={detune}
                    min={-100}
                    max={100}
                    step={1}
                    marks={[{ value: 0 }]}
                    onChange={(e) => setDetune(e.target.value)}
                />
            </div>

            {waveform === "pulse" && (
                <div>
                    <Typography gutterBottom>Pulse width: {pulseWidth}</Typography>
                    <Slider
                        value={pulseWidth}
                        min={0.1}
                        max={0.9}
                        step={0.01}
                        marks={[{ value: 0.5 }]}
                        onChange={(e) => setPulseWidth(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};
