import { useContext } from "react";

import { SynthContext } from "../synthProvider/SynthContext";

export function useSynth() {
    return useContext(SynthContext);
}
