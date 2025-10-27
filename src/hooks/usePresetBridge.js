import { useEffect, useCallback } from "react";

import { usePresetStore } from "../stores/usePresetStore";

export function usePresetBridge(id, getState, setState) {
    const registerModule = usePresetStore.getState().registerModule;
    const unregisterModule = usePresetStore.getState().unregisterModule;

    const stableGetState = useCallback(getState, [getState]);
    const stableSetState = useCallback(setState, [setState]);

    useEffect(() => {
        registerModule(id, { getState: stableGetState, setState: stableSetState });
        return () => unregisterModule(id);
    }, [id, registerModule, unregisterModule, stableGetState, stableSetState]);
}
