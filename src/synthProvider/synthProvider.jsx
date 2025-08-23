import { useCallback, useMemo } from "react";
import { SynthEngine } from "../synth/SynthEngine";
import { SynthContext } from "./synthContext";

export function SynthProvider({ children }) {
    const synth = useMemo(() => new SynthEngine(), []);

    const setBypass = useCallback(
        (moduleId, bypass) => {
            synth.setBypass(moduleId, bypass);
        },
        [synth]
    );

    return <SynthContext.Provider value={{ synth, setBypass }}>{children}</SynthContext.Provider>;
}
