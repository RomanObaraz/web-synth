import { useEffect } from "react";
import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";
import { knobMap } from "../../utils/knobMap";
import { useKnob } from "../../hooks/useKnob";

export const Reverb = ({ moduleId }) => {
    const mixParams = knobMap[moduleId].mix;
    const { value: mix, setValue: setMix } = useKnob(mixParams);

    const { synth } = useSynth();

    useEffect(() => {
        synth.reverb.setMix(mix / 100);
    }, [synth, mix]);

    return (
        <div className="flex justify-center gap-4">
            <KnobLinear label="Mix" value={mix} onValueChange={(v) => setMix(v)} />
        </div>
    );
};
