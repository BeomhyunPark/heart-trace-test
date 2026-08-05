import type { ResultTypeId } from './types';

export const TIE_BREAKER_PROMPT =
  '다음 중 나와 더 가까운 유형을 선택해 주세요.';

export const TIE_BREAKER_OPTION_LABELS = {
  bear: '곰곰이',
  spring: '봄봄이',
  effort: '낑낑이',
  pause: '숨숨이',
  express: '톡톡이',
} as const satisfies Record<ResultTypeId, string>;

export type TieBreakerOption = {
  id: ResultTypeId;
  label: string;
};

export type TieBreakerQuestion = {
  prompt: string;
  options: readonly TieBreakerOption[];
};

export function createTieBreakerQuestion(
  tiedTypes: readonly ResultTypeId[],
): TieBreakerQuestion | null {
  const uniqueTiedTypes = [...new Set(tiedTypes)];

  if (uniqueTiedTypes.length < 2) {
    return null;
  }

  return {
    prompt: TIE_BREAKER_PROMPT,
    options: uniqueTiedTypes.map((resultType) => ({
      id: resultType,
      label: TIE_BREAKER_OPTION_LABELS[resultType],
    })),
  };
}

export function resolveTie(
  tiedTypes: readonly ResultTypeId[],
  selectedType: ResultTypeId,
): ResultTypeId | null {
  return tiedTypes.includes(selectedType) ? selectedType : null;
}
