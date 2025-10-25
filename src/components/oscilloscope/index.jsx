import { useEffect, useMemo, useRef } from "react";
import { useSynth } from "../../hooks/useSynth";
import { alpha, Card, useTheme } from "@mui/material";
import { ParameterDisplay } from "./ParameterDisplay";

export const Oscilloscope = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const { synth } = useSynth();
    const theme = useTheme();

    const waveColor = useMemo(() => theme.palette.warning.main, [theme]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const fftSize = 2048;
        synth.analyser.fftSize = fftSize;

        const bufferLength = fftSize;
        const dataArray = new Float32Array(bufferLength);

        const drawGrid = (ctx) => {
            ctx.strokeStyle = alpha(waveColor, 0.1);
            ctx.lineWidth = 1;
            const step = 50;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // draw horizontal lines from center
            for (let y = centerY; y < canvas.height; y += step) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            for (let y = centerY - step; y > 0; y -= step) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // draw vertical lines from center
            for (let x = centerX; x < canvas.width; x += step) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let x = centerX - step; x > 0; x -= step) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
        };

        const drawWave = (ctx) => {
            ctx.lineWidth = 3;
            ctx.strokeStyle = waveColor;
            ctx.shadowColor = alpha(waveColor, 0.8);
            ctx.shadowBlur = 15;
            ctx.lineCap = "round";

            ctx.beginPath();

            // find zero-crossing index
            let start = 0;
            for (let i = 1; i < bufferLength; i++) {
                if (dataArray[i - 1] < 0 && dataArray[i] >= 0) {
                    start = i;
                    break;
                }
            }

            // multiplying by 1.5 stretches the wave, hiding the artifacts at its end
            const sliceWidth = (canvas.width / bufferLength) * 1.5;
            let x = 0;

            for (let i = start; i < bufferLength; i++) {
                const value = dataArray[i];
                const y = (value * 0.5 + 0.5) * canvas.height;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            synth.analyser.getFloatTimeDomainData(dataArray);

            ctx.fillStyle = "rgba(0,0,0,0.25)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = "lighter";
            drawWave(ctx);

            ctx.globalCompositeOperation = "source-over";
            drawGrid(ctx);
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [synth, waveColor]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();

        const observer = new ResizeObserver(resize);
        observer.observe(canvas);

        return () => observer.disconnect();
    }, []);

    return (
        <Card className="w-full h-full" variant="outlined">
            <canvas ref={canvasRef} className="w-full h-full" />
            <ParameterDisplay />
        </Card>
    );
};
