import { useMemo } from "react";
import { SynthContext } from "./synthContext";
import { SynthEngine } from "../synth/SynthEngine";

export function SynthProvider({ children }) {
    const synth = useMemo(() => new SynthEngine(), []);

    return <SynthContext.Provider value={synth}>{children}</SynthContext.Provider>;
}
