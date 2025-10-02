import { useEffect, useRef } from "react";
import { useMIDIStore } from "../stores/useMIDIStore";

export const useMIDIKeyboard = ({ onKeyDown, onKeyUp }) => {
    const onKeyDownRef = useRef(onKeyDown);
    const onKeyUpRef = useRef(onKeyUp);

    useEffect(() => {
        onKeyDownRef.current = onKeyDown;
        onKeyUpRef.current = onKeyUp;
    }, [onKeyDown, onKeyUp]);

    useEffect(() => {
        let prevKeys = new Set();

        const unsubscribe = useMIDIStore.subscribe(
            (state) => state.keys,
            (currentKeys) => {
                for (const key of currentKeys) {
                    if (!prevKeys.has(key)) {
                        onKeyDownRef.current(key);
                    }
                }

                for (const key of prevKeys) {
                    if (!currentKeys.has(key)) {
                        onKeyUpRef.current(key);
                    }
                }

                prevKeys = new Set(currentKeys);
            }
        );

        return () => unsubscribe();
    }, []);
};
