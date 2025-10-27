import { useEffect } from "react";

import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";
import { knobMap } from "../../utils/knobMap";
import { useKnob } from "../../hooks/useKnob";
import { usePresetBridge } from "../../hooks/usePresetBridge";

export const Reverb = ({ moduleId, label }) => {
    const mixParams = knobMap[moduleId].mix;
    const { value: mix, setValue: setMix } = useKnob(mixParams, label, "Mix");

    const { synth } = useSynth();

    usePresetBridge(
        moduleId,
        () => ({ mix }),
        (data) => {
            if (!data) return;
            if (data.mix) setMix(data.mix);
        }
    );

    useEffect(() => {
        synth.reverb.setMix(mix / 100);
    }, [synth, mix]);

    return (
        <div className="flex justify-center gap-4">
            <KnobLinear label="Mix" value={mix} onValueChange={(v) => setMix(v)} />
        </div>
    );
};
