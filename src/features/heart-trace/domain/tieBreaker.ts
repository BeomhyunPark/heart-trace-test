import type { ResultTypeId } from './types';

export const TIE_BREAKER_PROMPT =
  '가장 은혜로운 말씀 구절을 하나 선택하세요.';

export const TIE_BREAKER_OPTION_LABELS = {
  bear: '우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라 (로마서 8:28)',
  spring: '그러므로 우리는 긍휼하심을 받고 때를 따라 돕는 은혜를 얻기 위하여 은혜의 보좌 앞에 담대히 나아갈 것이니라 (히브리서 4:16)',
  effort: '너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 이것은 너희에게서 난 것이 아니요 하나님의 선물이라 행위에서 난 것이 아니니 (에베소서 2:8-9)',
  pause: '상한 갈대를 꺾지 아니하며 꺼져가는 등불을 끄지 아니하고 진실로 정의를 시행할 것이며 (이사야 42:3)',
  express: '아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라 그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라 (빌립보서 4:6-7)',
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
