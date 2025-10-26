import { useParamDisplayStore } from "../../stores/useParamDisplayStore";

export const ParameterDisplay = ({ mainColor }) => {
    const current = useParamDisplayStore((state) => state.current);
    return (
        <>
            {current && (
                <div
                    style={{ backgroundColor: mainColor }}
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
