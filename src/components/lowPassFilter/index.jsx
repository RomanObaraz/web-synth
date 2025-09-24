import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { LpfEnvelope } from "./lpfEnvelope";
import { KnobFrequency } from "../knobs/KnobFrequency";
import { KnobLinear } from "../knobs/KnobLinear";

export const LowPassFilter = () => {
    const [cutoff, setCutoff] = useState(20000);
    const [resonance, setResonance] = useState(1);
    const { synth } = useSynth();

    useEffect(() => {
        synth.lpf.setCutoff(cutoff);
    }, [synth, cutoff]);

    useEffect(() => {
        synth.lpf.setResonance(resonance);
    }, [synth, resonance]);

    return (
        <div>
            <KnobFrequency label="Cutoff" onValueRawChange={(v) => setCutoff(v)} />
            <KnobLinear
                label="Resonance"
                valueDefault={1}
                valueMin={0.1}
                valueMax={20}
                valueDisplayUnit=""
                onValueRawChange={(v) => setResonance(v)}
            />

            <LpfEnvelope />
        </div>
    );
};
