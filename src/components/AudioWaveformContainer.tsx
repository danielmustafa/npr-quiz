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
        setAudioIsLoading(isLoading);
        onAudioIsLoaded(!isLoading);
    }

    function handleAudioIsLoaded(isLoaded: boolean) {
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

    // Controls
    // const handlePlay = () => {
    //     if (audioRef.current) {
    //         audioRef.current.play();
    //         audioCtxRef.current?.resume();
    //     }
    // };
    // const handlePause = () => {
    //     audioRef.current?.pause();
    // };
    // const handleStop = () => {
    //     if (audioRef.current) {
    //         audioRef.current.pause();
    //         audioRef.current.currentTime = 0;
    //     }
    // };

    return (
        <div className={`flex flex-col items-center`}>
            {/* {audioIsLoading ? <Loader className="w-8 h-8 text-gray-200 animate-spin fill-npr-blue" />
                : <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="rounded bg-npr-light border border-npr-gray shadow" />} */}
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                 />
            <audio
                ref={audioRef}
                src={url}
                className="hidden"
                onLoadStart={() => handleAudioIsLoading(true)}
                onLoadedData={() => handleAudioIsLoaded(true)}
                onError={() => handleAudioIsLoading(false)} />
            {/* <div className="flex gap-2 mt-2">
                <button onClick={handlePlay} className="btn bg-npr-blue text-white px-4 py-1 rounded hover:bg-npr-blue-dark">Play</button>
                <button onClick={handlePause} className="btn bg-npr-gray text-npr-dark px-4 py-1 rounded hover:bg-npr-blue-light">Pause</button>
                <button onClick={handleStop} className="btn bg-npr-red text-white px-4 py-1 rounded hover:bg-npr-blue-dark">Stop</button>
            </div> */}
        </div>
    );
};

export default AudioWaveformContainer;
