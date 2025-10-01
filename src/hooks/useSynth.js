import { useContext } from "react";
import { SynthContext } from "../SynthProvider/synthContext";

export function useSynth() {
    return useContext(SynthContext);
}
