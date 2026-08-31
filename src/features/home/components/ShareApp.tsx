import { useState } from 'react';

const SHARE_TITLE = '온기 | 우리 사이에 온기를';

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

export function ShareApp() {
  const [message, setMessage] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await copyText(getShareUrl());
      setMessage('온기 링크를 복사했어요.');
    } catch {
      setMessage('링크를 복사하지 못했어요. 주소창의 URL을 복사해 주세요.');
    }
  };

  const handleShare = async () => {
    if (typeof navigator.share !== 'function') {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({
        title: SHARE_TITLE,
        url: getShareUrl(),
      });
      setMessage('온기 링크를 공유했어요.');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      await handleCopy();
    }
  };

  return (
    <div className="share-app">
      <p className="share-app__message" aria-live="polite" aria-atomic="true">
        {message}
      </p>
      <button
        className="share-app__button"
        type="button"
        aria-label="공유하기"
        onClick={handleShare}
      >
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
          </svg>
        </span>
      </button>
    </div>
  );
}
