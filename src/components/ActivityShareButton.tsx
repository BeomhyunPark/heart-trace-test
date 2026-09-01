import { useState, type CSSProperties } from 'react';

import type { ActivityTarget } from '../app/activityNavigation';
import { getShareTarget } from '../app/shareTargets';
import {
  shareAppLink,
  type ShareAppLinkResult,
} from '../features/home/services/shareAppLink';

type ActivityShareButtonProps = {
  target: ActivityTarget;
};

function getSiteBaseUrl(): URL {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;

  return new URL(canonical ?? './', window.location.href);
}

export function buildActivityShareUrl(slug: string): string {
  return new URL(`share/${slug}/`, getSiteBaseUrl()).href;
}

export function ActivityShareButton({ target }: ActivityShareButtonProps) {
  const [message, setMessage] = useState('');
  const shareTarget = getShareTarget(target);

  if (!shareTarget) {
    return null;
  }

  const handleShare = async () => {
    const result = await shareAppLink({
      title: shareTarget.title,
      url: buildActivityShareUrl(shareTarget.slug),
    });
    const messages: Partial<Record<ShareAppLinkResult, string>> = {
      shared: `${shareTarget.label} 링크를 공유했어요.`,
      copied: `${shareTarget.label} 링크를 복사했어요.`,
      failed: '링크를 복사하지 못했어요.',
    };

    if (result !== 'cancelled') {
      setMessage(messages[result] ?? '');
    }
  };

  return (
    <div
      className="activity-link-share"
      style={{
        '--activity-share-accent': shareTarget.accent,
        '--activity-share-secondary': shareTarget.secondary,
      } as CSSProperties}
    >
      <p aria-live="polite" aria-atomic="true">{message}</p>
      <button
        type="button"
        aria-label={`${shareTarget.label} 링크 공유하기`}
        onClick={handleShare}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="18" cy="5" r="2.5" />
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="19" r="2.5" />
          <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
        </svg>
      </button>
    </div>
  );
}
