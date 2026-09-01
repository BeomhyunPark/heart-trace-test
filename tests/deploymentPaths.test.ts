import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getServiceWorkerUrl } from '../src/platform/registerServiceWorker';
import { assetUrl } from '../src/utils/assetUrl';

describe('하위 경로 배포 URL', () => {
  it('정적 자산을 배포 base 아래에서 찾는다', () => {
    expect(assetUrl('/images/world-cup/food/pizza.webp', '/heart-trace-test/')).toBe(
      '/heart-trace-test/images/world-cup/food/pizza.webp',
    );
  });

  it('서비스 워커를 현재 문서와 같은 배포 경로에 등록한다', () => {
    expect(getServiceWorkerUrl('https://example.com/heart-trace-test/')).toBe(
      'https://example.com/heart-trace-test/sw.js',
    );
  });

  it('웹 앱 매니페스트의 시작점과 아이콘을 매니페스트 기준 상대 경로로 둔다', () => {
    const manifest = JSON.parse(readFileSync(
      join(process.cwd(), 'public/site.webmanifest'),
      'utf8',
    )) as {
      id: string;
      start_url: string;
      scope: string;
      icons: Array<{ src: string }>;
    };

    expect([manifest.id, manifest.start_url, manifest.scope]).toEqual(['.', '.', '.']);
    expect(manifest.icons.every(({ src }) => !src.startsWith('/'))).toBe(true);
  });

  it('오프라인 앱 셸을 서비스 워커 scope 기준으로 구성한다', () => {
    const serviceWorkerSource = readFileSync(
      join(process.cwd(), 'public/sw.js'),
      'utf8',
    );

    expect(serviceWorkerSource).toContain('const APP_ROOT = self.registration.scope;');
    expect(serviceWorkerSource).toContain("new URL('site.webmanifest', APP_ROOT).href");
    expect(serviceWorkerSource).toContain('cache.put(APP_ROOT, copy)');
    expect(serviceWorkerSource).toContain('caches.match(APP_ROOT)');
  });
});
