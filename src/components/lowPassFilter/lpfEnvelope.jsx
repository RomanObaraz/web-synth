import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { KnobTime } from "../knobs/KnobTime";
import { KnobLinear } from "../knobs/KnobLinear";
import { knobMap } from "../../utils/knobMap";

export const LpfEnvelope = ({ moduleId }) => {
    const [attack, setAttack] = useState(0);
    const [decay, setDecay] = useState(0);
    const [sustain, setSustain] = useState(100);
    const [release, setRelease] = useState(0.1);

    const { synth } = useSynth();

    useEffect(() => {
        synth.lpf.setADSR({ attack });
    }, [synth, attack]);

    useEffect(() => {
        synth.lpf.setADSR({ decay });
    }, [synth, decay]);

    useEffect(() => {
        synth.lpf.setADSR({ sustain: sustain / 100 });
    }, [synth, sustain]);

    useEffect(() => {
        synth.lpf.setADSR({ release });
    }, [synth, release]);

    return (
        <div className="flex justify-center gap-4">
            <KnobTime
                variant="warning"
                label="Attack"
                value={attack}
                onValueChange={(v) => setAttack(v)}
            />
            <KnobTime
                variant="warning"
                label="Decay"
                value={decay}
                onValueChange={(v) => setDecay(v)}
            />
            <KnobLinear
                variant="warning"
                label="Sustain"
                value={sustain}
                valueDefault={knobMap[moduleId].sustain.default}
                onValueChange={(v) => setSustain(v)}
            />
            <KnobTime
                variant="warning"
                label="Release"
                value={release}
                valueDefault={knobMap[moduleId].release.default}
                onValueChange={(v) => setRelease(v)}
            />
        </div>
    );
};
