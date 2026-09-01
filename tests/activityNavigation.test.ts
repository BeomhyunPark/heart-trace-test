import { describe, expect, it } from 'vitest';

import {
  buildActivityUrl,
  parseActivitySearch,
} from '../src/app/activityNavigation';

describe('활동 직접 링크', () => {
  it('공동체 도구 쿼리를 해당 모드 진입 정보로 읽는다', () => {
    expect(parseActivitySearch('?tool=groups')).toEqual({
      id: 'group-picker',
      initialGroupPickerMode: 'groups',
    });
  });

  it('놀거리 활동 링크도 읽고 알 수 없는 값은 무시한다', () => {
    expect(parseActivitySearch('?activity=balance-game')).toEqual({ id: 'balance-game' });
    expect(parseActivitySearch('?tool=unknown')).toBeNull();
    expect(parseActivitySearch('?activity=unknown')).toBeNull();
  });

  it('기존 배포 경로와 다른 쿼리를 보존하면서 앱 활동 주소만 바꾼다', () => {
    const currentUrl = 'https://example.com/heart-trace-test/?utm_source=chat#invite';

    expect(buildActivityUrl(currentUrl, {
      id: 'group-picker',
      initialGroupPickerMode: 'sharing',
    })).toBe('/heart-trace-test/?utm_source=chat&tool=sharing#invite');
    expect(buildActivityUrl(
      'https://example.com/heart-trace-test/?utm_source=chat&tool=sharing#invite',
      null,
    )).toBe('/heart-trace-test/?utm_source=chat#invite');
  });
});
