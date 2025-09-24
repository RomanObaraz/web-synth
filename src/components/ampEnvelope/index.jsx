import { FormControl, FormControlLabel, Radio, RadioGroup, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { KnobTime } from "../knobs/KnobTime";
import { KnobLinear } from "../knobs/KnobLinear";

export const AmpEnvelope = () => {
    const [attack, setAttack] = useState(0);
    const [decay, setDecay] = useState(0);
    const [sustain, setSustain] = useState(100);
    const [release, setRelease] = useState(0.1);
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
        <div className="flex justify-center items-center gap-8">
            <div className="w-full">
                <KnobTime label="Attack" onValueRawChange={(v) => setAttack(v)} />
                <KnobTime label="Decay" onValueRawChange={(v) => setDecay(v)} />
                <KnobLinear
                    label="Sustain"
                    valueDefault={100}
                    onValueRawChange={(v) => setSustain(v)}
                />
                <KnobTime
                    label="Release"
                    valueDefault={0.1}
                    onValueRawChange={(v) => setRelease(v)}
                />
            </div>

            <FormControl>
                <RadioGroup value={voiceMode} onChange={(e) => setVoiceMode(e.target.value)}>
                    <Tooltip title="Polyphonic" placement="top">
                        <FormControlLabel value="polyphonic" control={<Radio />} label="P" />
                    </Tooltip>
                    <Tooltip title="Retrigger" placement="bottom">
                        <FormControlLabel value="retrigger" control={<Radio />} label="R" />
                    </Tooltip>
                </RadioGroup>
            </FormControl>
        </div>
    );
};
