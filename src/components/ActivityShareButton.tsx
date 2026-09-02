import { useEffect, useState, type CSSProperties } from 'react';

import type { ActivityTarget } from '../app/activityNavigation';
import { getShareTarget } from '../app/shareTargets';
import {
  shareAppLink,
  type ShareAppLinkResult,
} from '../features/home/services/shareAppLink';
import { getEngagementContentCode } from '../engagement/contentCodes';
import {
  getContentLike,
  recordShareClick,
  setContentLike,
} from '../engagement/tracker';

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
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeBusy, setLikeBusy] = useState(false);
  const shareTarget = getShareTarget(target);
  const contentCode = getEngagementContentCode(target);

  useEffect(() => {
    let active = true;

    if (!contentCode) return () => { active = false; };
    void getContentLike(contentCode)
      .then((state) => {
        if (active) {
          setLiked(state.liked);
          setLikeCount(state.likeCount);
        }
      })
      .catch(() => {
        // 최초 상태 조회 실패는 콘텐츠 이용을 방해하지 않는다.
      });

    return () => { active = false; };
  }, [contentCode]);

  if (!shareTarget && !contentCode) {
    return null;
  }

  const handleShare = async () => {
    if (!shareTarget) return;

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
      if (contentCode && (result === 'shared' || result === 'copied')) {
        void recordShareClick(contentCode, result === 'shared' ? 'native' : 'copy_link');
      }
    }
  };

  const handleLike = async () => {
    if (!contentCode || likeBusy) return;

    setLikeBusy(true);
    setMessage('');
    try {
      const state = await setContentLike(contentCode, !liked);
      setLiked(state.liked);
      setLikeCount(state.likeCount);
      setMessage(state.liked ? '좋아요를 남겼어요.' : '좋아요를 취소했어요.');
    } catch {
      setMessage('좋아요를 반영하지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLikeBusy(false);
    }
  };

  const accent = shareTarget?.accent ?? '#ffc98f';
  const secondary = shareTarget?.secondary ?? '#f48faa';

  return (
    <div
      className="activity-link-share"
      style={{
        '--activity-share-accent': accent,
        '--activity-share-secondary': secondary,
      } as CSSProperties}
    >
      <p aria-live="polite" aria-atomic="true">{message}</p>
      {contentCode ? (
        <button
          className={`activity-link-share__like${liked ? ' is-liked' : ''}`}
          type="button"
          disabled={likeBusy}
          aria-label={`좋아요 ${liked ? '취소' : '추가'} · 현재 ${likeCount}개`}
          aria-pressed={liked}
          onClick={handleLike}
        >
          <span aria-hidden="true">{liked ? '♥' : '♡'}</span>
          {likeCount > 0 ? <small aria-hidden="true">{likeCount}</small> : null}
        </button>
      ) : null}
      {shareTarget ? (
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
      ) : null}
    </div>
  );
}
