import { useEffect, useRef } from "react";

export const useKeyboard = ({ onKeyDown, onKeyUp }) => {
    const onKeyDownRef = useRef(onKeyDown);
    const onKeyUpRef = useRef(onKeyUp);

    useEffect(() => {
        onKeyDownRef.current = onKeyDown;
        onKeyUpRef.current = onKeyUp;
    }, [onKeyDown, onKeyUp]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.type === "text") return; // skip handling keys while editing text
            if (e.repeat) return; // skip key hold

            onKeyDownRef.current(e.key);
        };

        const handleKeyUp = (e) => {
            onKeyUpRef.current(e.key);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);
};
