import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";

import App from "./App.jsx";
import { theme } from "./Theme.js";
import { SynthProvider } from "./synthProvider/synthProvider.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <SynthProvider>
            <App />
        </SynthProvider>
    </ThemeProvider>
    // </StrictMode>
);
