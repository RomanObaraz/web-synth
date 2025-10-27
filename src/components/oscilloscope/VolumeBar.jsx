import { alpha } from "@mui/material";
import { useEffect, useRef } from "react";

export const VolumeBar = ({ volumeRef, mainColor }) => {
    const barRef = useRef(null);

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
        <div className="w-6">
            <div
                style={{ backgroundColor: alpha(mainColor, 0.7) }}
                className="rounded-sm mb-2 text-black font-black text-xl"
            >
                V
            </div>
            <div
                style={{ borderColor: alpha(mainColor, 0.7) }}
                className="flex items-end h-72 p-1 bg-black border-2 rounded-sm"
            >
                <div
                    ref={barRef}
                    style={{ backgroundColor: mainColor, transform: "scaleY(0)" }}
                    className="w-full h-full origin-bottom rounded-xs transition-transform duration-50"
                />
            </div>
        </div>
    );
};
