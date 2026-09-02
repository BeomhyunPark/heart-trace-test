import { memo, useEffect, useState, type CSSProperties } from 'react';

import type { ActivityTarget } from '../app/activityNavigation';
import { getShareTarget } from '../app/shareTargets';
import {
  shareAppLink,
  type ShareAppLinkResult,
} from '../features/home/services/shareAppLink';
import { getEngagementContentCode } from '../engagement/contentCodes';
import {
  getCachedContentLike,
  getContentLike,
  recordShareClick,
  setContentLike,
} from '../engagement/tracker';
import { getEngagementLikeVariant } from '../engagement/likeVariants';
import type { EngagementContentCode, LikeResponse } from '../engagement/types';

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

type ActivityLikeButtonProps = {
  contentCode: EngagementContentCode;
  variantCode: string;
};

const ActivityLikeButton = memo(function ActivityLikeButton({
  contentCode,
  variantCode,
}: ActivityLikeButtonProps) {
  const [likeState, setLikeState] = useState<LikeResponse | null>(() => (
    getCachedContentLike(contentCode, variantCode)
  ));
  const [likeBusy, setLikeBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    void getContentLike(contentCode, variantCode)
      .then((state) => {
        if (active) setLikeState(state);
      })
      .catch(() => {
        // 최초 상태 조회 실패는 콘텐츠 이용을 방해하지 않는다.
      });

    return () => { active = false; };
  }, [contentCode, variantCode]);

  const handleLike = async () => {
    if (!likeState || likeBusy) return;

    const previous = likeState;
    const nextLiked = !previous.liked;
    setLikeState({
      variantCode,
      liked: nextLiked,
      likeCount: Math.max(0, previous.likeCount + (nextLiked ? 1 : -1)),
    });
    setLikeBusy(true);
    setError('');
    try {
      setLikeState(await setContentLike(contentCode, variantCode, nextLiked));
    } catch {
      setLikeState(previous);
      setError('좋아요를 반영하지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLikeBusy(false);
    }
  };

  return (
    <>
      <p aria-live="polite" aria-atomic="true">{error}</p>
      <button
        className={`activity-link-share__like${likeState?.liked ? ' is-liked' : ''}`}
        type="button"
        disabled={likeState === null}
        aria-busy={likeBusy}
        aria-label={likeState === null
          ? '좋아요 정보 불러오는 중'
          : `좋아요 ${likeState.liked ? '취소' : '추가'} · 현재 ${likeState.likeCount}개`}
        aria-pressed={likeState?.liked ?? false}
        onClick={handleLike}
      >
        <span aria-hidden="true">{likeState?.liked ? '♥' : '♡'}</span>
        {likeState && likeState.likeCount > 0 ? (
          <small aria-hidden="true">{likeState.likeCount}</small>
        ) : null}
      </button>
    </>
  );
});

export const ActivityShareButton = memo(function ActivityShareButton({
  target,
}: ActivityShareButtonProps) {
  const [message, setMessage] = useState('');
  const shareTarget = getShareTarget(target);
  const contentCode = getEngagementContentCode(target);
  const variantCode = getEngagementLikeVariant(target);

  useEffect(() => {
    setMessage('');
  }, [shareTarget?.slug]);

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
        <ActivityLikeButton
          contentCode={contentCode}
          variantCode={variantCode}
          key={`${contentCode}:${variantCode}`}
        />
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
});
