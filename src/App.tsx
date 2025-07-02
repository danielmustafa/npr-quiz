import LandingPage from  "./pages/landing-page";
import { useState, useEffect } from "react";
import QuestionPage from  "./pages/question-page";
import { useQuiz } from "./api/quizFetcher";
import ResultsPage from "./pages/results-page";
import { useQueryClient } from '@tanstack/react-query';

enum GameState {
  NOT_STARTED,
  IN_PROGRESS,
  FINISHED
}

function App() {
  const queryClient = useQueryClient();
  const [gameState, setGameState] = useState<GameState>(GameState.NOT_STARTED);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);

  // const { isPending, isError, isSuccess, data, error } = useQuery({
  //   queryKey: ['quiz'],
  //   queryFn: fetchQuiz,
  // })

  const { isPending, isError, isSuccess, data, error } = useQuiz();

  useEffect(() => {
    if (data) {
      console.log('updating')
      setNumberOfQuestions(data.metadata.total_questions);
    }
  }, [data])

  useEffect(() => {
    if (questionNumber > 0 && questionNumber >= numberOfQuestions) {
      setGameState(GameState.FINISHED);
    }
  }, [questionNumber, numberOfQuestions])


  function handleStartClicked(): void {
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

  function handleStartOverClicked(): void {
    setGameState(GameState.NOT_STARTED);
    setQuestionNumber(0);
    setTotalScore(0);
    setNumberOfQuestions(0);
    queryClient.invalidateQueries({ queryKey: ['quiz'] });
  }

  const questionPages = data?.quiz?.map((question, index) => {
    return (
      <QuestionPage
        key={index}
        questionNumber={questionNumber + 1}
        numberOfQuestions={numberOfQuestions}
        totalScore={totalScore}
        data={question}
        onContinueClicked={handleContinueClicked}
        onScoreUpdated={setTotalScore}
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
          return <ResultsPage totalScore={totalScore} onStartOverClicked={handleStartOverClicked} />
      }
      // console.log(data)
      // //game is ready to launch
      // if (gameState === GameState.IN_PROGRESS) {
      //   return questionPages && questionPages[questionNumber];
      // } else {
      //   return <LandingPage onStartClicked={handleStartClicked} />;
      // }
    }
  }

    return (getActivePage())
  // return questionPages[0]
  // return gameIsActive ? (questionPages[questionNumber]) : (
  //   <LandingPage onStartClicked={handleStartClicked} />
  // )

}

export default App;
