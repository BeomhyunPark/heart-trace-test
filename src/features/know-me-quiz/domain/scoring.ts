import type { QuizAnswers } from './types';

export function getQuizScore(
  questionIds: readonly string[],
  answers: QuizAnswers,
  guesses: QuizAnswers,
): number {
  return questionIds.reduce(
    (score, questionId) => score + (answers[questionId] === guesses[questionId] ? 1 : 0),
    0,
  );
}
