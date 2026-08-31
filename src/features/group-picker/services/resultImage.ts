export type GroupPickerShareAction = 'shared' | 'downloaded' | 'cancelled';

export type GroupPickerResultEntry = {
  name: string;
  value: string;
  special?: boolean;
};

type GroupPickerResultImageInput = {
  modeTitle: string;
  resultTitle: string;
  entries: readonly GroupPickerResultEntry[];
};

export function getGroupPickerResultImageSize(entryCount: number): {
  width: number;
  height: number;
} {
  const safeEntryCount = Math.max(1, entryCount);
  return {
    width: 720,
    height: Math.max(900, 350 + safeEntryCount * 70),
  };
}

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

      resolve(new File([blob], 'ongi-group-result.png', { type: 'image/png' }));
    }, 'image/png');
  });
}

export async function createGroupPickerResultFile({
  modeTitle,
  resultTitle,
  entries,
}: GroupPickerResultImageInput): Promise<File> {
  await document.fonts?.ready;

  const canvas = document.createElement('canvas');
  const rowGap = 70;
  const contentHeight = Math.max(1, entries.length) * rowGap;
  const imageSize = getGroupPickerResultImageSize(entries.length);
  canvas.width = imageSize.width;
  canvas.height = imageSize.height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('공유 이미지 캔버스를 열지 못했습니다.');
  }

  const background = context.createLinearGradient(0, 0, 720, canvas.height);
  background.addColorStop(0, '#102a38');
  background.addColorStop(0.55, '#1b3446');
  background.addColorStop(1, '#2b2143');
  context.fillStyle = background;
  context.fillRect(0, 0, 720, canvas.height);

  const glow = context.createRadialGradient(590, 80, 20, 590, 80, 360);
  glow.addColorStop(0, 'rgba(120, 226, 198, 0.26)');
  glow.addColorStop(1, 'rgba(120, 226, 198, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, 720, canvas.height);

  context.textAlign = 'left';
  context.fillStyle = '#baf5e6';
  context.font = '700 22px "Noto Sans KR", sans-serif';
  context.fillText(`온기 · 오늘은 누구? · ${modeTitle}`, 52, 70, 616);
  context.fillStyle = '#f4fffb';
  context.font = '700 40px "Noto Sans KR", sans-serif';
  context.fillText(resultTitle, 52, 130, 616);

  const cardX = 40;
  const cardY = 170;
  const cardWidth = 640;
  const cardHeight = contentHeight + 74;
  roundedRect(context, cardX, cardY, cardWidth, cardHeight, 44);
  context.fillStyle = 'rgba(7, 29, 40, 0.58)';
  context.fill();
  context.strokeStyle = 'rgba(120, 226, 198, 0.32)';
  context.lineWidth = 3;
  context.stroke();

  const rowWidth = 568;
  const rowHeight = 56;
  const fontSize = entries.length > 20 ? 22 : 26;

  entries.forEach((entry, index) => {
    const x = 76;
    const y = 206 + index * rowGap;

    roundedRect(context, x, y, rowWidth, rowHeight, 14);
    context.fillStyle = entry.special
      ? 'rgba(255, 207, 125, 0.16)'
      : 'rgba(255, 255, 255, 0.045)';
    context.fill();
    if (entry.special) {
      context.strokeStyle = 'rgba(255, 207, 125, 0.72)';
      context.lineWidth = 2;
      context.stroke();
    }

    context.textBaseline = 'middle';
    context.textAlign = 'right';
    context.fillStyle = entry.special ? '#ffcf7d' : '#f4fffb';
    context.font = `700 ${fontSize}px "Noto Sans KR", sans-serif`;
    context.fillText(entry.name, 315, y + rowHeight / 2, 220);
    context.textAlign = 'center';
    context.fillStyle = entry.special ? '#ffcf7d' : 'rgba(186, 245, 230, 0.52)';
    context.font = `600 ${Math.max(18, fontSize - 4)}px "Noto Sans KR", sans-serif`;
    context.fillText('→', 360, y + rowHeight / 2);
    context.textAlign = 'left';
    context.fillStyle = entry.special ? '#ffcf7d' : '#baf5e6';
    context.font = `600 ${Math.max(18, fontSize - 2)}px "Noto Sans KR", sans-serif`;
    context.fillText(entry.value, 405, y + rowHeight / 2, 220);
  });

  context.textBaseline = 'alphabetic';
  context.textAlign = 'center';
  context.fillStyle = 'rgba(216, 248, 239, 0.62)';
  context.font = '500 22px "Noto Sans KR", sans-serif';
  context.fillText('창작자 · hyunee', 360, canvas.height - 36);

  return canvasToFile(canvas);
}

function canShare(file: File): boolean {
  if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function') {
    return false;
  }

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

export async function shareGroupPickerResultFile(file: File): Promise<GroupPickerShareAction> {
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
