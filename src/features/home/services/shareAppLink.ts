const SHARE_TITLE = '온기 | 우리 사이에 온기를';

export type ShareAppLinkResult = 'shared' | 'copied' | 'cancelled' | 'failed';

function getShareUrl(): string {
  return document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href
    ?? window.location.href;
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  textarea.remove();

  if (!copied) {
    throw new Error('Copy command failed');
  }
}

function isShareCancellation(error: unknown): boolean {
  return typeof error === 'object'
    && error !== null
    && 'name' in error
    && error.name === 'AbortError';
}

async function copyShareUrl(): Promise<ShareAppLinkResult> {
  try {
    await copyText(getShareUrl());
    return 'copied';
  } catch {
    return 'failed';
  }
}

export async function shareAppLink(): Promise<ShareAppLinkResult> {
  if (typeof navigator.share !== 'function') {
    return copyShareUrl();
  }

  try {
    await navigator.share({
      title: SHARE_TITLE,
      url: getShareUrl(),
    });
    return 'shared';
  } catch (error: unknown) {
    if (isShareCancellation(error)) {
      return 'cancelled';
    }

    return copyShareUrl();
  }
}
