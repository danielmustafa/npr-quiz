import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti'

function ResultsPage({ totalScore, onStartOverClicked }: { totalScore: number, onStartOverClicked: () => void }) {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <Confetti width={windowSize.width} height={windowSize.height} />
            <div>
                <h1>Results Page</h1>
                <p>Score: {totalScore}</p>
            </div>
            <Button variant={"navigation"} size={"lg"} onClick={onStartOverClicked}>
                Start Over
            </Button>
        </>
    );
}

export default ResultsPage;