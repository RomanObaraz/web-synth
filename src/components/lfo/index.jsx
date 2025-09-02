import {
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Slider,
    Tooltip,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";

export default function LFO() {
    const [waveform, setWaveform] = useState("sine");
    const [rate, setRate] = useState(2);
    const [depth, setDepth] = useState(100);
    const [lfoMode, setLfoMode] = useState("wah");

    const { synth } = useSynth();

    useEffect(() => {
        synth.lfo.setWaveform(waveform);
    }, [synth, waveform]);

    useEffect(() => {
        synth.lfo.setRate(rate);
    }, [synth, rate]);

    useEffect(() => {
        synth.lfo.setDepth(depth);
    }, [synth, depth]);

    useEffect(() => {
        synth.setLfoMode(lfoMode);
    }, [synth, lfoMode]);

    return (
        <div className="flex justify-center items-center gap-8">
            <div className="w-full">
                <FormControl fullWidth>
                    <InputLabel id="wave">Wave</InputLabel>
                    <Select
                        labelId="wave"
                        value={waveform}
                        label="Wave"
                        onChange={(e) => setWaveform(e.target.value)}
                    >
                        <MenuItem value="sine">Sine</MenuItem>
                        <MenuItem value="square">Square</MenuItem>
                        <MenuItem value="triangle">Triangle</MenuItem>
                        <MenuItem value="sawtooth">Sawtooth</MenuItem>
                    </Select>
                </FormControl>
                <Typography>Rate: {rate}</Typography>
                <Slider
                    value={rate}
                    min={0}
                    max={20}
                    step={0.1}
                    onChange={(e) => setRate(e.target.value)}
                />
                <Typography>Depth: {depth}</Typography>
                <Slider
                    value={depth}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(e) => setDepth(e.target.value)}
                />
            </div>

            <FormControl>
                <RadioGroup value={lfoMode} onChange={(e) => setLfoMode(e.target.value)}>
                    <Tooltip title="Vibrato" placement="right">
                        <FormControlLabel value="vibrato" control={<Radio />} label="V" />
                    </Tooltip>
                    <Tooltip title="Tremolo" placement="right">
                        <FormControlLabel value="tremolo" control={<Radio />} label="T" />
                    </Tooltip>
                    <Tooltip title="Wah" placement="right">
                        <FormControlLabel value="wah" control={<Radio />} label="W" />
                    </Tooltip>
                </RadioGroup>
            </FormControl>
        </div>
    );
}
