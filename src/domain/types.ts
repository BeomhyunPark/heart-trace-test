export const RESULT_TYPE_IDS = [
  'bear',
  'spring',
  'effort',
  'pause',
  'express',
] as const;

export type ResultTypeId = (typeof RESULT_TYPE_IDS)[number];

export const ANSWER_OPTION_IDS = ['A', 'B', 'C', 'D', 'E'] as const;

export const TEST_QUESTION_COUNT = 20;

export type AnswerOptionId = (typeof ANSWER_OPTION_IDS)[number];

export type ChoiceId = AnswerOptionId;

export type SelectedAnswer = {
  kind: 'selected';
  optionId: ChoiceId;
};

export type Answer = SelectedAnswer;

export type Answers = Partial<Record<number, Answer>>;

export type AnswerOption = {
  id: AnswerOptionId;
  text: string;
  resultType: ResultTypeId;
};

export type Question = {
  id: number;
  text: string;
  options: readonly AnswerOption[];
};

export type ResultType = {
  id: ResultTypeId;
  name: string;
  trace: string;
  descriptor: string;
  intro: readonly string[];
  strengths: readonly string[];
  behaviors: readonly string[];
  engravedTraces: readonly string[];
  mindSentence: string;
  todayMessage: string;
  imageSrc: string;
  separatorSrc: string;
  resultCardSrc: string;
  theme: {
    background: string;
    accent: string;
    text: string;
    muted: string;
    buttonGradient: string;
    buttonText: string;
  };
};

export type ResultTypeScores = Record<ResultTypeId, number>;

export type ScoringOutcome =
  | {
      status: 'resolved';
      result: ResultTypeId;
      scores: ResultTypeScores;
    }
  | {
      status: 'tie';
      tiedTypes: readonly ResultTypeId[];
      scores: ResultTypeScores;
    };
