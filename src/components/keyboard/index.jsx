import { useVoiceStore } from "../../stores/useVoiceStore";
import { keyMidiMap } from "../../utils/keyboardMap";
import { Button } from "@mui/material";

export const Keyboard = () => {
    const { activeVoices, pressKey, releaseKey } = useVoiceStore();

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
                        onPointerDown={() => pressKey(key.midi)}
                        onPointerUp={() => releaseKey(key.midi)}
                        onPointerLeave={(e) => {
                            if (e.buttons & 1) releaseKey(key.midi);
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
