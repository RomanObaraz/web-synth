import { useTheme } from "@emotion/react";
import { useEffect, useMemo, useRef } from "react";

export const VolumeBar = ({ volumeRef }) => {
    const barRef = useRef(null);
    const theme = useTheme();
    const mainColor = useMemo(() => theme.palette.warning.main, [theme]);

    useEffect(() => {
        let anim;

        const update = () => {
            anim = requestAnimationFrame(update);
            const volume = Math.min(volumeRef.current * 1.5, 1);
            if (barRef.current) {
                barRef.current.style.transform = `scaleY(${volume})`;
            }
        };

        update();

        return () => cancelAnimationFrame(anim);
    }, [volumeRef]);

    return (
        <>
            <div
                style={{ backgroundColor: mainColor }}
                className="w-6 rounded-sm mb-2 text-black font-black text-xl"
            >
                V
            </div>
            <div
                style={{ borderColor: mainColor }}
                className="flex items-end w-6 h-72 p-1 bg-black border-2 rounded-sm"
            >
                <div
                    ref={barRef}
                    style={{ backgroundColor: mainColor, transform: "scaleY(0)" }}
                    className="w-full h-full origin-bottom rounded-xs transition-transform duration-50"
                />
            </div>
        </>
    );
};
