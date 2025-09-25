import {
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";
import { KnobFrequency } from "../knobs/KnobFrequency";

const depthRangeOptions = {
    vibrato: {
        min: 0,
        max: 100,
        default: 5,
    },
    tremolo: {
        min: 0,
        max: 100,
        default: 50,
    },
    wah: {
        min: 0,
        max: 5000,
        default: 100,
    },
    pwm: {
        min: 0,
        max: 100,
        default: 40,
    },
};

// TODO: Knobs don't reset to default value on lfoMode change
// TODO: create a state for depthRangeDefault?

export default function LFO() {
    const [waveform, setWaveform] = useState("sine");
    const [rate, setRate] = useState(2);
    const [depth, setDepth] = useState(100);
    const [lfoMode, setLfoMode] = useState("wah");
    const [depthRange, setDepthRange] = useState(depthRangeOptions.wah);

    const { synth } = useSynth();

    const handleSetLfoMode = (mode) => {
        if (depthRangeOptions[mode]) {
            setDepthRange(depthRangeOptions[mode]);
            setDepth(depthRangeOptions[mode].default);
            setLfoMode(mode);
        }
    };

    useEffect(() => {
        synth.lfo.setWaveform(waveform);
    }, [synth, waveform]);

    useEffect(() => {
        synth.lfo.setRate(rate);
    }, [synth, rate]);

    useEffect(() => {
        const correctedDepth = lfoMode === "tremolo" || lfoMode === "pwm" ? depth / 100 : depth;
        synth.lfo.setDepth(correctedDepth);
    }, [synth, depth, lfoMode]);

    useEffect(() => {
        synth.setLfoMode(lfoMode);
    }, [synth, lfoMode]);

    return (
        <div className="flex justify-center items-center gap-4">
            <div className="flex flex-col gap-4">
                <FormControl fullWidth>
                    <InputLabel id="wave-lfo-label">Wave</InputLabel>
                    <Select
                        id="wave-lfo"
                        labelId="wave-lfo-label"
                        label="Wave"
                        value={waveform}
                        onChange={(e) => setWaveform(e.target.value)}
                    >
                        <MenuItem value="sine">Sine</MenuItem>
                        <MenuItem value="square">Square</MenuItem>
                        <MenuItem value="triangle">Triangle</MenuItem>
                        <MenuItem value="sawtooth">Sawtooth</MenuItem>
                    </Select>
                </FormControl>

                <div className="flex justify-center gap-4">
                    <KnobLinear
                        label="Rate"
                        valueDefault={2}
                        valueMax={20}
                        valueDisplayUnit=""
                        onValueRawChange={(v) => setRate(v)}
                    />

                    {lfoMode === "wah" ? (
                        <KnobFrequency
                            label="Depth"
                            valueDefault={depthRange.default}
                            valueMin={depthRange.min}
                            valueMax={depthRange.max}
                            valueCenter={500}
                            onValueRawChange={(v) => setDepth(v)}
                        />
                    ) : (
                        <KnobLinear
                            label="Depth"
                            valueDefault={depthRange.default}
                            valueMin={depthRange.min}
                            valueMax={depthRange.max}
                            onValueRawChange={(v) => setDepth(v)}
                        />
                    )}
                </div>
            </div>

            <FormControl>
                <RadioGroup value={lfoMode} onChange={(e) => handleSetLfoMode(e.target.value)}>
                    <Tooltip title="Vibrato" placement="right">
                        <FormControlLabel
                            className="mr-0!"
                            value="vibrato"
                            control={<Radio />}
                            label="V"
                        />
                    </Tooltip>
                    <Tooltip title="Tremolo" placement="right">
                        <FormControlLabel
                            className="mr-0!"
                            value="tremolo"
                            control={<Radio />}
                            label="T"
                        />
                    </Tooltip>
                    <Tooltip title="Wah" placement="right">
                        <FormControlLabel
                            className="mr-0!"
                            value="wah"
                            control={<Radio />}
                            label="W"
                        />
                    </Tooltip>
                    <Tooltip title="PWM" placement="right">
                        <FormControlLabel
                            className="mr-0!"
                            value="pwm"
                            control={<Radio />}
                            label="P"
                        />
                    </Tooltip>
                </RadioGroup>
            </FormControl>
        </div>
    );
}
