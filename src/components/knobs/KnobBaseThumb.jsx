import { mapFrom01Linear } from "@dsp-ts/math";

export const KnobBaseThumb = ({ value01 }) => {
    const angleMin = -145;
    const angleMax = 145;
    const angle = mapFrom01Linear(value01, angleMin, angleMax);
    return (
        <div className="absolute h-full w-full rounded-full bg-sky-300">
            <div className="absolute h-full w-full" style={{ rotate: `${angle}deg` }}>
                <div className="absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2 rounded-sm bg-stone-950" />
            </div>
        </div>
    );
};
