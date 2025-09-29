import { useKeyboard } from "../../hooks/useKeyboard";
import { getKeyMIDI, getMIDIKey, keyMidiMap } from "../../synth/keyboardMap";
import { Button } from "@mui/material";
import { useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { MIDIToFrequency } from "../../utils/math";
import { useMIDIKeyboard } from "../../hooks/useMIDIKeyboard";

export const Keyboard = () => {
    const [activeKeys, setActiveKeys] = useState(new Set());
    const [_, setActiveVoices] = useState({});
    const { synth } = useSynth();

    const handleKeyDown = (input) => {
        const { key, midi } = normalizeKey(input);
        if (!midi) return;

        setActiveKeys((prev) => {
            if (prev.has(key)) return prev;

            const newSet = new Set(prev);
            newSet.add(key);
            return newSet;
        });

        setActiveVoices((prev) => {
            if (prev[midi]) return prev;
            const frequency = MIDIToFrequency(midi);
            const voiceId = synth.playNote(frequency);
            return { ...prev, [midi]: voiceId };
        });
    };

    const handleKeyUp = (input) => {
        const { key, midi } = normalizeKey(input);
        if (!midi) return;

        setActiveKeys((prev) => {
            if (!prev.has(key)) return prev;

            const newSet = new Set(prev);
            newSet.delete(key);
            return newSet;
        });

        setActiveVoices((prev) => {
            const voiceId = prev[midi];
            if (!voiceId) return prev;

            synth.stopNote(voiceId);

            const copy = { ...prev };
            delete copy[midi];
            return copy;
        });
    };

    useKeyboard({
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
    });

    useMIDIKeyboard({
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
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
                            onPointerDown={() => handleKeyDown(key.key)}
                            onPointerUp={() => handleKeyUp(key.key)}
                            onPointerLeave={(e) => {
                                if (e.buttons & 1) handleKeyUp(key.key);
                            }}
                            variant={activeKeys.has(key.key) ? "contained" : "outlined"}
                        >
                            {key.key}
                        </Button>
                    );
                })}
            </div>
        </>
    );
};

// helper to normalize input into consistent shape
const normalizeKey = (input) => {
    if (typeof input === "string") {
        const midi = getKeyMIDI(input);
        return { key: input, midi };
    } else {
        const key = getMIDIKey(input) || input;
        return { key, midi: input };
    }
};
