import { describe, expect, it } from 'vitest';

import { ACTIVITIES } from '../src/app/activityCatalog';
import { pickFeaturedActivity } from '../src/features/home/HomeScreen';

describe('홈 추천 콘텐츠', () => {
  it('NEW 놀거리만 추천한다', () => {
    const selected = pickFeaturedActivity(ACTIVITIES, null, () => 0.5);

    expect(selected?.badge).toBe('NEW');
    expect(selected?.group).toBe('play');
    expect(selected?.id).not.toBe('heart-trace');
    expect(selected?.id).not.toBe('group-picker');
  });

  it('직전에 추천한 콘텐츠는 다음 추천에서 제외한다', () => {
    const first = pickFeaturedActivity(ACTIVITIES, null, () => 0);
    const second = pickFeaturedActivity(ACTIVITIES, first?.id ?? null, () => 0);

    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(second?.id).not.toBe(first?.id);
  });
});
