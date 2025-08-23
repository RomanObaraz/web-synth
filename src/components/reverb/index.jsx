import { Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";

export const Reverb = () => {
    const [dry, setDry] = useState(1);
    const [wet, setWet] = useState(0);
    const { synth } = useSynth();

    useEffect(() => {
        synth.setReverbMix(dry, wet);
    }, [synth, dry, wet]);

    return (
        <div>
            <Typography gutterBottom>Dry: {dry}</Typography>
            <Slider
                value={dry}
                min={0}
                max={1}
                step={0.01}
                onChange={(e) => setDry(e.target.value)}
            />
            <Typography gutterBottom>Wet: {wet}</Typography>
            <Slider
                value={wet}
                min={0}
                max={1}
                step={0.01}
                onChange={(e) => setWet(e.target.value)}
            />
        </div>
    );
};
