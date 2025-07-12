import { Button } from '@/components/ui/button';
import type { QuizResults } from '@/types/quizResults';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

// NPR color palette from tailwind.config.js
const nprColors = [
  '#D61F26', // npr-red
  '#1A1A1A', // npr-black
  '#1877B6', // npr-blue
  '#F7F7F7', // npr-light
  '#E5E5E5', // npr-gray
];

interface ResultsPageProps {
  onStartOverClicked: () => void;
  quizResults: QuizResults;
}

function ResultsPage(props: ResultsPageProps) {
  const { onStartOverClicked, quizResults } = props;
  const { totalScore, avgSpeedOfAnswer, avgAttemptPerQuestion, numberCorrectAttempts, numberOfQuestions } = quizResults
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  function formatDecimal(val: number) { return Math.round(val * 100) / 100; }

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

  console.log(quizResults)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-npr-light px-4 relative">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        colors={nprColors}
      />
      <div className="flex flex-col items-center justify-center w-full max-w-lg bg-npr-blue-dark rounded-lg shadow-lg p-6 gap-6">
        <h1 className="text-3xl sm:text-5xl font-bold text-npr-light text-center mb-2">
          Thanks for playing!
        </h1>
        <div className="flex flex-col items-center justify-center w-full text-npr-light font-semibold gap-2">
          <span className="text-lg sm:text-xl text-npr-light font-medium mb-1">Final Score</span>
          <span className="text-5xl sm:text-7xl font-extrabold text-npr-light mb-2">{totalScore}</span>

          <div className="flex flex-row justify-between w-full">
            <span>Correct answers</span>
            <span>{`${numberCorrectAttempts} / ${numberOfQuestions}`}</span>
          </div>
          <div className="flex flex-row justify-between w-full">
            <span>Avg speed of answer:</span>
            <span>{`${formatDecimal(avgSpeedOfAnswer)}s`}</span>
          </div>
          <div className="flex flex-row justify-between w-full">
            <span>Avg attempts per question:</span>
            <span>{`${formatDecimal(avgAttemptPerQuestion)}`}</span>
          </div>

        </div>
        <Button
          variant="navigation"
          size="lg"
          onClick={onStartOverClicked}
        >
          Start Over
        </Button>
      </div>
      <a
        href="https://www.npr.org/donations/support"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 text-xs text-npr-blue underline hover:text-npr-red transition-colors text-center"
        style={{ position: 'absolute', bottom: 16 }}
      >
        I stand with public media
      </a>
    </div>
  );
}

export default ResultsPage;