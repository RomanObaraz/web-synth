import { useKeyboard } from "../../hooks/useKeyboard";
import { getKeyMIDI, keyMidiMap } from "../../synth/keyboardMap";
import { Button } from "@mui/material";
import { useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { MIDIToFrequency } from "../../utils/math";
import { useMIDIKeyboard } from "../../hooks/useMIDIKeyboard";

export const Keyboard = () => {
    const [_, setActiveVoices] = useState({});
    const { synth } = useSynth();

    const onKeyDown = (key) => {
        const midi = typeof key === "string" ? getKeyMIDI(key) : key;
        const frequency = MIDIToFrequency(midi);
        if (!frequency) return;

        setActiveVoices((prev) => {
            if (prev[midi]) return prev;
            const voiceId = synth.playNote(frequency);
            return { ...prev, [midi]: voiceId };
        });
    };

    const onKeyUp = (key) => {
        const midi = typeof key === "string" ? getKeyMIDI(key) : key;

        setActiveVoices((prev) => {
            const voiceId = prev[midi];
            if (!voiceId) return prev;

            synth.stopNote(voiceId);

            const copy = { ...prev };
            delete copy[midi];
            return copy;
        });
    };

    const activeKeysKeyboard = useKeyboard({
        onKeyDown,
        onKeyUp,
    });

    const activeKeysMIDI = useMIDIKeyboard({
        onKeyDown,
        onKeyUp,
    });

    return (
        <>
            <div className="flex gap-1.5 justify-center">
                {keyMidiMap.map((key, i) => {
                    const isSharp = key.note.includes("#");
                    return (
                        <Button
                            sx={{
                                minWidth: isSharp ? 40 : 56,
                                width: isSharp ? 40 : 56,
                                height: isSharp ? 112 : 160,
                                marginInline: isSharp ? -3 : 0,
                                zIndex: isSharp ? 1 : 0,
                            }}
                            className="flex !items-end"
                            key={`keyboardKey - ${i}`}
                            onPointerDown={() => onKeyDown(key.key)}
                            onPointerUp={() => onKeyUp(key.key)}
                            onPointerLeave={(e) => {
                                if (e.buttons & 1) onKeyUp(key.key);
                            }}
                            variant={
                                activeKeysKeyboard.has(key.key) || activeKeysMIDI.has(key.key)
                                    ? "contained"
                                    : "outlined"
                            }
                        >
                            {key.key}
                        </Button>
                    );
                })}
            </div>
        </>
    );
};
