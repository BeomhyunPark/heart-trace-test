import { describe, expect, it } from 'vitest';

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const value = hex.replace('#', '');

  return [0, 2, 4].map((offset) =>
    Number.parseInt(value.slice(offset, offset + 2), 16),
  ) as Rgb;
}

function relativeLuminance(hex: string): number {
  const [red, green, blue] = hexToRgb(hex).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

describe('주요 텍스트 색 대비', () => {
  it.each([
    ['인트로 보조 문구', '#b9d5f4', '#0c253f'],
    ['질문 도움말', '#aebbd0', '#1a334f'],
    ['기본 본문', '#c9c9df', '#221556'],
    ['곰곰이 결과', '#efd4ee', '#1f1442'],
    ['봄봄이 결과', '#ead9be', '#5d362d'],
    ['낑낑이 결과', '#c8ddee', '#062445'],
    ['숨숨이 결과', '#d0e4c4', '#0e3624'],
    ['톡톡이 결과', '#ffd7c0', '#651b24'],
    ['주요 버튼', '#11172f', '#a88af2'],
  ])('%s가 WCAG AA 일반 텍스트 기준을 충족한다', (_, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });
});
