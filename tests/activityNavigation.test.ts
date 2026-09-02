import { describe, expect, it } from 'vitest';

import {
  buildActivityUrl,
  buildPageUrl,
  parseActivitySearch,
  parsePageSearch,
} from '../src/app/activityNavigation';

describe('활동 직접 링크', () => {
  it('공동체 도구 쿼리를 해당 모드 진입 정보로 읽는다', () => {
    expect(parseActivitySearch('?tool=groups')).toEqual({
      id: 'group-picker',
      initialGroupPickerMode: 'groups',
    });
  });

  it('놀거리 활동 링크도 읽고 알 수 없는 값은 무시한다', () => {
    expect(parseActivitySearch('?activity=balance-game')).toEqual({
      id: 'balance-game',
      initialBalanceGameWeight: 'light',
    });
    expect(parseActivitySearch('?activity=gureumi-teaser')).toEqual({ id: 'gureumi-teaser' });
    expect(parseActivitySearch('?tool=unknown')).toBeNull();
    expect(parseActivitySearch('?activity=unknown')).toBeNull();
  });

  it('밸런스 게임 대화 온도를 주소에서 유지하고 잘못된 값은 가볍게로 복구한다', () => {
    expect(parseActivitySearch('?activity=balance-game&weight=deep')).toEqual({
      id: 'balance-game',
      initialBalanceGameWeight: 'deep',
    });
    expect(parseActivitySearch('?activity=balance-game&weight=unknown')).toEqual({
      id: 'balance-game',
      initialBalanceGameWeight: 'light',
    });
    expect(buildActivityUrl('https://example.com/', {
      id: 'balance-game',
      initialBalanceGameWeight: 'deep',
    })).toBe('/?activity=balance-game&weight=deep');
  });

  it('최애 월드컵 카테고리를 직접 링크에서 유지하고 잘못된 값은 한 끼로 복구한다', () => {
    expect(parseActivitySearch('?activity=ideal-world-cup&category=travel')).toEqual({
      id: 'ideal-world-cup',
      initialWorldCupCategory: 'travel',
    });
    expect(parseActivitySearch('?activity=ideal-world-cup&category=unknown')).toEqual({
      id: 'ideal-world-cup',
      initialWorldCupCategory: 'meal',
    });
    expect(buildActivityUrl('https://example.com/?utm_source=share', {
      id: 'ideal-world-cup',
      initialWorldCupCategory: 'life-cheat',
    })).toBe('/?utm_source=share&activity=ideal-world-cup&category=life-cheat');
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

  it('업데이트 내역 주소를 읽고 활동 주소와 겹치지 않게 만든다', () => {
    expect(parsePageSearch('?page=updates')).toBe('updates');
    expect(parsePageSearch('?page=unknown')).toBeNull();
    expect(buildPageUrl(
      'https://example.com/heart-trace-test/?utm_source=home&activity=heart-trace',
      'updates',
    )).toBe('/heart-trace-test/?utm_source=home&page=updates');
    expect(buildActivityUrl(
      'https://example.com/heart-trace-test/?page=updates',
      { id: 'balance-game' },
    )).toBe('/heart-trace-test/?activity=balance-game&weight=light');
  });
});
