import { useEffect } from "react";
import { useMIDIStore } from "../stores/useMIDIStore";
import { useToggleStore } from "../stores/useToggleStore";
import { padMap } from "../utils/padMap";

// ! NOTE: use it only once in App

export function useMIDIManager() {
    useEffect(() => {
        let midiAccess;
        let midiOutput;

        const { pressKey, releaseKey, togglePad } = useMIDIStore.getState();
        const { isEnabled, setToggle } = useToggleStore.getState();

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
                        const moduleId = padMap.find((pad) => pad.cc === midi)?.moduleId;
                        if (moduleId) {
                            const isOn = !isEnabled(moduleId);
                            togglePad(midi, isOn);
                            setToggle(moduleId, isOn);
                        }
                    }
                    break;
            }
        };

        navigator.requestMIDIAccess({ sysex: true }).then((midi) => {
            midiAccess = midi;
            for (const input of midi.inputs.values()) {
                input.addEventListener("midimessage", handleMIDIMessage);
            }

            midiOutput = [...midiAccess.outputs.values()][0];

            // synchronize pad LEDs and pad store with toggle store
            const unsubscribe = useToggleStore.subscribe(
                (state) => state.toggles,
                (toggles) => {
                    if (!midiOutput) return;

                    for (const [moduleId, isOn] of Object.entries(toggles)) {
                        const padInfo = padMap.find((pad) => pad.moduleId === moduleId);
                        if (!padInfo) continue;

                        const { padNumber, cc } = padInfo;
                        sendPadLED(midiOutput, padNumber, isOn);
                        if (cc !== undefined) {
                            togglePad(cc, isOn);
                        }
                    }
                },
                { fireImmediately: true }
            );

            return () => {
                unsubscribe();
            };
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

function sendPadLED(output, padNumber, on) {
    const state = on ? 0x14 : 0x00;
    const sysex = new Uint8Array([
        0xf0,
        0x00,
        0x20,
        0x6b,
        0x7f,
        0x42,
        0x02,
        0x00,
        0x10,
        padNumber,
        state,
        0xf7,
    ]);
    output.send(sysex);
}
