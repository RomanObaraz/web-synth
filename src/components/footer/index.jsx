import { GitHub } from "@mui/icons-material";
import { Link, useTheme } from "@mui/material";

export const Footer = () => {
    const theme = useTheme();

    return (
        <div className="flex gap-2 items-end">
            <div style={{ color: theme.palette.text.secondary }} className="text-sm">
                © 2025 Roman Obaraz
            </div>
            <Link
                href="https://github.com/RomanObaraz/web-synth"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View the project's source code on GitHub"
            >
                <GitHub color="secondary" />
            </Link>
        </div>
    );
};
