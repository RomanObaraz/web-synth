import { Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import * as Engine from "../../synth/engine";

export const Effects = () => {
    const [reverbDry, setReverbDry] = useState(1);
    const [reverbWet, setReverbWet] = useState(0);

    useEffect(() => {
        Engine.setReverbMix(reverbDry, reverbWet);
    }, [reverbDry, reverbWet]);

    return (
        <div className="w-120">
            <Typography gutterBottom>Effects</Typography>
            <div>
                <Typography gutterBottom>Reverb</Typography>
                <Typography gutterBottom>Dry: {reverbDry}</Typography>
                <Slider
                    value={reverbDry}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(e) => setReverbDry(e.target.value)}
                />
                <Typography gutterBottom>Wet: {reverbWet}</Typography>
                <Slider
                    value={reverbWet}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(e) => setReverbWet(e.target.value)}
                />
            </div>
        </div>
    );
};
