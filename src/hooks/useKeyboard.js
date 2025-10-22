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
            // ignore if typing in input, textarea, or contenteditable
            const tag = e.target.tagName.toLowerCase();
            const isEditable = tag === "input" || tag === "textarea" || e.target.isContentEditable;

            if (isEditable) return; // skip handling keys while editing text
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
