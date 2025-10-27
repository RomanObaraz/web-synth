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
import { useEffect, useRef, useState } from "react";

import { useSynth } from "../../hooks/useSynth";
import { KnobLinear } from "../knobs/KnobLinear";
import { KnobFrequency } from "../knobs/KnobFrequency";
import { knobMap } from "../../utils/knobMap";
import { useKnob } from "../../hooks/useKnob";
import { usePresetBridge } from "../../hooks/usePresetBridge";
import { useParamDisplayStore } from "../../stores/useParamDisplayStore";

export const LFO = ({ moduleId, label }) => {
    const [waveform, setWaveform] = useState("sine");
    const [lfoMode, setLfoMode] = useState("vibrato");

    const rateParams = knobMap[moduleId].rate;
    const { value: rate, setValue: setRate } = useKnob(rateParams, label, "Rate");

    const depthParams = knobMap[moduleId].depth;
    const [depthRange, setDepthRange] = useState(depthParams.vibrato);
    const { value: depth, setValue: setDepth } = useKnob(
        depthRange,
        label,
        "Depth",
        lfoMode === "wah"
    );

    const { synth } = useSynth();
    const notifyChange = useParamDisplayStore((state) => state.notifyChange);

    const depthFromPreset = useRef(null); // hack for proper setDepth on preset load

    usePresetBridge(
        moduleId,
        () => ({ waveform, lfoMode, rate, depth }),
        (data) => {
            if (!data) return;
            if (data.waveform) setWaveform(data.waveform);
            if (data.lfoMode) handleSetLfoMode(data.lfoMode);
            if (data.rate !== undefined) setRate(data.rate);
            if (data.depth !== undefined) depthFromPreset.current = data.depth;
        }
    );

    const handleSetLfoMode = (mode) => {
        if (depthParams[mode]) {
            setLfoMode(mode);
            setDepthRange(depthParams[mode]);
            notifyChange(label, "Mode", lfoMode);
        }
    };

    // this is needed to reset depth value on lfoMode change
    useEffect(() => {
        if (depthFromPreset.current !== null) {
            setDepth(depthFromPreset.current);
            depthFromPreset.current = null;
        } else {
            setDepth(depthParams[lfoMode].default);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lfoMode]);

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
                        onChange={(e) => {
                            const value = e.target.value;
                            setWaveform(value);
                            notifyChange(label, "Wave", value);
                        }}
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
                        value={rate}
                        valueDefault={rateParams.default}
                        valueMax={rateParams.max}
                        valueDisplayUnit=""
                        onValueChange={(v) => setRate(v)}
                    />

                    {lfoMode === "wah" ? (
                        <KnobFrequency
                            label="Depth"
                            value={depth}
                            valueDefault={depthRange.default}
                            valueMin={depthRange.min}
                            valueMax={depthRange.max}
                            valueCenter={depthRange.center}
                            onValueChange={(v) => setDepth(v)}
                        />
                    ) : (
                        <KnobLinear
                            label="Depth"
                            value={depth}
                            valueDefault={depthRange.default}
                            valueMin={depthRange.min}
                            valueMax={depthRange.max}
                            onValueChange={(v) => setDepth(v)}
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
};
