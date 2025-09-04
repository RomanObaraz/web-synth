import { useCallback, useEffect, useState } from "react";
import { SynthEngine } from "../synth/SynthEngine";
import { SynthContext } from "./synthContext";

export function SynthProvider({ children }) {
    const [synth, setSynth] = useState(null);

    useEffect(() => {
        const engine = new SynthEngine();
        engine.init().then(() => {
            setSynth(engine);
        });
    }, []);

    const setBypass = useCallback(
        (moduleId, bypass) => {
            if (synth) synth.setBypass(moduleId, bypass);
        },
        [synth]
    );

    if (!synth) return null;

    return <SynthContext.Provider value={{ synth, setBypass }}>{children}</SynthContext.Provider>;
}
