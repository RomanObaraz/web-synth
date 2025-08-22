import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material";
import * as Engine from "../../synth/engine";

export const Oscillator = ({ id }) => {
    const [waveform, setWaveform] = useState("triangle");
    const [level, setLevel] = useState(25);
    const [detune, setDetune] = useState(0);

    useEffect(() => {
        Engine.setWaveform(id, waveform);
    }, [id, waveform]);

    useEffect(() => {
        Engine.setLevel(id, level / 100);
    }, [id, level]);

    useEffect(() => {
        Engine.setDetune(id, detune);
    }, [id, detune]);

    return (
        <div className="w-80">
            <Typography gutterBottom>OSC-{id + 1}</Typography>
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
                        <MenuItem value="square">Square</MenuItem>
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
            </div>
        </div>
    );
};
