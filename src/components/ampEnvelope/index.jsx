import { FormControl, FormControlLabel, Radio, RadioGroup, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { KnobTime } from "../knobs/KnobTime";
import { KnobLinear } from "../knobs/KnobLinear";
import { knobMap } from "../../utils/knobMap";

export const AmpEnvelope = ({ moduleId }) => {
    const attackDefault = knobMap[moduleId].attack.default;
    const [attack, setAttack] = useState(attackDefault);

    const decayDefault = knobMap[moduleId].decay.default;
    const [decay, setDecay] = useState(decayDefault);

    const sustainDefault = knobMap[moduleId].sustain.default;
    const [sustain, setSustain] = useState(sustainDefault);

    const releaseDefault = knobMap[moduleId].release.default;
    const [release, setRelease] = useState(releaseDefault);

    const [voiceMode, setVoiceMode] = useState("polyphonic");
    const { synth } = useSynth();

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
        <div className="flex justify-center items-center gap-4">
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

            <FormControl>
                <RadioGroup value={voiceMode} onChange={(e) => setVoiceMode(e.target.value)}>
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
                </RadioGroup>
            </FormControl>
        </div>
    );
};
