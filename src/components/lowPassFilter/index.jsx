import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { LpfEnvelope } from "./lpfEnvelope";
import { KnobFrequency } from "../knobs/KnobFrequency";
import { KnobLinear } from "../knobs/KnobLinear";
import { knobMap } from "../../utils/knobMap";
import { useKnob } from "../../hooks/useKnob";
import { usePresetBridge } from "../../hooks/usePresetBridge";
import { useParamDisplayStore } from "../../stores/useParamDisplayStore";

export const LowPassFilter = ({ moduleId, label }) => {
    const cutoffParams = knobMap[moduleId].cutoff;
    const { value: cutoff, setValue: setCutoff } = useKnob(cutoffParams, label, "Cutoff", true);

    const resonanceParams = knobMap[moduleId].resonance;
    const { value: resonance, setValue: setResonance } = useKnob(
        resonanceParams,
        label,
        "Resonance"
    );

    const envDepthParams = knobMap[moduleId].envDepth;
    const [envDepth, setEnvDepth] = useState(envDepthParams.default);

    const { synth } = useSynth();
    const notifyChange = useParamDisplayStore((state) => state.notifyChange);

    usePresetBridge(
        moduleId,
        () => ({ cutoff, resonance, envDepth }),
        (data) => {
            if (!data) return;
            if (data.cutoff) setCutoff(data.cutoff);
            if (data.resonance !== undefined) setResonance(data.resonance);
            if (data.envDepth !== undefined) setEnvDepth(data.envDepth);
        }
    );

    useEffect(() => {
        synth.lpf.setCutoff(cutoff);
    }, [synth, cutoff]);

    useEffect(() => {
        synth.lpf.setResonance(resonance);
    }, [synth, resonance]);

    useEffect(() => {
        synth.lpf.setEnvDepth(envDepth);
    }, [synth, envDepth]);

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex gap-4">
                <KnobFrequency label="Cutoff" value={cutoff} onValueChange={(v) => setCutoff(v)} />
                <KnobLinear
                    label="Resonance"
                    value={resonance}
                    valueDefault={resonanceParams.default}
                    valueMin={resonanceParams.min}
                    valueMax={resonanceParams.max}
                    valueDisplayUnit=""
                    onValueChange={(v) => setResonance(v)}
                />
            </div>

            <KnobLinear
                variant="warning"
                label="Env depth"
                value={envDepth}
                valueMin={envDepthParams.min}
                valueMax={envDepthParams.max}
                valueDisplayUnit=" Hz"
                onValueChange={(v) => {
                    setEnvDepth(v);
                    notifyChange(label, "Env Depth", Math.round(v));
                }}
            />

            <LpfEnvelope moduleId={moduleId} label={label} />
        </div>
    );
};
