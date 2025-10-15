import { useEffect } from "react";
import { useSynth } from "../../hooks/useSynth";
import { LpfEnvelope } from "./lpfEnvelope";
import { KnobFrequency } from "../knobs/KnobFrequency";
import { KnobLinear } from "../knobs/KnobLinear";
import { knobMap } from "../../utils/knobMap";
import { useKnob } from "../../hooks/useKnob";

export const LowPassFilter = ({ moduleId }) => {
    const cutoffParams = knobMap[moduleId].cutoff;
    const { value: cutoff, setValue: setCutoff } = useKnob(cutoffParams, true);

    const resonanceParams = knobMap[moduleId].resonance;
    const { value: resonance, setValue: setResonance } = useKnob(resonanceParams);

    const envDepthParams = knobMap[moduleId].envDepth;
    const { value: envDepth, setValue: setEnvDepth } = useKnob(envDepthParams);

    const { synth } = useSynth();

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
        <div className="flex flex-col gap-4">
            <div className="flex justify-center gap-4">
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
                <KnobLinear
                    label="Env depth"
                    value={envDepth}
                    valueMin={envDepthParams.min}
                    valueMax={envDepthParams.max}
                    valueDisplayUnit=" Hz"
                    onValueChange={(v) => setEnvDepth(v)}
                />
            </div>

            <LpfEnvelope moduleId={moduleId} />
        </div>
    );
};
