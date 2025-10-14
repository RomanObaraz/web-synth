import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";
import { useKnob } from "../../hooks/useKnob";
import { knobMap } from "../../utils/knobMap";

export const SubOscillator = ({ id, moduleId }) => {
    const [waveform, setWaveform] = useState("square");

    const levelParams = knobMap[moduleId].level;
    const { value: level, setValue: setLevel } = useKnob(levelParams);

    const { synth } = useSynth();

    useEffect(() => {
        synth.setSubWaveform(id, waveform);
    }, [synth, id, waveform]);

    useEffect(() => {
        synth.setSubLevel(id, level / 100);
    }, [synth, id, level]);

    return (
        <div className="flex flex-col gap-4 items-center">
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

            <KnobLinear
                label="Level"
                value={level}
                valueDefault={levelParams.default}
                onValueChange={(v) => setLevel(v)}
            />
        </div>
    );
};
