import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";

export const Reverb = () => {
    const [dry, setDry] = useState(100);
    const [wet, setWet] = useState(0);
    const { synth } = useSynth();

    useEffect(() => {
        synth.reverb.setDryWet(dry / 100, wet / 100);
    }, [synth, dry, wet]);

    return (
        <div className="flex justify-center gap-4">
            <KnobLinear label="Dry" valueDefault={100} onValueRawChange={(v) => setDry(v)} />
            <KnobLinear label="Wet" onValueRawChange={(v) => setWet(v)} />
        </div>
    );
};
