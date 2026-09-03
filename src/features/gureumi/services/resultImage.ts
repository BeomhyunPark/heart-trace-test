import { assetUrl } from '../../../utils/assetUrl';

export async function saveGureumiResultImage(characterKey: string): Promise<void> {
  const response = await fetch(assetUrl(`images/results/gureumi/${characterKey}-story.png`));
  if (!response.ok) throw new Error('RESULT_IMAGE_UNAVAILABLE');
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = `ongi-gureumi-${characterKey}.png`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
}
