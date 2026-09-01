import type {
  CandidateVisualTone,
  TournamentSize,
  WorldCupCandidate,
} from '../domain/types';

export type WorldCupShareAction = 'shared' | 'downloaded' | 'cancelled';

type WorldCupResultImageInput = {
  candidate: WorldCupCandidate;
  categoryTitle: string;
  tournamentSize: TournamentSize;
};

export const WORLD_CUP_EMOJI_FONT_STACK = [
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Noto Color Emoji"',
  'sans-serif',
].join(', ');

const SYMBOL_TONE_COLORS: Record<CandidateVisualTone, readonly [string, string]> = {
  gold: ['#8f642b', '#443456'],
  coral: ['#a84f5f', '#3a385d'],
  mint: ['#3e7e78', '#34395f'],
  sky: ['#3e6f91', '#3b3965'],
  violet: ['#694d91', '#303d68'],
};

export function getWorldCupResultMonogram(candidateName: string): string {
  return Array.from(candidateName.replaceAll(/\s/g, '')).slice(0, 2).join('');
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function loadImage(imageSrc: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('우승 후보 이미지를 불러오지 못했습니다.'));
    image.src = imageSrc;
  });
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  size: number,
): void {
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = (image.naturalWidth - sourceSize) / 2;
  const sourceY = (image.naturalHeight - sourceSize) / 2;

  context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, x, y, size, size);
}

function drawSymbolArtwork(
  context: CanvasRenderingContext2D,
  candidate: WorldCupCandidate,
  x: number,
  y: number,
  size: number,
): void {
  const tone = candidate.visualTone ?? 'violet';
  const [startColor, endColor] = SYMBOL_TONE_COLORS[tone];
  const centerX = x + size / 2;
  const centerY = y + size / 2;

  const background = context.createLinearGradient(x, y, x + size, y + size);
  background.addColorStop(0, startColor);
  background.addColorStop(1, endColor);
  context.fillStyle = background;
  context.fillRect(x, y, size, size);

  context.beginPath();
  context.arc(centerX, centerY - 35, 205, 0, Math.PI * 2);
  context.fillStyle = 'rgba(255, 255, 255, 0.08)';
  context.fill();
  context.strokeStyle = 'rgba(255, 247, 239, 0.24)';
  context.lineWidth = 3;
  context.stroke();

  context.save();
  context.translate(centerX, centerY - 35);
  context.rotate(Math.PI / 4);
  context.strokeStyle = 'rgba(255, 211, 110, 0.34)';
  context.lineWidth = 8;
  context.strokeRect(-92, -92, 184, 184);
  context.restore();

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `300px ${WORLD_CUP_EMOJI_FONT_STACK}`;
  context.fillText(candidate.symbol ?? '', centerX, centerY - 28);

  drawRoundedRect(context, centerX - 78, y + size - 98, 156, 58, 29);
  context.fillStyle = 'rgba(23, 24, 38, 0.62)';
  context.fill();
  context.strokeStyle = 'rgba(255, 247, 239, 0.3)';
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = '#fff7ef';
  context.font = '700 28px "Noto Sans KR", sans-serif';
  context.fillText(getWorldCupResultMonogram(candidate.name), centerX, y + size - 69);
  context.textBaseline = 'alphabetic';
}

function canvasToFile(canvas: HTMLCanvasElement, filename: string): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('공유 이미지를 만들지 못했습니다.'));
        return;
      }

      resolve(new File([blob], filename, { type: 'image/png' }));
    }, 'image/png');
  });
}

export async function createWorldCupResultFile({
  candidate,
  categoryTitle,
  tournamentSize,
}: WorldCupResultImageInput): Promise<File> {
  await document.fonts?.ready;

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('공유 이미지 캔버스를 열지 못했습니다.');
  }

  const background = context.createLinearGradient(0, 0, 1080, 1080);
  background.addColorStop(0, '#171826');
  background.addColorStop(0.55, '#202039');
  background.addColorStop(1, '#2b1d3d');
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1080);

  const glow = context.createRadialGradient(850, 90, 10, 850, 90, 430);
  glow.addColorStop(0, 'rgba(255, 211, 110, 0.28)');
  glow.addColorStop(1, 'rgba(255, 211, 110, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, 1080, 1080);

  context.textAlign = 'left';
  context.fillStyle = '#ffd36e';
  context.font = '700 28px "Noto Sans KR", sans-serif';
  context.fillText('온기 · 최애 월드컵', 88, 92);

  context.fillStyle = '#fff7ef';
  context.font = '700 48px "Noto Sans KR", sans-serif';
  context.fillText(`${categoryTitle} · ${tournamentSize}강 우승`, 88, 160, 904);

  const cardX = 110;
  const cardY = 210;
  const cardSize = 860;
  drawRoundedRect(context, cardX, cardY, cardSize, 790, 56);
  context.fillStyle = 'rgba(255, 255, 255, 0.07)';
  context.fill();
  context.strokeStyle = 'rgba(255, 211, 110, 0.48)';
  context.lineWidth = 3;
  context.stroke();

  const visualX = 230;
  const visualY = 260;
  const visualSize = 620;
  context.save();
  drawRoundedRect(context, visualX, visualY, visualSize, visualSize, 42);
  context.clip();

  if (candidate.image) {
    const image = await loadImage(candidate.image);
    drawCoverImage(context, image, visualX, visualY, visualSize);
  } else {
    drawSymbolArtwork(context, candidate, visualX, visualY, visualSize);
  }
  context.restore();

  context.textAlign = 'center';
  context.fillStyle = '#86d9f2';
  context.font = '700 25px "Noto Sans KR", sans-serif';
  context.fillText('오늘의 최애', 540, 915);
  context.fillStyle = '#fff7ef';
  context.font = '700 64px "Noto Sans KR", sans-serif';
  context.fillText(candidate.name, 540, 990, 850);

  return canvasToFile(canvas, `ongi-world-cup-${candidate.id}.png`);
}

function canShareFile(file: File): boolean {
  if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function') {
    return false;
  }

  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

function downloadFile(file: File): void {
  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = file.name;
  link.rel = 'noopener';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export async function shareWorldCupResultFile(file: File): Promise<WorldCupShareAction> {
  if (canShareFile(file)) {
    try {
      await navigator.share({ files: [file] });
      return 'shared';
    } catch (error: unknown) {
      if (
        typeof error === 'object'
        && error !== null
        && 'name' in error
        && error.name === 'AbortError'
      ) {
        return 'cancelled';
      }
    }
  }

  downloadFile(file);
  return 'downloaded';
}
