import { useEffect } from "react";

import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";
import { knobMap } from "../../utils/knobMap";
import { useKnob } from "../../hooks/useKnob";
import { usePresetBridge } from "../../hooks/usePresetBridge";

export const Distortion = ({ moduleId, label }) => {
    const driveParams = knobMap[moduleId].drive;
    const { value: drive, setValue: setDrive } = useKnob(driveParams, label, "Drive");

    const mixParams = knobMap[moduleId].mix;
    const { value: mix, setValue: setMix } = useKnob(mixParams, label, "Mix");

    const { synth } = useSynth();

    usePresetBridge(
        moduleId,
        () => ({ drive, mix }),
        (data) => {
            if (!data) return;
            if (data.drive) setDrive(data.drive);
            if (data.mix !== undefined) setMix(data.mix);
        }
    );

    useEffect(() => {
        synth.distortion.setDrive(drive);
    }, [synth, drive]);

    useEffect(() => {
        synth.distortion.setMix(mix / 100);
    }, [synth, mix]);

    return (
        <div className="flex justify-center gap-4">
            <KnobLinear label="Drive" value={drive} onValueChange={(v) => setDrive(v)} />
            <KnobLinear label="Mix" value={mix} onValueChange={(v) => setMix(v)} />
        </div>
    );
};
