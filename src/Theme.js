import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        mode: "dark",
    },
    components: {
        MuiButton: {
            defaultProps: {
                variant: "outlined",
                disableRipple: true,
            },
            styleOverrides: {
                outlined: () => ({
                    backgroundColor: "#121212",
                }),
            },
        },
    },
});
