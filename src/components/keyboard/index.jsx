import { useNoteController } from "../../hooks/useNoteController";
import { useVoiceStore } from "../../stores/useVoiceStore";
import { keyMidiMap } from "../../utils/keyboardMap";
import { Button } from "@mui/material";

export const Keyboard = () => {
    const { handleKeyDown, handleKeyUp } = useNoteController();
    const { activeVoices } = useVoiceStore();

    return (
        <div className="flex gap-1.5 justify-center">
            {keyMidiMap.map((key, i) => {
                const isSharp = key.note.includes("#");
                return (
                    <Button
                        sx={{
                            minWidth: isSharp ? 34 : 48,
                            width: isSharp ? 34 : 48,
                            height: isSharp ? 100 : 140,
                            marginInline: isSharp ? -2.6 : 0,
                            zIndex: isSharp ? 1 : 0,
                        }}
                        className="flex !items-end"
                        key={`keyboardKey - ${i}`}
                        onPointerDown={() => handleKeyDown(key.midi, "pointer")}
                        onPointerUp={() => handleKeyUp(key.midi, "pointer")}
                        onPointerLeave={(e) => {
                            if (e.buttons & 1) handleKeyUp(key.midi, "pointer");
                        }}
                        variant={
                            Array.from(activeVoices.values()).some((v) => v.midi === key.midi)
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
