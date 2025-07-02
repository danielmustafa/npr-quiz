import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import AudioWaveformContainer from "../components/AudioWaveformContainer";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "../components/ui/slider";
import Banner from "../components/ui/banner";
import useScreenSize from "../hooks/useScreenSize";
import type { Correspondent, QuestionData } from "@/types/question";
import type { ScreenSize } from "@/types/screenSize";


interface QuestionPageProps {
    data: QuestionData;
    questionNumber: number;
    numberOfQuestions: number;
    totalScore: number;
    onContinueClicked: () => void;
    onScoreUpdated: (updater: (prev: number) => number) => void;
}

interface OptionProps {
    className: string;
    enabled: boolean;
}

function QuestionPage(props: QuestionPageProps) {
    const { questionNumber, numberOfQuestions, totalScore, onContinueClicked, data, onScoreUpdated } = props;

    const [roundIsActive, setRoundIsActive] = useState(false);
    const [incorrectAnswersCount, setIncorrectAnswersCount] = useState<number>(0);

    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    const [audioIsReady, setAudioIsReady] = useState(false);
    const [playAudio, setPlayAudio] = useState(false);
    const [optionProps, setOptionProps] = useState<Record<string, OptionProps>>({});
    const audioRef = useRef<HTMLAudioElement | null>(null);

    function endRound() {
        setRoundIsActive(false);
        setPlayAudio(false);
        setAudioUrl(undefined);
    }

    // function handleStartClicked(): void {
    //     // if (onStartClicked) {
    //     //     onStartClicked();
    //     // }

    //     if (!roundIsActive) {
    //         setRoundIsActive(true);
    //         setPlayAudio(true);
    //         setAudioUrl(data.audio_url);
    //     }
    // }

    // function handleStopClicked(): void {
    //     setRoundIsActive(false);
    //     setPlayAudio(false);
    //     setAudioUrl(undefined);
    // }

    useEffect(() => {
        if (!data) return;

        setAudioUrl(data.audio_url);

        const optionStyles: Record<string, OptionProps> = {}
        data.options.forEach(option => {

            optionStyles[option.id] = {
                className: "",
                enabled: true
            }
        })

        setOptionProps(optionStyles)

        if (audioIsReady) {
            setRoundIsActive(true);
            setPlayAudio(true);
        }
    }, [data, audioIsReady]);


    function playAnswerAudio(answer: 'CORRECT' | 'INCORRECT') {
        if (!audioRef.current) return;

        const audioFile = answer === 'CORRECT' ? '/public/correct_choice.mp3' : '/public/incorrect_choice.mp3';
        audioRef.current.src = audioFile;
        audioRef.current.play().catch((error) => {
            console.error("Error playing audio:", error);
        });

    }

    function handleAnswerClicked(option: Correspondent): void {
        const { is_answer, id } = option;
        console.log(typeof is_answer)
        if (is_answer) {
            endRound();
            playAnswerAudio('CORRECT');
        } else {
            playAnswerAudio('INCORRECT');
            setIncorrectAnswersCount((prev) => prev + 1);
            setOptionProps((prev) => {
                return {
                    ...prev,
                    [id]: {
                        className: prev[id].className.concat(" animate-wobble bg-npr-red"),
                        enabled: false
                    }
                }
            })
        }
    }

    function handleRoundCompleted(possibleScore: number) {
        if (roundIsActive) {
            endRound();
        }
        onScoreUpdated((prev) => possibleScore + prev);
    }

    return (
        <div id="outer" className="flex flex-col w-full h-screen sm:justify-center sm:items-center">
            {/* <Banner /> */}
            <div
                id="mainContainer"
                className="flex flex-col h-screen w-full sm:w-2/3 sm:h-2/3 shadow-xl sm:rounded-t-lg bg-npr-blue-dark">
                {/* Header always at the top */}
                <div
                    id="headerBar"
                    className="flex flex-row justify-between items-center px-6 py-4 sm:rounded-t-lg bg-npr-blue-night">
                    <QuestionTracker current={questionNumber} total={numberOfQuestions} />
                    <CurrentScoreTracker score={totalScore} />
                </div>

                {/* Middle content grows to fill space between header and footer */}
                <div className="flex flex-col flex-grow justify-center">

                    <div className="flex flex-col flex-grow min-w-1/4 items-center justify-center">
                        <h3 className="text-base text-5xl font-semibold text-npr-light">Possible Score</h3>
                        <PossibleScoreTracker
                            incorrectAnswersCount={incorrectAnswersCount}
                            onRoundCompleted={handleRoundCompleted}
                            roundIsActive={roundIsActive}
                        />
                    </div>
                    <div
                        id="bodyContainer"
                        className="flex flex-col">
                        <AudioContainer
                            playAudio={playAudio}
                            audioUrl={audioUrl}
                            onAudioIsReady={setAudioIsReady}
                        />

                    </div>
                    {/* Options container just above footer */}
                    {/* <div className="bg-green-300"> */}
                    <div
                        id="mcContainer"
                        className="grid grid-cols-1 sm:grid sm:grid-cols-2 w-full gap-4 p-4">
                        {data.options.map((option) => (
                            <Button
                                variant="option"
                                disabled={!roundIsActive || !optionProps[option.id].enabled}
                                size={"lg"}
                                onClick={() => handleAnswerClicked(option)}
                                key={option.id}
                                className={`w-full ${optionProps[option.id]?.className}`}>
                                {option.full_name}
                            </Button>
                        ))}
                    </div>
                    {/* </div> */}
                </div>

                <div
                    id="footerBar"
                    className="flex flex-row justify-center p-6 sm:rounded-b-lg bg-npr-blue-night shadow-md">
                    <Button
                        disabled={roundIsActive}
                        onClick={onContinueClicked}
                        id="continueBtn"
                        size="lg"
                        variant={"navigation"}>
                        Continue
                    </Button>
                    <audio ref={audioRef} />
                </div>
            </div>
        </div>
    );

}

type QuestionTrackerProps = {
    current: number;
    total: number;
}

function QuestionTracker(props: QuestionTrackerProps) {
    const { current, total } = props;
    return (
        <div>
            <p className="text-base font-semibold text-npr-light">{current} of {total}</p>
        </div>
    )
}

function CurrentScoreTracker({ score }: { score: number }) {
    return (
        <div>
            <p className="text-base text-5xl font-semibold text-npr-light"> Current Score: {score}</p>
        </div>
    )
}

function PossibleScoreTracker({ roundIsActive, onRoundCompleted, incorrectAnswersCount }:
    {
        roundIsActive: boolean,
        onRoundCompleted: (possibleScore: number) => void,
        incorrectAnswersCount: number
    }) {
    const DEFAULT_MIN_SCORE = 0;
    const DEFAULT_START_SCORE = 500;
    const DECREMENT_INTERVAL_MS = 25;
    const DEFAULT_TEXT_COLOR = "text-npr-light";
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const incorrectAnswersCountRef = useRef<number>(incorrectAnswersCount);
    const prevRoundIsActive = useRef<boolean>(roundIsActive);
    const [possibleScore, setPossibleScore] = useState(DEFAULT_START_SCORE);
    const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
    const colorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (possibleScore === DEFAULT_MIN_SCORE) onRoundCompleted(possibleScore);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [possibleScore])

    useEffect(() => {
        if (incorrectAnswersCount > incorrectAnswersCountRef.current) {
            incorrectAnswersCountRef.current = incorrectAnswersCount;
            if (incorrectAnswersCount > 0) {
                setTextColor("text-npr-red");
                setPossibleScore((prev) => {
                    const reduced = Math.round(prev - (prev * .10 * incorrectAnswersCount));
                    return Math.max(DEFAULT_MIN_SCORE, reduced);
                })
            }

            if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current);
            colorTimeoutRef.current = setTimeout(() => {
                setTextColor(DEFAULT_TEXT_COLOR);
            }, 125);

        }
        return () => {
            if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current);
        }
    }, [incorrectAnswersCount])

    useEffect(() => {
        function cleanup() {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        if (roundIsActive && possibleScore > DEFAULT_MIN_SCORE) {
            prevRoundIsActive.current = roundIsActive;
            intervalRef.current = setInterval(() => {
                setPossibleScore((prev) => {
                    if (prev > DEFAULT_MIN_SCORE) {
                        return prev - 1;
                    } else {
                        return DEFAULT_MIN_SCORE;
                    }
                });
            }, DECREMENT_INTERVAL_MS);
        }
        if (prevRoundIsActive.current && !roundIsActive) {
            prevRoundIsActive.current = roundIsActive;
            cleanup();
            onRoundCompleted(possibleScore);
        }
        return () => { cleanup(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roundIsActive]);


    return (<p id="possibleScore" className={`text-9xl font-bold ${textColor}`}>{possibleScore}</p>
    )
}

function AudioContainer({ playAudio, audioUrl, onAudioIsReady }: { playAudio: boolean, audioUrl: string | undefined, onAudioIsReady: (isLoaded: boolean) => void }) {
    const screenSize: ScreenSize = useScreenSize();
    const DEFAULT_MUTED_VOLUME = 0;
    const DEFAULT_VOLUME: number = 0.33;
    const [volume, setVolume] = useState([DEFAULT_VOLUME]);
    const [showVolume, setShowVolume] = useState(false);
    const MIN_BROWSER_WIDTH = 700;
    // useEffect(() => {
    //     if (screenSize.width > MIN_BROWSER_WIDTH) {
    //         setShowVolume(true);
    //         console.log(screenSize)
    //     }
    // }, [screenSize])

    return (<>
        {/* <div id="volumeControl" className="flex flex-col gap-2 h-full items-center rounded-md bg-npr-blue-dark text-npr-light">
            <Slider
                hidden={!showVolume}
                onValueChange={setVolume}
                value={volume}
                defaultValue={[.33]}
                min={0}
                max={1}
                step={.01} />
            <div hidden={!showVolume}>
                {volume && volume[0] > DEFAULT_MUTED_VOLUME
                    ? <Volume2 className="cursor-pointer h-10 w-10" onClick={() => setVolume([DEFAULT_MUTED_VOLUME])} />
                    : <VolumeX className="cursor-pointer h-10 w-10" onClick={() => setVolume([DEFAULT_VOLUME])} />}
            </div>
        </div> */}
        <AudioWaveformContainer
            playAudio={playAudio}
            onAudioIsReady={onAudioIsReady}
            url={audioUrl}
            width={Math.min(screenSize.width * .9, 500)}
            height={100}
            volume={volume[0]}
            className="rounded-lg bg-npr-light "
        />

        {/* <AudioGraph isActive={roundIsActive} /> */}
    </>)
}

export default QuestionPage;