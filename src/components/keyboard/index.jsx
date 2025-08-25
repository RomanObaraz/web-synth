import { useKeyboard } from "../../hooks/useKeyboard";
import { getKeyFrequency, keyMidiMap } from "../../synth/keyboardMap";
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { useSynth } from "../../hooks/useSynth";

export const Keyboard = () => {
    const [activeVoices, setActiveVoices] = useState({});
    const { synth } = useSynth();

    const onKeyDown = (key) => {
        const frequency = getKeyFrequency(key);
        if (frequency && !activeVoices[key]) {
            const voiceId = synth.playNote(frequency);
            setActiveVoices((prev) => ({ ...prev, [key]: voiceId }));
        }
    };

    const onKeyUp = (key) => {
        const voiceId = activeVoices[key];
        if (voiceId !== undefined) {
            synth.stopNote(voiceId);
            setActiveVoices((prev) => {
                const copy = { ...prev };
                delete copy[key];
                return copy;
            });
        }
    };

    const activeKeys = useKeyboard({
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
