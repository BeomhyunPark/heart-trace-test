import type { Answers } from './types';

/** 검사 결과를 계산할 수 있도록 허용하는 최대 건너뛰기 수입니다. */
export const MAX_SKIPPED_ANSWERS = 3;

export function countSkippedAnswers(answers: Readonly<Answers>): number {
  return Object.values(answers).filter(
    (answer) => answer?.kind === 'skipped',
  ).length;
}
