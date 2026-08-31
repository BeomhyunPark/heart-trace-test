import {
  RESULT_TYPE_IDS,
  type Answers,
  type Question,
  type ResultTypeId,
  type ResultTypeScores,
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
  questions: readonly Question[],
  answers: Readonly<Answers>,
): ResultTypeScores {
  const questionIds = new Set<number>();

  const scores = questions.reduce<ResultTypeScores>((currentScores, question) => {
    if (questionIds.has(question.id)) {
      throw new Error(`중복된 문항 ID입니다: ${question.id}`);
    }

    questionIds.add(question.id);

    const answer = answers[question.id];

    if (!answer || answer.kind === 'skipped') {
      return currentScores;
    }

    const selectedOption = question.options.find(
      (option) => option.id === answer.optionId,
    );

    if (!selectedOption) {
      throw new Error(
        `${question.id}번 문항에 ${answer.optionId} 선택지가 없습니다.`,
      );
    }

    return {
      ...currentScores,
      [selectedOption.resultType]: currentScores[selectedOption.resultType] + 1,
    };
  }, createEmptyScores());

  for (const storedQuestionId of Object.keys(answers)) {
    const questionId = Number(storedQuestionId);

    if (!questionIds.has(questionId)) {
      throw new Error(`존재하지 않는 문항 ID의 답변입니다: ${storedQuestionId}`);
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

export function calculateResult(
  questions: readonly Question[],
  answers: Readonly<Answers>,
): ScoringOutcome {
  const scores = calculateScores(questions, answers);
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
