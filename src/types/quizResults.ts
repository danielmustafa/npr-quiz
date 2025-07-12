export interface QuizResults {
  totalScore: number;
  numberOfQuestions: number;
  numberCorrectAttempts: number;
  numberIncorrectAttempts: number;
  numberAttempts: number;
  avgAttemptPerQuestion: number;
  avgSpeedOfAnswer: number;
  attemptsPerQuestion: number[];
  timePerQuestion: number[];
}