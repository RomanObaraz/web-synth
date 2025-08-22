import { Card, CardContent, Switch, Typography } from "@mui/material";
import { useState } from "react";

export const Toggleable = ({ label, children }) => {
    const [enabled, setEnabled] = useState(true);

    return (
        <Card className="p-4" variant="outlined">
            <div className="flex items-center relative">
                <div className="flex-1">
                    <Typography>{label}</Typography>
                </div>
                <div className="absolute right-0">
                    <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
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
