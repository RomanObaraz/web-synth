import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { LpfEnvelope } from "./lpfEnvelope";
import { KnobFrequency } from "../knobs/KnobFrequency";
import { KnobLinear } from "../knobs/KnobLinear";

export const LowPassFilter = () => {
    const [cutoff, setCutoff] = useState(20000);
    const [resonance, setResonance] = useState(1);
    const [envDepth, setEnvDepth] = useState(0);

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
                <KnobFrequency label="Cutoff" onValueRawChange={(v) => setCutoff(v)} />
                <KnobLinear
                    label="Resonance"
                    valueDefault={1}
                    valueMin={0.1}
                    valueMax={20}
                    valueDisplayUnit=""
                    onValueRawChange={(v) => setResonance(v)}
                />
                <KnobLinear
                    label="Env depth"
                    valueMin={-2000}
                    valueMax={2000}
                    valueDisplayUnit=" Hz"
                    onValueRawChange={(v) => setEnvDepth(v)}
                />
            </div>

            <LpfEnvelope />
        </div>
    );
};
