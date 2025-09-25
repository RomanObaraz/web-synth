import { Card, CardContent, Checkbox, Typography } from "@mui/material";
import { useState } from "react";
import { useSynth } from "../hooks/useSynth";
import { CheckBoxOutlineBlank, SquareRounded } from "@mui/icons-material";

export const Toggleable = ({ moduleId, label, children }) => {
    const [enabled, setEnabled] = useState(true);
    const { setBypass } = useSynth();

    const handleToggle = (on) => {
        setEnabled(on);
        setBypass(moduleId, !on);
    };

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
                        onChange={() => handleToggle((prevEnabled) => !prevEnabled)}
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
