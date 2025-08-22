import { useEffect, useState } from "react";

export const useKeyboard = ({ onKeyDown, onKeyUp }) => {
    const [activeKeys, setActiveKeys] = useState(new Set());

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeKeys.has(e.key)) return;

            const keySet = new Set(activeKeys);
            keySet.add(e.key);
            setActiveKeys(keySet);

            onKeyDown(e.key);
        };

        const handleKeyUp = (e) => {
            if (!activeKeys.has(e.key)) return;

            const keySet = new Set(activeKeys);
            keySet.delete(e.key);
            setActiveKeys(keySet);

            onKeyUp(e.key);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [activeKeys, onKeyDown, onKeyUp]);

    return activeKeys;
};
