import { FormControl, FormControlLabel, Radio, RadioGroup, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { KnobTime } from "../knobs/KnobTime";
import { KnobLinear } from "../knobs/KnobLinear";
import { knobMap } from "../../utils/knobMap";
import { usePresetBridge } from "../../hooks/usePresetBridge";
import { useParamDisplayStore } from "../../stores/useParamDisplayStore";

export const AmpEnvelope = ({ moduleId, label }) => {
    const attackDefault = knobMap[moduleId].attack.default;
    const [attack, setAttack] = useState(attackDefault, label, "Attack");

    const decayDefault = knobMap[moduleId].decay.default;
    const [decay, setDecay] = useState(decayDefault, label, "Decay");

    const sustainDefault = knobMap[moduleId].sustain.default;
    const [sustain, setSustain] = useState(sustainDefault, label, "Sustain");

    const releaseDefault = knobMap[moduleId].release.default;
    const [release, setRelease] = useState(releaseDefault, label, "Release");

    const [voiceMode, setVoiceMode] = useState("polyphonic");

    const { synth } = useSynth();
    const notifyChange = useParamDisplayStore((state) => state.notifyChange);

    usePresetBridge(
        moduleId,
        () => ({ attack, decay, sustain, release, voiceMode }),
        (data) => {
            if (!data) return;
            if (data.attack) setAttack(data.attack);
            if (data.decay !== undefined) setDecay(data.decay);
            if (data.sustain !== undefined) setSustain(data.sustain);
            if (data.release !== undefined) setRelease(data.release);
            if (data.voiceMode !== undefined) setVoiceMode(data.voiceMode);
        }
    );

    useEffect(() => {
        synth.setEnvelopeADSR({ attack });
    }, [synth, attack]);

    useEffect(() => {
        synth.setEnvelopeADSR({ decay });
    }, [synth, decay]);

    useEffect(() => {
        synth.setEnvelopeADSR({ sustain: sustain / 100 });
    }, [synth, sustain]);

    useEffect(() => {
        synth.setEnvelopeADSR({ release });
    }, [synth, release]);

    useEffect(() => {
        synth.setVoiceMode(voiceMode);
    }, [synth, voiceMode]);

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <div className="grid grid-rows-2 grid-cols-2 gap-4">
                <KnobTime
                    variant="warning"
                    label="Attack"
                    value={attack}
                    onValueChange={(v) => {
                        setAttack(v);
                        notifyChange(label, "Attack", Number(v.toFixed(2)));
                    }}
                />
                <KnobTime
                    variant="warning"
                    label="Decay"
                    value={decay}
                    onValueChange={(v) => {
                        setDecay(v);
                        notifyChange(label, "Decay", Number(v.toFixed(2)));
                    }}
                />
                <KnobLinear
                    variant="warning"
                    label="Sustain"
                    value={sustain}
                    valueDefault={sustainDefault}
                    onValueChange={(v) => {
                        setSustain(v);
                        notifyChange(label, "Sustain", Number(v.toFixed(2)));
                    }}
                />
                <KnobTime
                    variant="warning"
                    label="Release"
                    value={release}
                    valueDefault={releaseDefault}
                    onValueChange={(v) => {
                        setRelease(v);
                        notifyChange(label, "Release", Number(v.toFixed(2)));
                    }}
                />
            </div>

            <FormControl>
                <RadioGroup
                    value={voiceMode}
                    onChange={(e) => {
                        const value = e.target.value;
                        setVoiceMode(value);
                        notifyChange(label, "Voice Mode", value);
                    }}
                >
                    <div className="flex gap-6">
                        <Tooltip title="Polyphonic" placement="top">
                            <FormControlLabel
                                className="mr-0!"
                                value="polyphonic"
                                control={<Radio />}
                                label="P"
                            />
                        </Tooltip>
                        <Tooltip title="Retrigger" placement="bottom">
                            <FormControlLabel
                                className="mr-0!"
                                value="retrigger"
                                control={<Radio />}
                                label="R"
                            />
                        </Tooltip>
                    </div>
                </RadioGroup>
            </FormControl>
        </div>
    );
};
