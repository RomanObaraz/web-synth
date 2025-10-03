import { useKeyboard } from "../hooks/useKeyboard";
import { useMIDIKeyboard } from "../hooks/useMIDIKeyboard";
import { useNoteController } from "../hooks/useNoteController";
import { getKeyMIDI } from "../utils/keyboardMap";

export const InputController = () => {
    const { handleKeyDown, handleKeyUp } = useNoteController();

    useKeyboard({
        onKeyDown: (key) => {
            const midi = getKeyMIDI(key);
            if (midi) handleKeyDown(midi, "keyboard");
        },
        onKeyUp: (key) => {
            const midi = getKeyMIDI(key);
            if (midi) handleKeyUp(midi, "keyboard");
        },
    });

    useMIDIKeyboard({
        onKeyDown: (midi) => handleKeyDown(midi, "MIDIKeyboard"),
        onKeyUp: (midi) => handleKeyUp(midi, "MIDIKeyboard"),
    });

    return null;
};
