import { describe, expect, it } from 'vitest';

import {
  TIE_BREAKER_OPTION_LABELS,
  TIE_BREAKER_PROMPT,
  createTieBreakerQuestion,
  resolveTie,
} from '../src/features/heart-trace/domain/tieBreaker';

describe('동점 추가 질문', () => {
  it('동점인 유형만 이름 선택지로 만든다', () => {
    expect(createTieBreakerQuestion(['bear', 'express'])).toEqual({
      prompt: TIE_BREAKER_PROMPT,
      options: [
        { id: 'bear', label: TIE_BREAKER_OPTION_LABELS.bear },
        { id: 'express', label: TIE_BREAKER_OPTION_LABELS.express },
      ],
    });
  });

  it('세 유형 이상 동점도 모두 선택지로 만든다', () => {
    expect(
      createTieBreakerQuestion(['spring', 'pause', 'effort'])?.options.map(
        ({ id }) => id,
      ),
    ).toEqual(['spring', 'pause', 'effort']);
  });

  it('후보가 둘 미만이면 추가 질문을 만들지 않는다', () => {
    expect(createTieBreakerQuestion([])).toBeNull();
    expect(createTieBreakerQuestion(['bear'])).toBeNull();
  });

  it('동점 후보 중 선택한 유형만 최종 결과로 확정한다', () => {
    expect(resolveTie(['bear', 'express'], 'express')).toBe('express');
    expect(resolveTie(['bear', 'express'], 'spring')).toBeNull();
  });
});
