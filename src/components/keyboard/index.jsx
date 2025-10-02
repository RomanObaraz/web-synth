import { useKeyboard } from "../../hooks/useKeyboard";
import { getKeyMIDI, keyMidiMap } from "../../utils/keyboardMap";
import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import { useSynth } from "../../hooks/useSynth";
import { MIDIToFrequency } from "../../utils/math";
import { useMIDIKeyboard } from "../../hooks/useMIDIKeyboard";

export const Keyboard = () => {
    const [activeVoices, setActiveVoices] = useState({});
    const { synth } = useSynth();

    const handleKeyDown = useCallback(
        (input) => {
            const midi = normalizeInputToMidi(input);
            if (!midi) return;

            setActiveVoices((prev) => {
                if (prev[midi]) return prev;

                const frequency = MIDIToFrequency(midi);
                const voiceId = synth.playNote(frequency);
                return { ...prev, [midi]: voiceId };
            });
        },
        [synth]
    );

    const handleKeyUp = useCallback(
        (input) => {
            const midi = normalizeInputToMidi(input);
            if (!midi) return;

            setActiveVoices((prev) => {
                const voiceId = prev[midi];
                if (!voiceId) return prev;

                synth.stopNote(voiceId);
                const copy = { ...prev };
                delete copy[midi];
                return copy;
            });
        },
        [synth]
    );

    useKeyboard({
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
    });

    useMIDIKeyboard({
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
    });

    return (
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
                        variant={
                            Object.keys(activeVoices).includes(key.midi.toString())
                                ? "contained"
                                : "outlined"
                        }
                    >
                        {key.key}
                    </Button>
                );
            })}
        </div>
    );
};

// helper to normalize input into consistent shape
const normalizeInputToMidi = (input) => {
    return typeof input === "string" ? getKeyMIDI(input) : input;
};
