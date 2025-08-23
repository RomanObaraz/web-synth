import { Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";

export const LowPassFilter = () => {
    const [cutoff, setCutoff] = useState(20000);
    const [quality, setQuality] = useState(1);
    const { synth } = useSynth();

    useEffect(() => {
        synth.lpf.setCutoff(cutoff);
    }, [synth, cutoff]);

    useEffect(() => {
        synth.lpf.setQ(quality);
    }, [synth, quality]);

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
            <Typography>Quality: {quality}</Typography>
            <Slider
                value={quality}
                min={0.1}
                max={20}
                step={0.1}
                onChange={(e) => setQuality(e.target.value)}
            />
        </div>
    );
};
