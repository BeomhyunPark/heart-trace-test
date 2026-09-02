export type EngagementContentCode =
  | 'heart-trace'
  | 'balance-game'
  | 'ideal-world-cup'
  | 'group-picker'
  | 'anonymous-sharing';

export type EngagementEventType = 'PAGE_VIEW' | 'CONTENT_VIEW' | 'SHARE_CLICK';
export type ShareTarget = 'native' | 'copy_link';

export type EngagementIdentity = {
  visitorKey: string;
  visitKey: string;
};

export type ParticipationResponse = {
  participationId: number;
  requestKey: string;
  contentCode: EngagementContentCode;
  versionNo: string;
  resultCode?: string;
  startedAt: string;
  completedAt?: string;
};

export type LikeResponse = {
  liked: boolean;
  likeCount: number;
};

export type VisitorStatisticsResponse = {
  visitorCount: number;
};
