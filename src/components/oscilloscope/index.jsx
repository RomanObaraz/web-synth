import { useEffect, useRef } from "react";
import { useSynth } from "../../hooks/useSynth";

export const Oscilloscope = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const synth = useSynth();

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const fftSize = 2048;
        synth.setAnalyserFftSize(fftSize);

        const bufferLength = fftSize;
        const dataArray = new Float32Array(bufferLength);

        const drawGrid = (ctx) => {
            ctx.strokeStyle = "rgba(144, 202, 249,0.2)";
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 50) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }
            for (let j = 0; j < canvas.height; j += 50) {
                ctx.beginPath();
                ctx.moveTo(0, j);
                ctx.lineTo(canvas.width, j);
                ctx.stroke();
            }
        };

        const drawWave = (ctx) => {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(0, 255, 200, 1)";
            ctx.shadowColor = "rgba(0, 255, 200, 0.8)";
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

            const sliceWidth = canvas.width / bufferLength + 0.05;
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

            synth.setAnalyserTimeDomainData(dataArray);

            ctx.fillStyle = "rgba(0,0,0,0.25)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawGrid(ctx);
            drawWave(ctx);
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [synth]);

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="rounded-md outline-1 outline-[#90caf9]"
        />
    );
};
