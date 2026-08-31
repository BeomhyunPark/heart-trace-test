export type KnowMeShareAction = 'shared' | 'downloaded' | 'cancelled';

export type KnowMeResultEntry = {
  prompt: string;
  answer: string;
  guess: string;
  matched: boolean;
};

type KnowMeResultImageInput = {
  score: number;
  entries: readonly KnowMeResultEntry[];
};

function roundedRect(
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

function canvasToFile(canvas: HTMLCanvasElement): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('공유 이미지를 만들지 못했습니다.'));
        return;
      }
      resolve(new File([blob], 'ongi-know-me-result.png', { type: 'image/png' }));
    }, 'image/png');
  });
}

export function getKnowMeResultImageSize(questionCount: number): { width: number; height: number } {
  return { width: 720, height: Math.max(1080, 410 + Math.max(1, questionCount) * 116) };
}

export async function createKnowMeResultFile({
  score,
  entries,
}: KnowMeResultImageInput): Promise<File> {
  await document.fonts?.ready;
  const canvas = document.createElement('canvas');
  const imageSize = getKnowMeResultImageSize(entries.length);
  canvas.width = imageSize.width;
  canvas.height = imageSize.height;
  const context = canvas.getContext('2d');

  if (!context) throw new Error('공유 이미지 캔버스를 열지 못했습니다.');

  const background = context.createLinearGradient(0, 0, 720, canvas.height);
  background.addColorStop(0, '#271d45');
  background.addColorStop(0.58, '#35264d');
  background.addColorStop(1, '#1f2c49');
  context.fillStyle = background;
  context.fillRect(0, 0, 720, canvas.height);

  const glow = context.createRadialGradient(580, 70, 20, 580, 70, 330);
  glow.addColorStop(0, 'rgba(255, 185, 135, 0.28)');
  glow.addColorStop(1, 'rgba(255, 185, 135, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, 720, canvas.height);

  context.textAlign = 'left';
  context.fillStyle = '#d7c2ff';
  context.font = '700 22px "Noto Sans KR", sans-serif';
  context.fillText('온기 · 나를 맞혀봐', 52, 68);

  roundedRect(context, 52, 104, 616, 92, 28);
  context.fillStyle = 'rgba(255, 255, 255, 0.07)';
  context.fill();
  context.strokeStyle = 'rgba(215, 194, 255, 0.4)';
  context.lineWidth = 2;
  context.stroke();
  context.textAlign = 'center';
  context.fillStyle = '#ffca9f';
  context.font = '700 28px "Noto Sans KR", sans-serif';
  context.fillText(`${entries.length}개 중 ${score}개 정답`, 360, 160);

  entries.forEach((entry, index) => {
    const x = 52;
    const y = 232 + index * 116;
    roundedRect(context, x, y, 616, 98, 18);
    context.fillStyle = entry.matched
      ? 'rgba(128, 222, 190, 0.12)'
      : 'rgba(255, 255, 255, 0.045)';
    context.fill();
    context.strokeStyle = entry.matched
      ? 'rgba(128, 222, 190, 0.5)'
      : 'rgba(215, 194, 255, 0.16)';
    context.stroke();

    context.textAlign = 'left';
    context.fillStyle = 'rgba(255, 247, 239, 0.68)';
    context.font = '600 19px "Noto Sans KR", sans-serif';
    context.fillText(entry.prompt, x + 20, y + 25, 560);
    if (entry.matched) {
      context.fillStyle = '#a7efd7';
      context.font = '700 21px "Noto Sans KR", sans-serif';
      context.fillText('○  정답', x + 20, y + 67, 560);
    } else {
      context.fillStyle = 'rgba(255, 247, 239, 0.72)';
      context.font = '500 20px "Noto Sans KR", sans-serif';
      context.fillText(`우리 예상  ${entry.guess}`, x + 20, y + 55, 560);
      context.fillStyle = '#ffca9f';
      context.font = '700 21px "Noto Sans KR", sans-serif';
      context.fillText(`정답  ${entry.answer}`, x + 20, y + 82, 560);
    }
  });

  context.textAlign = 'center';
  context.fillStyle = 'rgba(226, 213, 240, 0.58)';
  context.font = '500 18px "Noto Sans KR", sans-serif';
  context.fillText('창작자 · hyunee', 360, canvas.height - 34);

  return canvasToFile(canvas);
}

function canShare(file: File): boolean {
  if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function') return false;
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

function download(file: File): void {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.rel = 'noopener';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function shareKnowMeResultFile(file: File): Promise<KnowMeShareAction> {
  if (canShare(file)) {
    try {
      await navigator.share({ files: [file] });
      return 'shared';
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError') {
        return 'cancelled';
      }
    }
  }
  download(file);
  return 'downloaded';
}
