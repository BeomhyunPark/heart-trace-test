import { describe, expect, it } from 'vitest';

import { getEngagementContentCode } from '../src/engagement/contentCodes';

describe('콘텐츠 engagement 코드', () => {
  it('공개 콘텐츠는 backend seed code와 같은 값을 사용한다', () => {
    expect(getEngagementContentCode({ id: 'heart-trace' })).toBe('heart-trace');
    expect(getEngagementContentCode({ id: 'balance-game' })).toBe('balance-game');
    expect(getEngagementContentCode({ id: 'ideal-world-cup' })).toBe('ideal-world-cup');
    expect(getEngagementContentCode({ id: 'group-picker' })).toBe('group-picker');
    expect(getEngagementContentCode({ id: 'anonymous-sharing' })).toBe('anonymous-sharing');
  });

  it('아직 공개되지 않은 구르미 티저는 참여 통계에서 제외한다', () => {
    expect(getEngagementContentCode({ id: 'gureumi-teaser' })).toBeNull();
  });
});
