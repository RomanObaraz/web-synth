import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { Slider, Typography } from "@mui/material";

export const Distortion = () => {
    const [drive, setDrive] = useState(0);
    const [mix, setMix] = useState(0);
    const { synth } = useSynth();

    useEffect(() => {
        synth.distortion.setDrive(drive);
    }, [synth, drive]);

    useEffect(() => {
        synth.distortion.setMix(mix);
    }, [synth, mix]);

    return (
        <div>
            <Typography>Drive: {drive}</Typography>
            <Slider
                value={drive}
                min={0}
                max={100}
                step={1}
                onChange={(e) => setDrive(e.target.value)}
            />
            <Typography>Mix: {mix}</Typography>
            <Slider
                value={mix}
                min={0}
                max={1}
                step={0.01}
                onChange={(e) => setMix(e.target.value)}
            />
        </div>
    );
};
