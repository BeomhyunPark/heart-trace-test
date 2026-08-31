import { describe, expect, it } from 'vitest';

import { ACTIVITIES } from '../src/app/activityCatalog';
import { getActivityDefinition } from '../src/app/activityRegistry';

describe('활동 registry', () => {
  it('카탈로그의 활동 ID는 중복되지 않는다', () => {
    const activityIds = ACTIVITIES.map((activity) => activity.id);

    expect(new Set(activityIds).size).toBe(activityIds.length);
  });

  it('이용 가능한 활동만 실행 컴포넌트가 등록되어 있다', () => {
    for (const activity of ACTIVITIES) {
      const definition = getActivityDefinition(activity.id);

      if (activity.available) {
        expect(definition?.id).toBe(activity.id);
      } else {
        expect(definition).toBeNull();
      }
    }
  });
});
