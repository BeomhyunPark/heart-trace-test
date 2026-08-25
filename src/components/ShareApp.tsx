import { useState } from 'react';

const SHARE_TITLE = '온기 | 우리 사이에 온기를';
const SHARE_TEXT = '어색함은 조금 덜고, 서로의 마음은 조금 더 가까이. 온기에서 함께 놀아봐요.';

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
        text: SHARE_TEXT,
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
    <section className="share-app" aria-labelledby="share-app-title">
      <div className="share-app__heading">
        <span className="share-app__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
          </svg>
        </span>
        <span>
          <strong id="share-app-title">친구에게 온기 전하기</strong>
          <small>링크를 보내 함께 시작해 보세요</small>
        </span>
      </div>

      <div className="share-app__actions">
        <button className="share-app__share" type="button" onClick={handleShare}>
          공유하기
        </button>
        <button className="share-app__copy" type="button" onClick={handleCopy}>
          링크 복사
        </button>
      </div>
      <p className="share-app__message" aria-live="polite">{message}</p>
    </section>
  );
}
