import { useCallback, useEffect, useRef, useState } from "react";

export const useKeyboard = ({ onKeyDown, onKeyUp }) => {
    const [activeKeys, setActiveKeys] = useState(new Set());

    const onKeyDownRef = useRef(onKeyDown);
    const onKeyUpRef = useRef(onKeyUp);

    useEffect(() => {
        onKeyDownRef.current = onKeyDown;
        onKeyUpRef.current = onKeyUp;
    }, [onKeyDown, onKeyUp]);

    const handleKeyDown = useCallback((e) => {
        setActiveKeys((prev) => {
            if (prev.has(e.key)) return prev;

            onKeyDownRef.current(e.key);

            const newSet = new Set(prev);
            newSet.add(e.key);
            return newSet;
        });
    }, []);

    const handleKeyUp = useCallback((e) => {
        setActiveKeys((prev) => {
            if (!prev.has(e.key)) return prev;

            onKeyUpRef.current(e.key);

            const newSet = new Set(prev);
            newSet.delete(e.key);
            return newSet;
        });
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    return activeKeys;
};
