import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
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
