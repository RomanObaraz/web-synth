import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { KnobTime } from "../knobs/KnobTime";
import { KnobLinear } from "../knobs/KnobLinear";
import { knobMap } from "../../utils/knobMap";
import { usePresetBridge } from "../../hooks/usePresetBridge";

export const LpfEnvelope = ({ moduleId }) => {
    const attackDefault = knobMap[moduleId].attack.default;
    const [attack, setAttack] = useState(attackDefault);

    const decayDefault = knobMap[moduleId].decay.default;
    const [decay, setDecay] = useState(decayDefault);

    const sustainDefault = knobMap[moduleId].sustain.default;
    const [sustain, setSustain] = useState(sustainDefault);

    const releaseDefault = knobMap[moduleId].release.default;
    const [release, setRelease] = useState(releaseDefault);

    const { synth } = useSynth();

    usePresetBridge(
        "lpf-envelope",
        () => ({ attack, decay, sustain, release }),
        (data) => {
            if (!data) return;
            if (data.attack) setAttack(data.attack);
            if (data.decay !== undefined) setDecay(data.decay);
            if (data.sustain !== undefined) setSustain(data.sustain);
            if (data.release !== undefined) setRelease(data.release);
        }
    );

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
                valueDefault={sustainDefault}
                onValueChange={(v) => setSustain(v)}
            />
            <KnobTime
                variant="warning"
                label="Release"
                value={release}
                valueDefault={releaseDefault}
                onValueChange={(v) => setRelease(v)}
            />
        </div>
    );
};
