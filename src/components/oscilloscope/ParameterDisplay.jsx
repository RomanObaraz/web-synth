import { useParamDisplayStore } from "../../stores/useParamDisplayStore";

export const ParameterDisplay = () => {
    const current = useParamDisplayStore((state) => state.current);

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-50">
            {current && (
                <div
                    key={current.timestamp}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-black/80 text-white px-4 py-2 rounded-xl text-sm font-mono shadow-lg"
                >
                    {current.moduleLabel}
                    {current.paramLabel ? ` - ${current.paramLabel}` : ""}: {current.value}
                </div>
            )}
        </div>
    );
};
