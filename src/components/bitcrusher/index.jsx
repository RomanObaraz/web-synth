import { useEffect } from "react";
import { useKnob } from "../../hooks/useKnob";
import { useSynth } from "../../hooks/useSynth";
import { knobMap } from "../../utils/knobMap";
import { KnobLinear } from "../knobs/KnobLinear";

export const Bitcrusher = ({ moduleId }) => {
    const bitDepthParams = knobMap[moduleId].bitDepth;
    const { value: bitDepth, setValue: setBitDepth } = useKnob(bitDepthParams);

    const reductionParams = knobMap[moduleId].reduction;
    const { value: reduction, setValue: setReduction } = useKnob(reductionParams);

    const { synth } = useSynth();

    useEffect(() => {
        synth.bitcrusher.setBitDepth(Math.round(bitDepth));
    }, [synth, bitDepth]);

    useEffect(() => {
        synth.bitcrusher.setReduction(reduction);
    }, [synth, reduction]);

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
            <KnobLinear
                label="Reduction"
                value={reduction}
                valueDefault={reductionParams.default}
                valueMin={reductionParams.min}
                valueMax={reductionParams.max}
                valueDisplayUnit=""
                onValueChange={(v) => setReduction(v)}
            />
        </div>
    );
};
