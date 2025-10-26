import { useTheme } from "@emotion/react";
import { useParamDisplayStore } from "../../stores/useParamDisplayStore";
import { useMemo } from "react";

export const ParameterDisplay = () => {
    const current = useParamDisplayStore((state) => state.current);
    const theme = useTheme();

    const bgColor = useMemo(() => theme.palette.warning.main, [theme]);

    return (
        <>
            {current && (
                <div
                    style={{ backgroundColor: bgColor }}
                    className="flex text-black px-4 py-2 font-black text-xl rounded-sm tracking-wider"
                >
                    {current.moduleLabel}
                    {current.paramLabel ? ` - ${current.paramLabel}` : ""}:&nbsp;
                    <span className="min-w-12">{current.value}</span>
                </div>
            )}
        </>
    );
};
