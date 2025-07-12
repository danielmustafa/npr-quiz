import LandingPage from  "./pages/landing-page";
import { useState, useEffect } from "react";
import QuestionPage from  "./pages/question-page";
import { useQuiz } from "./api/quizFetcher";
import ResultsPage from "./pages/results-page";
import { useQueryClient } from '@tanstack/react-query';
import type { QuizResults } from "./types/quizResults";
import type { RoundResults } from "./types/roundResults";

enum GameState {
  NOT_STARTED,
  IN_PROGRESS,
  FINISHED
}

function App() {
  const queryClient = useQueryClient();
  const [gameState, setGameState] = useState<GameState>(GameState.NOT_STARTED);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResults>({
    totalScore: 0,
    numberCorrectAttempts: 0,
    numberIncorrectAttempts: 0,
    numberAttempts: 0,
    avgAttemptPerQuestion: 0,
    avgSpeedOfAnswer: 0,
    attemptsPerQuestion: [],
    timePerQuestion: [],
    numberOfQuestions: 0
  });
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);

  const { isPending, isError, isSuccess, data, error } = useQuiz();

  useEffect(() => {
    if (data) {
      setNumberOfQuestions(data.metadata.total_questions);
      setQuizResults((prevResults) => {
        const updatedResults = {...prevResults};
        updatedResults.numberOfQuestions = data.metadata.total_questions;
        updatedResults.attemptsPerQuestion = new Array(data.metadata.total_questions).fill(0);
        updatedResults.timePerQuestion = new Array(data.metadata.total_questions).fill(0);
        return updatedResults;
      });
    }
  }, [data])

  useEffect(() => {
    if (questionNumber > 0 && questionNumber >= numberOfQuestions) {
      setGameState(GameState.FINISHED);
    }
  }, [questionNumber, numberOfQuestions])


  function handleStartClicked(): void {
    console.log('handleStartClicked')
    setGameState(GameState.IN_PROGRESS);
  }

  function handleContinueClicked(): void {
    setQuestionNumber((prev) => {
      if (gameState === GameState.IN_PROGRESS && prev <= numberOfQuestions) {
        return prev + 1;
      }
      return prev;
    })
  }

  function handleAnswerClicked(answerIsCorrect: boolean): void {
    setQuizResults((prevResults) => {
      const updatedResults = {...prevResults};
      updatedResults.numberAttempts += 1;
      updatedResults.attemptsPerQuestion[questionNumber] = (updatedResults.attemptsPerQuestion[questionNumber] || 0) + 1;
      if (answerIsCorrect) {
        updatedResults.numberCorrectAttempts += 1;
      } else {
        updatedResults.numberIncorrectAttempts += 1;
      }
      return updatedResults;
    })
  }

  function handleRoundCompleted(results: RoundResults): void {
    const tempResults = {...quizResults};
    tempResults.totalScore += results.score;
    tempResults.timePerQuestion[questionNumber] = results.duration;
    tempResults.avgSpeedOfAnswer = tempResults.timePerQuestion.reduce((acc, time) => acc + time, 0) / (questionNumber + 1);
    tempResults.avgAttemptPerQuestion = tempResults.attemptsPerQuestion.reduce((acc, attempts) => acc + attempts, 0) / (questionNumber + 1);
    console.log(tempResults)
    setQuizResults(tempResults);
  }

  function handleStartOverClicked(): void {
    setGameState(GameState.NOT_STARTED);
    setQuestionNumber(0);
    setNumberOfQuestions(0);
    queryClient.invalidateQueries({ queryKey: ['quiz'] });
  }

  const questionPages = data?.quiz?.map((question, index) => {
    return (
      <QuestionPage
        key={index}
        questionNumber={questionNumber + 1}
        numberOfQuestions={numberOfQuestions}
        totalScore={quizResults.totalScore}
        data={question}
        onContinueClicked={handleContinueClicked}
        onRoundCompleted={handleRoundCompleted}
        onAnswerClicked={handleAnswerClicked}
      />
    );  
  })

  //TODO should handle if questions are empty
  const getActivePage = () => {
    if (isPending) {
      return <div className="text-center text-2xl">Loading...</div>
    }
    if (isError) {
      return <div className="text-center text-2xl">Error: {error.message}</div>
    }
    if (isSuccess) {
      switch (gameState) {
        case GameState.NOT_STARTED:
          return <LandingPage onStartClicked={handleStartClicked} />;
        case GameState.IN_PROGRESS:
          return questionPages && questionPages[questionNumber];
        case GameState.FINISHED:
          return <ResultsPage  onStartOverClicked={handleStartOverClicked} quizResults={quizResults} />
      }
    }
  }

    return (getActivePage())

}

export default App;
