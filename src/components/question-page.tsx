import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import AudioWaveformContainer from "./AudioWaveformContainer";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "./ui/slider";
import Banner from "./ui/banner";
interface Correspondent {
    id: number;
    fullname: string;
}

interface QuestionData {
    audio_url: string;
    options: Correspondent[];
    correspondent_id: number;
}

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

    function endRound() {
        setRoundIsActive(false);
        setPlayAudio(false);
        setAudioUrl(undefined);
    }

    function handleStartClicked(): void {
        // if (onStartClicked) {
        //     onStartClicked();
        // }

        if (!roundIsActive) {
            setRoundIsActive(true);
            setPlayAudio(true);
            setAudioUrl(data.audio_url);
        }
    }

    function handleStopClicked(): void {
        setRoundIsActive(false);
        setPlayAudio(false);
        setAudioUrl(undefined);
    }

    useEffect(() => {
        setRoundIsActive(true);
        setPlayAudio(true);
        setAudioUrl(data.audio_url);

        const optionStyles: Record<string, OptionProps> = {}
        data.options.forEach(option => {

            optionStyles[option.id] = {
                className: "w-full h-14",
                enabled: true
            }})

        setOptionProps(optionStyles)

        console.log(optionStyles)
    }, [data])


    // useEffect(() => {

    // }, [audioIsLoaded])

    function handleAnswerClicked(id: number): void {
        if (id === data.correspondent_id) {
            endRound();
        } else {
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
        <div id="outer" className="flex flex-col w-full min-h-screen min-w-1/2 justify-center items-center">
            <Banner size={"md"} />
            <div id="mainContainer" className="flex flex-col min-w-5/6 shadow-xl">
                <div id="headerBar" className="flex flex-row justify-between items-center px-6 py-4 rounded-t-lg bg-npr-blue-night">
                    <QuestionTracker current={questionNumber} total={numberOfQuestions} />
                    <CurrentScoreTracker score={totalScore} />
                </div>
                <div id="bodyContainer" className="flex flex-row h-50 items-center p-6 justify-between bg-npr-blue-dark">
                    <AudioContainer
                        playAudio={playAudio}
                        audioUrl={audioUrl}
                        onAudioIsReady={setAudioIsReady} />
                    <div className="flex min-w-1/4 justify-end ">
                        <PossibleScoreTracker
                            incorrectAnswersCount={incorrectAnswersCount}
                            onRoundCompleted={handleRoundCompleted}
                            roundIsActive={roundIsActive} />
                    </div>
                </div>
                {/* <div id="possibleScoreContainer" className="flex flex-row w-full justify-center pb-4">
                    <PossibleScoreTracker
                        onRoundComplete={handleRoundComplete}
                        roundIsActive={roundIsActive} />
                </div> */}
                <div id="mcContainer" className="grid grid-cols-2 gap-6 p-6 bg-npr-blue-dark">
                    {data.options.map((option) => {
                        return (
                            <Button
                                variant="option"
                                disabled={!roundIsActive || !optionProps[option.id].enabled}
                                size={"lg"}
                                onClick={() => handleAnswerClicked(option.id)}
                                key={option.id}
                                className={optionProps[option.id]?.className}>{option.fullname}</Button>
                        )
                    })}
                </div>
                <div id="footerBar" className="flex flex-row w-full justify-center p-6 rounded-b-lg bg-npr-blue-night shadow-md">
                    <Button
                        disabled={roundIsActive}
                        onClick={onContinueClicked}
                        id="continueBtn"
                        size="lg"
                        variant={"navigation"}>Continue</Button>
                    <Button onClick={handleStartClicked} id="startBtn" className="bg-npr-red hover:bg-npr-blue text-white font-bold px-8 py-3 rounded-lg shadow transition-colors">Start</Button>
                    <Button onClick={handleStopClicked} id="stopBtn" className="bg-npr-red hover:bg-npr-blue text-white font-bold px-8 py-3 rounded-lg shadow transition-colors">Stop</Button>
                    {/* <Button onClick={() => setPossibleScore(500)} id="startBtn" className="bg-npr-red hover:bg-npr-blue text-white font-bold px-8 py-3 rounded-lg shadow transition-colors">Reset</Button> */}
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
            // Round is no longer active because the correct answer was selected
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
    const DEFAULT_MUTED_VOLUME = 0;
    const DEFAULT_VOLUME: number = 0.33;
    const [volume, setVolume] = useState([DEFAULT_VOLUME]);

    return (<>
        {/* <div id="audioControls" className="flex flex-col justify-center rounded-md bg-npr-blue-dark"> */}
        {/* className=" gap-2 items-center pl-3 pr-3 rounded-md h-1/3 bg-npr-blue-dark text-npr-light" */}
        <div id="volumeControl" className="flex flex-col gap-2 h-full items-center rounded-md bg-npr-blue-dark text-npr-light">
            <Slider
                onValueChange={setVolume}
                value={volume}
                defaultValue={[.33]}
                min={0}
                max={1}
                step={.01} />
            {volume && volume[0] > DEFAULT_MUTED_VOLUME
                ? <Volume2 className="cursor-pointer h-10 w-10" onClick={() => setVolume([DEFAULT_MUTED_VOLUME])} />
                : <VolumeX className="cursor-pointer h-10 w-10" onClick={() => setVolume([DEFAULT_VOLUME])} />}

        </div>
        {/* </div> */}
        <AudioWaveformContainer
            playAudio={playAudio}
            onAudioIsReady={onAudioIsReady}
            url={audioUrl}
            width={500}
            height={125}
            volume={volume[0]}
            className="rounded-lg bg-npr-light "
        />
        {/* <AudioGraph isActive={roundIsActive} /> */}
    </>)
}

// function VolumeControl() {
//     const DEFAULT_MUTED_VOLUME = 0;
//     const DEFAULT_VOLUME: number = 0.33;
//     const [volume, setVolume] = useState([DEFAULT_VOLUME]);

//     return (<div id="volumeControl" className="flex flex-col gap-2 h-full items-center rounded-md bg-npr-blue-dark text-npr-light">
//         <Slider
//             onValueChange={setVolume}
//             value={volume}
//             defaultValue={[DEFAULT_VOLUME]}
//             min={0}
//             max={1}
//             step={.01} />
//         {volume && volume[0] > DEFAULT_MUTED_VOLUME
//             ? <Volume2 onClick={() => setVolume([DEFAULT_MUTED_VOLUME])} />
//             : <VolumeX onClick={() => setVolume([DEFAULT_VOLUME])} />}

//     </div>)
// }

export default QuestionPage;