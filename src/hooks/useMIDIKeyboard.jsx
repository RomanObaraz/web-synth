import { useEffect, useRef } from "react";

export const useMIDIKeyboard = ({ onKeyDown, onKeyUp }) => {
    const onKeyDownRef = useRef(onKeyDown);
    const onKeyUpRef = useRef(onKeyUp);

    useEffect(() => {
        onKeyDownRef.current = onKeyDown;
        onKeyUpRef.current = onKeyUp;
    }, [onKeyDown, onKeyUp]);

    useEffect(() => {
        let midiAccess;

        const handleMIDIMessage = (message) => {
            /*
             * status encodes both the command (upper 4 bits) and channel (lower 4 bits)
             * 0xf0 is a bitmask (11110000)
             * doing status & 0xf0 removes the channel info, leaving only the command
             */
            const [status, midi] = message.data;
            const command = status & 0xf0;

            if (command === 0x90) {
                // note On
                onKeyDownRef.current(midi);
            } else if (command === 0x80) {
                // note Off
                onKeyUpRef.current(midi);
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
};
