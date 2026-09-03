import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  getActivityDestination,
  getShareTarget,
  SHARE_TARGETS,
} from '../src/app/shareTargets';

describe('놀이별 공유 메타데이터', () => {
  it('월드컵 카테고리 6개와 기존 링크, 다른 놀이·도구를 서로 다른 공유 대상으로 정의한다', () => {
    expect(SHARE_TARGETS).toHaveLength(17);
    expect(new Set(SHARE_TARGETS.map(({ slug }) => slug)).size).toBe(17);
    expect(SHARE_TARGETS.filter(({ target }) => target.id === 'group-picker')).toHaveLength(7);
    expect(SHARE_TARGETS.filter(({ target }) => target.id === 'ideal-world-cup')).toHaveLength(7);
  });

  it('각 대상의 실행 주소와 공유 설정을 찾는다', () => {
    const sharing = getShareTarget({
      id: 'group-picker',
      initialGroupPickerMode: 'sharing',
    });

    expect(sharing?.slug).toBe('tool-sharing');
    expect(getActivityDestination(sharing!.target)).toBe('?tool=sharing');
    expect(getActivityDestination({ id: 'heart-trace' })).toBe('?activity=heart-trace');
    expect(getShareTarget({ id: 'gureumi' })?.slug).toBe('gureumi');
    expect(getActivityDestination({ id: 'gureumi' })).toBe('?activity=gureumi');

    const dessert = getShareTarget({
      id: 'ideal-world-cup',
      initialWorldCupCategory: 'dessert',
    });
    expect(dessert?.slug).toBe('ideal-world-cup-dessert');
    expect(getActivityDestination(dessert!.target))
      .toBe('?activity=ideal-world-cup&category=dessert');
  });

  it('공유 이미지를 모두 1200×630 PNG로 제공한다', () => {
    for (const target of SHARE_TARGETS) {
      const image = readFileSync(join(
        process.cwd(),
        'public',
        'images',
        'share',
        `${target.slug}-v1.png`,
      ));

      expect(image.subarray(1, 4).toString('ascii')).toBe('PNG');
      expect(image.readUInt32BE(16)).toBe(1200);
      expect(image.readUInt32BE(20)).toBe(630);
    }
  });
});
