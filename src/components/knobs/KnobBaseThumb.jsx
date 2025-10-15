import { mapFrom01Linear } from "@dsp-ts/math";
import { styled } from "@mui/material";

const StyledKnobBaseThumb = styled("div", {
    name: "KnobBase",
    slot: "thumb",
    shouldForwardProp: (prop) => prop !== "variant",
})(({ theme, variant = "primary" }) => {
    const palette = theme.palette[variant] || theme.palette.primary;

    return {
        position: "absolute",
        height: "100%",
        width: "100%",
        borderRadius: "calc(infinity * 1px)",
        backgroundColor: theme.palette.background.default,
        border: "3px solid",
        borderColor: palette.main,
        color: palette.main,
        opacity: 0.7,
        transition: theme.transitions.create("opacity", {
            duration: theme.transitions.duration.short,
        }),
        "&:hover": {
            opacity: 1,
        },
    };
});

const StyledKnobBaseThumbNeedle = styled("div", {
    name: "KnobBase",
    slot: "needle",
    shouldForwardProp: (prop) => prop !== "variant",
})(({ theme, variant = "primary" }) => {
    const palette = theme.palette[variant] || theme.palette.primary;

    return {
        position: "absolute",
        left: "50%",
        top: 0,
        height: "25%",
        width: "0.25rem",
        transform: "translateX(-50%)",
        borderRadius: "0.125rem",
        backgroundColor: palette.light,
    };
});

export const KnobBaseThumb = ({ value01, variant = "primary" }) => {
    const angle = mapFrom01Linear(value01, angleMin, angleMax);
    return (
        <StyledKnobBaseThumb variant={variant} style={{ rotate: `${angle}deg` }}>
            <StyledKnobBaseThumbNeedle variant={variant} />
        </StyledKnobBaseThumb>
    );
};

const angleMin = -145;
const angleMax = 145;
