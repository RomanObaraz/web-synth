import { useContext } from "react";

import { SynthContext } from "../synthProvider/synthContext";

export function useSynth() {
    return useContext(SynthContext);
}
