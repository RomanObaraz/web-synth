import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material";
import { useSynth } from "../../hooks/useSynth";

export const SubOscillator = ({ id }) => {
    const [waveform, setWaveform] = useState("square");
    const [level, setLevel] = useState(10);

    const { synth } = useSynth();

    useEffect(() => {
        synth.setSubWaveform(id, waveform);
    }, [synth, id, waveform]);

    useEffect(() => {
        synth.setSubLevel(id, level / 100);
    }, [synth, id, level]);

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
                    <MenuItem value="square">Square</MenuItem>
                    <MenuItem value="triangle">Triangle</MenuItem>
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
        </div>
    );
};
