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
                outlined: ({ theme }) => ({
                    backgroundColor: theme.palette.background.default,
                }),
            },
        },
    },
});
