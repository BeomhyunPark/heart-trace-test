import type { Answers } from './types';

export const MAX_SKIPPED_ANSWERS = 3;

export function countSkippedAnswers(answers: Readonly<Answers>): number {
  return Object.values(answers).filter(
    (answer) => answer?.kind === 'skipped',
  ).length;
}
