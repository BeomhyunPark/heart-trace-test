import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { RESULT_TYPES } from '../src/data/resultTypes';
import { RESULT_TYPE_IDS } from '../src/domain/types';
import {
  getResultImageFilename,
  isAndroidDevice,
  isIosLikeDevice,
} from '../src/utils/resultImage';

describe('결과 이미지', () => {
  it('시작 Soul Orb의 6개 Phase가 같은 캔버스 크기와 서로 다른 이미지로 구성된다', () => {
    const phaseImages = Array.from({ length: 6 }, (_, index) => {
      const phase = String(index + 1).padStart(2, '0');
      return readFileSync(resolve('public/images/motion/start-orb', `phase-${phase}.png`));
    });

    phaseImages.forEach((image) => {
      expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect(image.readUInt32BE(16)).toBe(330);
      expect(image.readUInt32BE(20)).toBe(330);
    });
    expect(new Set(phaseImages.map((image) => image.toString('base64'))).size).toBe(6);
  });

  it('5개 유형이 고정된 저장 이미지 파일명과 연결된다', () => {
    for (const resultTypeId of RESULT_TYPE_IDS) {
      const filename = getResultImageFilename(resultTypeId);

      expect(filename).toBe(`result-${resultTypeId}.png`);
      expect(RESULT_TYPES[resultTypeId].resultCardSrc).toBe(
        `/images/result-cards/${filename}`,
      );
    }
  });

  it.each(RESULT_TYPE_IDS)('%s 저장 이미지가 유효한 모바일용 PNG다', (resultTypeId) => {
    const resultType = RESULT_TYPES[resultTypeId];
    const imagePath = resolve('public', resultType.resultCardSrc.replace(/^\//, ''));
    const image = readFileSync(imagePath);
    const pngSignature = image.subarray(0, 8).toString('hex');
    const width = image.readUInt32BE(16);
    const height = image.readUInt32BE(20);

    expect(pngSignature).toBe('89504e470d0a1a0a');
    expect(width).toBeGreaterThanOrEqual(540);
    expect(height).toBeGreaterThanOrEqual(1170);
    expect(image.byteLength).toBeLessThanOrEqual(3 * 1024 * 1024);
  });

  it.each(RESULT_TYPE_IDS)('%s 결과 캐릭터가 Figma 합성 자산과 연결된다', (resultTypeId) => {
    const resultType = RESULT_TYPES[resultTypeId];
    const imagePath = resolve('public', resultType.imageSrc.replace(/^\//, ''));
    const image = readFileSync(imagePath);

    expect(resultType.imageSrc).toBe(`/images/characters/${resultTypeId}-hero.png`);
    expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(image.readUInt32BE(16)).toBe(402);
    expect(image.readUInt32BE(20)).toBe(327);
  });

  it('일반 iPhone과 iPadOS 데스크톱 모드를 감지한다', () => {
    expect(isIosLikeDevice({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      platform: 'iPhone',
      maxTouchPoints: 5,
    })).toBe(true);

    expect(isIosLikeDevice({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    })).toBe(true);
  });

  it('일반 데스크톱을 iOS로 판단하지 않는다', () => {
    expect(isIosLikeDevice({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)',
      platform: 'MacIntel',
      maxTouchPoints: 0,
    })).toBe(false);
  });

  it('Galaxy를 포함한 Android 기기를 감지한다', () => {
    expect(isAndroidDevice({
      userAgent: 'Mozilla/5.0 (Linux; Android 15; SM-S938N) AppleWebKit/537.36 SamsungBrowser/28.0',
    })).toBe(true);

    expect(isAndroidDevice({
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/128.0',
    })).toBe(true);

    expect(isAndroidDevice({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
    })).toBe(false);
  });
});
