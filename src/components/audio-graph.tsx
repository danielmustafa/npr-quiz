import { useWavesurfer } from "@wavesurfer/react";
import { useEffect, useRef } from "react";
import Loader from "./Loader";
import { Button } from "./ui/button";

function fadeIn(gainNode: GainNode, audioCtx: AudioContext, duration = 1) {
    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + duration);
}

function AudioGraph({ isActive  }: { isActive: boolean}) {
    const containerRef = useRef(null)
    const { wavesurfer, isReady, isPlaying } = useWavesurfer({
        container: containerRef,
        // url: '/ayesha.mp3',
        waveColor: '#2C63AE',
        progressColor: '#1A355E',
        height: 100,
        width: 800,
        interact: false,
        barWidth: 4,
        barGap: 1,
        barRadius: 2
    })

    console.log('isready', isReady)


    useEffect(() => {
        if (wavesurfer) {

            if (isActive) {
                wavesurfer.play()
            }
            else {
                wavesurfer.stop()
            }
        }

    }, [isActive, wavesurfer])





    // const onPlayStop = () => {
    //     if (!wavesurfer) return

    //     if (!isPlaying) {
    //         wavesurfer.play()
    //         const audioElement = wavesurfer?.getMediaElement();
    //         const audioCtx = new AudioContext();

    //         if (audioElement) {
    //             const source = audioCtx.createMediaElementSource(audioElement);
    //             const gainNode = audioCtx.createGain();
    //             source.connect(gainNode).connect(audioCtx.destination);

    //             wavesurfer.play()
    //             fadeIn(gainNode, audioCtx, 3);
    //         }


    //     } else {
    //         wavesurfer.stop()

    //     }

    // }

    return <>
    <div ref={containerRef}  />
    <Button onClick={() => wavesurfer?.play()} >start</Button>
    <Button onClick={() => wavesurfer?.stop()} >stop</Button>
    <Button onClick={() => wavesurfer?.load('/ayesha.mp3')} >load</Button>
    </>
    // return (isReady ? <div ref={containerRef} /> : <Loader />)
}

export default AudioGraph