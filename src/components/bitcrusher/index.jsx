import { useEffect } from "react";
import { useKnob } from "../../hooks/useKnob";
import { useSynth } from "../../hooks/useSynth";
import { knobMap } from "../../utils/knobMap";
import { KnobLinear } from "../knobs/KnobLinear";
import { KnobFrequency } from "../knobs/KnobFrequency";

export const Bitcrusher = ({ moduleId }) => {
    const bitDepthParams = knobMap[moduleId].bitDepth;
    const { value: bitDepth, setValue: setBitDepth } = useKnob(bitDepthParams);

    const sampleRateParams = knobMap[moduleId].sampleRate;
    const { value: sampleRate, setValue: setSampleRate } = useKnob(sampleRateParams, true);

    const { synth } = useSynth();

    useEffect(() => {
        synth.bitcrusher.setBitDepth(Math.round(bitDepth));
    }, [synth, bitDepth]);

    useEffect(() => {
        synth.bitcrusher.setSampleRate(sampleRate);
    }, [synth, sampleRate]);

    return (
        <div className="flex justify-center gap-4">
            <KnobLinear
                label="Bit Depth"
                value={bitDepth}
                valueDefault={bitDepthParams.default}
                valueMin={bitDepthParams.min}
                valueMax={bitDepthParams.max}
                valueDisplayUnit=""
                onValueChange={(v) => setBitDepth(v)}
            />
            <KnobFrequency
                label="Sample Rate"
                value={sampleRate}
                valueDefault={sampleRateParams.default}
                valueMin={sampleRateParams.min}
                valueMax={sampleRateParams.max}
                valueCenter={sampleRateParams.center}
                valueDisplayUnit=""
                onValueChange={(v) => setSampleRate(v)}
            />
        </div>
    );
};
