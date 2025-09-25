import { mapFrom01Linear } from "@dsp-ts/math";
import { styled } from "@mui/material";

const StyledKnobBaseThumb = styled("div", {
    name: "KnobBase",
    slot: "thumb",
})(({ theme }) => ({
    position: "absolute",
    height: "100%",
    width: "100%",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: theme.palette.background.default,
    border: "3px solid",
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    opacity: 0.7,
    transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.short,
    }),
    "&:hover": {
        opacity: 1,
    },
}));

const StyledKnobBaseThumbNeedle = styled("div", {
    name: "KnobBase",
    slot: "needle",
})(({ theme }) => ({
    position: "absolute",
    left: "50%",
    top: 0,
    height: "25%",
    width: "0.25rem",
    transform: "translateX(-50%)",
    borderRadius: "0.125rem",
    backgroundColor: theme.palette.primary.light,
}));

export const KnobBaseThumb = ({ value01 }) => {
    const angle = mapFrom01Linear(value01, angleMin, angleMax);
    return (
        <StyledKnobBaseThumb style={{ rotate: `${angle}deg` }}>
            <StyledKnobBaseThumbNeedle />
        </StyledKnobBaseThumb>
    );
};

const angleMin = -145;
const angleMax = 145;
