import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";

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
        <div className="flex flex-col gap-4">
            <FormControl fullWidth>
                <InputLabel id={`wave-subOscillator-label-${id}`}>Wave</InputLabel>
                <Select
                    id={`wave-subOscillator-${id}`}
                    labelId={`wave-subOscillator-label-${id}`}
                    label="Wave"
                    value={waveform}
                    onChange={(e) => setWaveform(e.target.value)}
                >
                    <MenuItem value="sine">Sine</MenuItem>
                    <MenuItem value="square">Square</MenuItem>
                    <MenuItem value="triangle">Triangle</MenuItem>
                    <MenuItem value="sawtooth">Sawtooth</MenuItem>
                </Select>
            </FormControl>

            <KnobLinear label="Level" valueDefault={10} onValueRawChange={(v) => setLevel(v)} />
        </div>
    );
};
