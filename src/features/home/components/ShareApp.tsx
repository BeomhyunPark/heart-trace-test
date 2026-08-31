import { useState } from 'react';

import { shareAppLink, type ShareAppLinkResult } from '../services/shareAppLink';

export function ShareApp() {
  const [message, setMessage] = useState<string | null>(null);

  const handleShare = async () => {
    const result = await shareAppLink();
    const messages: Partial<Record<ShareAppLinkResult, string>> = {
      shared: '온기 링크를 공유했어요.',
      copied: '온기 링크를 복사했어요.',
      failed: '링크를 복사하지 못했어요. 주소창의 URL을 복사해 주세요.',
    };

    if (result !== 'cancelled') {
      setMessage(messages[result] ?? null);
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
