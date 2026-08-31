export type KnowMeQuestion = {
  id: string;
  prompt: string;
  options: readonly string[];
};

export type QuizAnswers = Record<string, number>;
