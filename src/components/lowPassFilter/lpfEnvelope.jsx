import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { KnobTime } from "../knobs/KnobTime";
import { KnobLinear } from "../knobs/KnobLinear";

export const LpfEnvelope = () => {
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
            <KnobTime label="Attack" onValueRawChange={(v) => setAttack(v)} />
            <KnobTime label="Decay" onValueRawChange={(v) => setDecay(v)} />
            <KnobLinear
                label="Sustain"
                valueDefault={100}
                onValueRawChange={(v) => setSustain(v)}
            />
            <KnobTime label="Release" valueDefault={0.1} onValueRawChange={(v) => setRelease(v)} />
        </div>
    );
};
