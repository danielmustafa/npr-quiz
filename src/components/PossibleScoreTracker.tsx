import { useEffect, useRef, useState } from "react";

export function PossibleScoreTracker({ roundIsActive, onRoundCompleted, incorrectAnswersCount }:
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