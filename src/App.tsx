import LandingPage from "./components/landing-page";
import { useState } from "react";
import QuestionPage from "./components/question-page";
// import { questions } from "./data/data";
import questions from "./data/data.json"

// className="flex-row flex-nowrap items-center justify-center gap-2 text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap w-full"

function App() {
  const [gameIsActive, setGameIsActive] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const QUESTION_START_SCORE = 500;
  const NUMBER_OF_QUESTIONS = 3;

  function handleStartClicked(): void {
    setGameIsActive(true);
  }

  function handleContinueClicked(): void {
    setQuestionNumber((prev) => {
      if (gameIsActive && prev <= NUMBER_OF_QUESTIONS) {
        return prev + 1;
      }
      return prev;
    })
  }

  const questionPages = questions.map((question, index) => {
    return (
      <QuestionPage
        key={index}
        questionNumber={questionNumber + 1}
        numberOfQuestions={NUMBER_OF_QUESTIONS}
        totalScore={totalScore}
        data={question}
        onContinueClicked={handleContinueClicked}
        onScoreUpdated={setTotalScore}
      />
    );  
  })

  // return questionPages[0]
  return gameIsActive ? (questionPages[questionNumber]) : (
    <LandingPage onStartClicked={handleStartClicked} />
  )

}

export default App;
