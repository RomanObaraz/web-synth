import { Card, CardContent, Checkbox, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSynth } from "../hooks/useSynth";
import { CheckBoxOutlineBlank, SquareRounded } from "@mui/icons-material";
import { useToggleStore } from "../stores/useToggleStore";

export const Toggleable = ({ moduleId, label, children }) => {
    const { setBypass } = useSynth();

    const enabled = useToggleStore((state) => state.isEnabled(moduleId));
    const setEnabled = useToggleStore((state) => state.setToggle);

    useEffect(() => {
        setBypass(moduleId, !enabled);
    }, [enabled, moduleId, setBypass]);

    return (
        <Card className="p-4" variant="outlined">
            <div className="flex items-center relative">
                <div className="flex-1">
                    <Typography>{label}</Typography>
                </div>
                <div className="absolute right-0">
                    <Checkbox
                        checked={enabled}
                        icon={<CheckBoxOutlineBlank />}
                        checkedIcon={<SquareRounded />}
                        onChange={(e) => setEnabled(moduleId, e.target.checked)}
                    />
                </div>
            </div>
            <CardContent
                sx={{ padding: "16px !important" }}
                className={`transition-opacity ${
                    enabled ? "opacity-100" : "opacity-25 pointer-events-none"
                }`}
            >
                {children}
            </CardContent>
        </Card>
    );
};
