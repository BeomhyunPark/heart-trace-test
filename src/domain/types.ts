export const RESULT_TYPE_IDS = [
  'bear',
  'spring',
  'effort',
  'pause',
  'express',
] as const;

export type ResultTypeId = (typeof RESULT_TYPE_IDS)[number];

export type AnswerOptionId = 'A' | 'B' | 'C' | 'D' | 'E';

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
  engravedTraces: readonly string[];
};

