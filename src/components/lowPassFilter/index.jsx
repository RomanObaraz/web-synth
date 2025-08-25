import { Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";

export const LowPassFilter = () => {
    const [cutoff, setCutoff] = useState(20000);
    const [resonance, setResonance] = useState(1);
    const { synth } = useSynth();

    useEffect(() => {
        synth.lpf.setCutoff(cutoff);
    }, [synth, cutoff]);

    useEffect(() => {
        synth.lpf.setResonance(resonance);
    }, [synth, resonance]);

    return (
        <div>
            <Typography>Cutoff: {cutoff}</Typography>
            <Slider
                value={cutoff}
                min={100}
                max={20000}
                step={1}
                onChange={(e) => setCutoff(e.target.value)}
            />
            <Typography>Resonance: {resonance}</Typography>
            <Slider
                value={resonance}
                min={0.1}
                max={20}
                step={0.1}
                onChange={(e) => setResonance(e.target.value)}
            />
        </div>
    );
};
