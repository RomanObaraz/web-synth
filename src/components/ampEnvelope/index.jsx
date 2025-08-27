import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Slider,
    Tooltip,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";

export const AmpEnvelope = () => {
    const [attack, setAttack] = useState(0);
    const [decay, setDecay] = useState(0);
    const [sustain, setSustain] = useState(1);
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
        synth.setEnvelopeADSR({ sustain });
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
                <Typography>Attack: {attack}</Typography>
                <Slider
                    value={attack}
                    min={0}
                    max={10}
                    step={0.1}
                    onChange={(e) => setAttack(e.target.value)}
                />
                <Typography>Decay: {decay}</Typography>
                <Slider
                    value={decay}
                    min={0}
                    max={10}
                    step={0.1}
                    onChange={(e) => setDecay(e.target.value)}
                />
                <Typography>Sustain: {sustain}</Typography>
                <Slider
                    value={sustain}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(e) => setSustain(e.target.value)}
                />
                <Typography>Release: {release}</Typography>
                <Slider
                    value={release}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onChange={(e) => setRelease(e.target.value)}
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
