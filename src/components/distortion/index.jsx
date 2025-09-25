import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";

export const Distortion = () => {
    const [drive, setDrive] = useState(0);
    const [mix, setMix] = useState(0);
    const { synth } = useSynth();

    useEffect(() => {
        synth.distortion.setDrive(drive);
    }, [synth, drive]);

    useEffect(() => {
        synth.distortion.setMix(mix / 100);
    }, [synth, mix]);

    return (
        <div className="flex justify-center gap-4">
            <KnobLinear label="Drive" onValueRawChange={(v) => setDrive(v)} />
            <KnobLinear label="Mix" onValueRawChange={(v) => setMix(v)} />
        </div>
    );
};
