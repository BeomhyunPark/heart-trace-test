import { describe, expect, it } from 'vitest';

import { getSpecialOutcomeValues } from '../src/features/group-picker/domain/outcomes';

describe('사다리 특별 결과', () => {
  it('다수의 통과와 다른 소수 결과만 찾아낸다', () => {
    expect([...getSpecialOutcomeValues(['커피 사기', '통과', '통과', '통과'])]).toEqual(['커피 사기']);
    expect([...getSpecialOutcomeValues(['꽝', '꽝', '통과', '통과', '통과'])]).toEqual(['꽝']);
  });

  it('모든 결과가 서로 다르거나 같은 빈도라면 강조하지 않는다', () => {
    expect(getSpecialOutcomeValues(['1번', '2번', '3번']).size).toBe(0);
    expect(getSpecialOutcomeValues(['당첨', '당첨', '꽝', '꽝']).size).toBe(0);
  });
});
