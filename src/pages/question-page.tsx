import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useMemo } from "react";
import AudioWaveformContainer from "../components/AudioWaveformContainer";
// import { Volume2, VolumeX } from "lucide-react";
// import { Slider } from "../components/ui/slider";
// import Banner from "../components/ui/banner";
import useScreenSize from "../hooks/useScreenSize";
import type { Correspondent, QuestionData } from "@/types/question";
import type { ScreenSize } from "@/types/screenSize";
import { GameState } from "@/types/gameState";
import { PossibleScoreTracker } from "@/components/PossibleScoreTracker";
import { RoundCompletedReason } from "@/types/roundCompletedReason";


interface QuestionPageProps {
    data: QuestionData;
    questionNumber: number;
    numberOfQuestions: number;
    totalScore: number;
    onContinueClicked: () => void;
    onScoreUpdated: (updater: (prev: number) => number) => void;
}

interface OptionProps {
    labelValue: string;
    className: string;
    enabled: boolean;
}

function QuestionPage(props: QuestionPageProps) {
    const screenSize: ScreenSize = useScreenSize();
    const quizAudioRef = useRef<HTMLAudioElement | null>(null);
    const soundFxAudioRef = useRef<HTMLAudioElement | null>(null);
    const [roundState, setRoundState] = useState<GameState>(GameState.NOT_STARTED);
    const { questionNumber, numberOfQuestions, totalScore, onContinueClicked, data, onScoreUpdated } = props;
    const [incorrectAnswersCount, setIncorrectAnswersCount] = useState<number>(0);
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    const [audioIsReady, setAudioIsReady] = useState(false);
    const [optionProps, setOptionProps] = useState<Record<string, OptionProps>>({});
    const [selectedAnswerLabel, setSelectedAnswerLabel] = useState<string>(" ")

    console.log('render')
    const isBrowserMobile = useMemo(() => {
        return screenSize.width < 640; // Assuming mobile is less than 640px width
    }, [screenSize.width])

    function endRound() {
        setRoundState(GameState.FINISHED);
        // setRoundIsActive(false);
        // setPlayAudio(false);
        stopAudio();
        // setAudioUrl(undefined);
    }

    function playAudio(): void {
        console.log('playAudio')
        // console.log('playAudio')
        quizAudioRef.current?.play().catch((error) => {
            console.error("Error playing audio:", error);
        });
    }

    function stopAudio(): void {
        quizAudioRef.current?.pause();
        quizAudioRef.current!.currentTime = 0; // Reset audio to the beginning
    }

    useEffect(() => {
        if (!data) return;

        setAudioUrl(data.audio_url);

        const optionProps: Record<string, OptionProps> = {}
        data.options.forEach(option => {

            optionProps[option.id] = {
                labelValue: option.full_name,
                className: "",
                enabled: true
            }
        })

        setOptionProps(optionProps)
        console.log(`audio is ready: ${audioIsReady}`)
        //autoplay if browser is desktop
        if (!isBrowserMobile && audioIsReady) {
            // setRoundIsActive(true);
            console.log('ready')
            setRoundState(GameState.IN_PROGRESS);
            playAudio();
            // setPlayAudio(true);
        }
    }, [data, audioIsReady, isBrowserMobile]);

    function playAnswerAudio(answer: 'CORRECT' | 'INCORRECT') {
        if (!soundFxAudioRef.current) return;

        const audioFile = answer === 'CORRECT' ? '/public/correct_choice.mp3' : '/public/incorrect_choice.mp3';
        soundFxAudioRef.current.src = audioFile;
        soundFxAudioRef.current.play().catch((error) => {
            console.error("Error playing audio:", error);
        });

    }

    function handleAnswerClicked(option: Correspondent): void {
        const { is_answer, id } = option;
        if (is_answer) {
            endRound();
            setSelectedAnswerLabel('Correct!');
            playAnswerAudio('CORRECT');
            setOptionProps((prev) => {
                return {
                    ...prev,
                    [id]: {
                        ...prev[id],
                        labelValue: `✅ ${prev[id].labelValue}`
                    }
                }
            })
        } else {
            playAnswerAudio('INCORRECT');
            setSelectedAnswerLabel('Incorrect!');
            setIncorrectAnswersCount((prev) => ++prev);
            setOptionProps((prev) => {
                return {
                    ...prev,
                    [id]: {
                        labelValue: `❌ ${prev[id].labelValue}`,
                        className: prev[id].className.concat(" animate-wobble bg-npr-red"),
                        enabled: false
                    }
                }
            })
        }
    }

    function handleRoundCompleted(possibleScore: number, completedReason: RoundCompletedReason) {
        if (roundState === GameState.IN_PROGRESS) {
            endRound();
        }

        if (completedReason === RoundCompletedReason.CORRECT_ANSWER) {
            onScoreUpdated((prev) => possibleScore + prev);
        }

        if (completedReason === RoundCompletedReason.TIME_EXPIRED) {
            setSelectedAnswerLabel(`Time's up!`)
        } else if (completedReason === RoundCompletedReason.MAX_INCORRECT_ANSWERS) {
            setSelectedAnswerLabel('Oops :(')
        }
    }

    function handlePlayAudioClicked(): void {
        setRoundState(GameState.IN_PROGRESS);
        playAudio();
        // setPlayAudio(true);
    }

    function handleAudioIsLoading(isLoading: boolean) {
        console.log(`loading audio: ${isLoading}`)
        // setAudioIsLoading(isLoading);
        setAudioIsReady(!isLoading);
    }

    function handleAudioIsLoaded(isLoaded: boolean) {
        console.log(`loading audio: ${isLoaded}`)
        handleAudioIsLoading(!isLoaded);
        // setAudioIsLoaded(isLoaded);
        setAudioIsReady(isLoaded);
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

                    <div className="flex flex-col h-1/3 sm:h-2/3  min-w-1/4 items-center justify-center">
                        <h3 className="text-base text-5xl font-semibold text-npr-light">Possible Score</h3>
                        <PossibleScoreTracker
                            maxIncorrectAnswers={3}
                            incorrectAnswersCount={incorrectAnswersCount}
                            onRoundCompleted={handleRoundCompleted}
                            roundIsActive={roundState === GameState.IN_PROGRESS}
                        />
                    </div>
                    <div
                        id="bodyContainer"
                        className="flex flex-col">
                        <AudioContainer
                            // playAudio={playAudio}
                            audioRef={quizAudioRef}
                        />

                    </div>
                    <SelectedAnswerLabel value={selectedAnswerLabel} />
                    <div
                        id="mcContainer"
                        className="grid grid-cols-1 sm:grid sm:grid-cols-2 w-full gap-4 p-4">
                        {data.options.map((option) => (
                            <Button
                                variant="option"
                                disabled={!(roundState === GameState.IN_PROGRESS) || !optionProps[option.id].enabled}
                                size={"lg"}
                                onClick={() => handleAnswerClicked(option)}
                                key={option.id}
                                className={`w-full ${optionProps[option.id]?.className}`}>
                                {isBrowserMobile && roundState === GameState.NOT_STARTED ? "-" : optionProps[option.id]?.labelValue}
                            </Button>
                        ))}
                    </div>
                    {/* </div> */}
                </div>

                <div
                    id="footerBar"
                    className="flex flex-row justify-center gap-4 p-6 sm:rounded-b-lg bg-npr-blue-night shadow-md">
                    {isBrowserMobile && <Button
                        disabled={roundState !== GameState.NOT_STARTED}
                        onClick={handlePlayAudioClicked}
                        id="continueBtn"
                        size="lg"
                        variant={"navigation"}>
                        Play Audio
                    </Button>}
                    <Button
                        disabled={roundState !== GameState.FINISHED}
                        onClick={onContinueClicked}
                        id="continueBtn"
                        size="lg"
                        variant={"navigation"}>
                        Continue
                    </Button>
                    <audio ref={quizAudioRef} />
                </div>
            </div>
            <audio
                crossOrigin="anonymous"
                ref={quizAudioRef}
                src={audioUrl}
                className="hidden"
                onLoadStart={() => handleAudioIsLoading(true)}
                onLoadedData={() => handleAudioIsLoaded(true)}
                onError={() => handleAudioIsLoading(false)} />
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

function SelectedAnswerLabel({ value }: { value: string }) {
    return (
        <div className="flex w-full justify-center items-center">
            <p className="min-h-[2rem] text-2xl font-semibold text-npr-light">{value}</p>
        </div>
    )
}

function AudioContainer({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
    const screenSize: ScreenSize = useScreenSize();
    // const [audioIsLoaded, setAudioIsLoaded] = useState(false);
    // const DEFAULT_MUTED_VOLUME = 0;
    // const DEFAULT_VOLUME: number = 0.33;
    // const [volume, setVolume] = useState([DEFAULT_VOLUME]);
    // useEffect(() => {
    //     if (screenSize.width > MIN_BROWSER_WIDTH) {
    //         setShowVolume(true);
    //         console.log(screenSize)
    //     }
    // }, [screenSize])

    // function handleAudioIsLoading(isLoading: boolean) {
    //     console.log(`loading audio: ${isLoading}`)
    //     // setAudioIsLoading(isLoading);
    //     onAudioIsReady(!isLoading);
    // }

    // function handleAudioIsLoaded(isLoaded: boolean) {
    //     console.log(`loading audio: ${isLoaded}`)
    //     handleAudioIsLoading(!isLoaded);
    //     // setAudioIsLoaded(isLoaded);
    //     onAudioIsReady(isLoaded);
    // }

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
            audioRef={audioRef}
            width={Math.min(screenSize.width * .9, 500)}
            height={50}
            // volume={volume[0]}
            volume={0.33}
            className="rounded-lg bg-npr-light"
        />
    </>)
}

export default QuestionPage;