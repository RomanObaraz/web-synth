import { Card, CardContent, Checkbox, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSynth } from "../hooks/useSynth";
import { CheckBoxOutlineBlank, SquareRounded } from "@mui/icons-material";
import { useToggleStore } from "../stores/useToggleStore";

export const Toggleable = ({ label, children }) => {
    const { setBypass } = useSynth();
    const moduleId = children.props.moduleId;

    const enabled = useToggleStore((state) => state.isEnabled(moduleId));
    const setEnabled = useToggleStore((state) => state.setToggle);

    useEffect(() => {
        setBypass(moduleId, !enabled);
    }, [enabled, moduleId, setBypass]);

    return (
        <Card className="h-full py-4 px-2" variant="outlined">
            <div className="flex items-center relative">
                <div className="flex-1">
                    <Typography color="textSecondary">{label}</Typography>
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
                className={`!p-2 transition-opacity ${
                    enabled ? "opacity-100" : "opacity-25 pointer-events-none"
                }`}
            >
                {children}
            </CardContent>
        </Card>
    );
};
