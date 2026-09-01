import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  getActivityDestination,
  getShareTarget,
  SHARE_TARGETS,
} from '../src/app/shareTargets';

describe('놀이별 공유 메타데이터', () => {
  it('놀이 4개와 모임 도구 7개를 서로 다른 공유 대상으로 정의한다', () => {
    expect(SHARE_TARGETS).toHaveLength(11);
    expect(new Set(SHARE_TARGETS.map(({ slug }) => slug)).size).toBe(11);
    expect(SHARE_TARGETS.filter(({ target }) => target.id === 'group-picker')).toHaveLength(7);
  });

  it('각 대상의 실행 주소와 공유 설정을 찾는다', () => {
    const sharing = getShareTarget({
      id: 'group-picker',
      initialGroupPickerMode: 'sharing',
    });

    expect(sharing?.slug).toBe('tool-sharing');
    expect(getActivityDestination(sharing!.target)).toBe('?tool=sharing');
    expect(getActivityDestination({ id: 'heart-trace' })).toBe('?activity=heart-trace');
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
