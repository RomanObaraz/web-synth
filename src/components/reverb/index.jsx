import { useEffect } from "react";
import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";
import { knobMap } from "../../utils/knobMap";
import { useKnob } from "../../hooks/useKnob";

export const Reverb = ({ moduleId }) => {
    const dryParams = knobMap[moduleId].dry;
    const { value: dry, setValue: setDry } = useKnob(dryParams);

    const wetParams = knobMap[moduleId].wet;
    const { value: wet, setValue: setWet } = useKnob(wetParams);

    const { synth } = useSynth();

    useEffect(() => {
        synth.reverb.setDryWet(dry / 100, wet / 100);
    }, [synth, dry, wet]);

    return (
        <div className="flex justify-center gap-4">
            <KnobLinear
                label="Dry"
                value={dry}
                valueDefault={dryParams.default}
                onValueChange={(v) => setDry(v)}
            />
            <KnobLinear label="Wet" value={wet} onValueChange={(v) => setWet(v)} />
        </div>
    );
};
