import { useEffect, useRef, useState } from "react";
import { getMIDIKey } from "../synth/keyboardMap";

export const useMIDIKeyboard = ({ onKeyDown, onKeyUp }) => {
    const [activeKeys, setActiveKeys] = useState(new Set());

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
            const [status, note] = message.data;
            const command = status & 0xf0;
            const key = getMIDIKey(note) || note;

            if (command === 0x90) {
                // note On
                setActiveKeys((prev) => {
                    if (prev.has(key)) return prev;

                    onKeyDownRef.current(note);

                    const newSet = new Set(prev);
                    newSet.add(key);
                    return newSet;
                });
            } else if (command === 0x80) {
                // note Off
                setActiveKeys((prev) => {
                    if (!prev.has(key)) return prev;

                    onKeyUpRef.current(note);

                    const newSet = new Set(prev);
                    newSet.delete(key);
                    return newSet;
                });
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

    return activeKeys;
};
