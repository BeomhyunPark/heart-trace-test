import {
  RESULT_TYPE_IDS,
  TEST_QUESTION_COUNT,
  type ResultTypeId,
  type ResultTypeScores,
  type ScoringAnswer,
  type ScoringOutcome,
} from './types';

export function createEmptyScores(): ResultTypeScores {
  return {
    bear: 0,
    spring: 0,
    effort: 0,
    pause: 0,
    express: 0,
  };
}

export function calculateScores(
  answers: readonly ScoringAnswer[],
): ResultTypeScores | null {
  if (
    answers.length !== TEST_QUESTION_COUNT ||
    answers.some((answer) => answer === null)
  ) {
    return null;
  }

  const scores = createEmptyScores();

  for (const answer of answers) {
    if (answer !== null) {
      scores[answer] += 1;
    }
  }

  return scores;
}

export function findTopResultTypes(
  scores: Readonly<ResultTypeScores>,
): ResultTypeId[] {
  const highestScore = Math.max(
    ...RESULT_TYPE_IDS.map((resultType) => scores[resultType]),
  );

  return RESULT_TYPE_IDS.filter(
    (resultType) => scores[resultType] === highestScore,
  );
}

export function calculateResult(answers: readonly ScoringAnswer[]): ScoringOutcome {
  const scores = calculateScores(answers);

  if (scores === null) {
    return { status: 'incomplete' };
  }

  const topResultTypes = findTopResultTypes(scores);

  if (topResultTypes.length === 1) {
    return {
      status: 'resolved',
      result: topResultTypes[0],
      scores,
    };
  }

  return {
    status: 'tie',
    tiedTypes: topResultTypes,
    scores,
  };
}
