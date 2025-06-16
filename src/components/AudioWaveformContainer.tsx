import React, { useEffect, useRef } from "react";
import Loader from "./Loader";

interface OscilloscopeProps {
    url?: string;
    width?: number;
    height?: number;
    volume?: number;
    className?: string;
    onAudioIsReady: (audioIsLoaded: boolean) => void;
    playAudio: boolean;
}

const AudioWaveformContainer: React.FC<OscilloscopeProps> = ({ url, width = 600, height = 120, className = "", onAudioIsReady: onAudioIsLoaded, playAudio = false, volume = .33 }) => {
    console.log(url)
    const [audioIsLoading, setAudioIsLoading] = React.useState(false);
    const [audioIsLoaded, setAudioIsLoaded] = React.useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationIdRef = useRef<number | null>(null);

    function handleAudioIsLoading(isLoading: boolean) {
        console.log('loading audio')
        setAudioIsLoading(isLoading);
        onAudioIsLoaded(!isLoading);
    }

    function handleAudioIsLoaded(isLoaded: boolean) {
        console.log('loaded audio')
        handleAudioIsLoading(!isLoaded);
        setAudioIsLoaded(isLoaded);
        onAudioIsLoaded(isLoaded);
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (!audioRef.current) return;
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 1; // Add smoothing to reduce jumpiness
        analyserRef.current = analyser;
        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        // Connect audio element to analyser
        const source = audioCtx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        sourceRef.current = source;

        // Draw function
        const draw = () => {
            if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
            const canvasCtx = canvasRef.current.getContext("2d");
            if (!canvasCtx) return;
            const WIDTH = canvasRef.current.width;
            const HEIGHT = canvasRef.current.height;
            analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            // Tailwind: bg-npr-light, waveform: npr-blue
            canvasCtx.fillStyle = "#1E4C8D";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.lineWidth = 3;
            canvasCtx.strokeStyle = "#F7F7F7";
            canvasCtx.beginPath();
            const sliceWidth = WIDTH / dataArrayRef.current.length;
            let x = 0;
            const SENSITIVITY = 2.7;
            for (let i = 0; i < dataArrayRef.current.length; i++) {
                const v = dataArrayRef.current[i] / 128.0;
                const y = (v - 1) * (HEIGHT / 2) * SENSITIVITY + HEIGHT / 2;
                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            canvasCtx.lineTo(WIDTH, HEIGHT / 2);
            canvasCtx.stroke();
            animationIdRef.current = requestAnimationFrame(draw);
        };

        if (audioRef.current){
            if (playAudio && audioIsLoaded) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }

        draw();
        return () => {
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, [url, playAudio, audioIsLoaded]);


    return (
        <div className={`flex flex-col items-center`}>
            <canvas
            className="bg-yellow-300"
                ref={canvasRef}
                width={width}
                height={height}
                 />
            <audio
                crossOrigin="anonymous"
                ref={audioRef}
                src={url}
                className="hidden"
                onLoadStart={() => handleAudioIsLoading(true)}
                onLoadedData={() => handleAudioIsLoaded(true)}
                onError={() => handleAudioIsLoading(false)} />
        </div>
    );
};

export default AudioWaveformContainer;
