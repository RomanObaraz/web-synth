import { useEffect } from "react";
import { useMIDIStore } from "../stores/useMIDIStore";
import { useToggleStore } from "../stores/useToggleStore";
import { ccToModuleId } from "../utils/moduleCCMap";

// ! NOTE: use it only once in App

export function useMIDIManager() {
    useEffect(() => {
        let midiAccess;
        const { pressKey, releaseKey, togglePad } = useMIDIStore.getState();
        const { setToggle } = useToggleStore.getState();

        const handleMIDIMessage = (message) => {
            /*
             * status encodes both the command (upper 4 bits) and channel (lower 4 bits)
             * 0xf0 is a bitmask (11110000)
             * doing status & 0xf0 removes the channel info, leaving only the command
             */
            const [status, midi, velocity] = message.data;
            const command = status & 0xf0;

            switch (command) {
                case 0x90: // note on
                    if (velocity > 0) pressKey(midi);
                    else releaseKey(midi);
                    break;

                case 0x80: // note off
                    releaseKey(midi);
                    break;

                case 0xb0: // CC messages
                    if (midi >= 22 && midi <= 29) {
                        // pads
                        const isOn = velocity === 127;
                        togglePad(midi, isOn);

                        // translate CC to moduleId and update persistent store
                        const moduleId = ccToModuleId[midi];
                        if (moduleId) {
                            setToggle(moduleId, isOn);
                        }
                    }
                    break;
            }
        };

        navigator.requestMIDIAccess().then((midi) => {
            midiAccess = midi;
            for (const input of midi.inputs.values()) {
                input.addEventListener("midimessage", handleMIDIMessage);
            }
        });

        return () => {
            if (midiAccess) {
                for (const input of midiAccess.inputs.values()) {
                    input.removeEventListener("midimessage", handleMIDIMessage);
                }
            }
        };
    }, []);
}
