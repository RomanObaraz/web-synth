import { useCallback, useEffect, useState } from "react";

import { SynthEngine } from "../synth/SynthEngine";
import { SynthContext } from "./SynthContext";
import { useMIDIStore } from "../stores/useMIDIStore";
import { knobMap } from "../utils/knobMap";

export function SynthProvider({ children }) {
    const [synth, setSynth] = useState(null);
    const setKnobEnabled = useMIDIStore((state) => state.setKnobEnabled);

    useEffect(() => {
        const engine = new SynthEngine();
        engine.init().then(() => {
            setSynth(engine);
        });
    }, []);

    const setBypass = useCallback(
        (moduleId, bypass) => {
            if (synth) synth.setBypass(moduleId, bypass);

            const knobCCs = Object.values(knobMap[moduleId]).map((knob) => knob.cc);
            knobCCs.forEach((cc) => setKnobEnabled(cc, !bypass));
        },
        [synth, setKnobEnabled]
    );

    if (!synth) return null;

    return <SynthContext.Provider value={{ synth, setBypass }}>{children}</SynthContext.Provider>;
}
