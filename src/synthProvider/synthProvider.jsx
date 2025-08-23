import { useCallback, useMemo } from "react";
import { SynthContext } from "./synthContext";
import { SynthEngine } from "../synth/SynthEngine";

export function SynthProvider({ children }) {
    const synth = useMemo(() => new SynthEngine(), []);

    const setBypass = useCallback(
        (moduleId, bypass) => {
            synth[moduleId].toggleBypass(bypass);
        },
        [synth]
    );

    return <SynthContext.Provider value={{ synth, setBypass }}>{children}</SynthContext.Provider>;
}
