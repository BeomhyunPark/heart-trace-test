export type GureumiStatisticsFilters = {
  version?: string;
  completedAnswersOnly: boolean;
  firstAttemptOnly: boolean;
};

export type GureumiVersionSummary = {
  code: string;
  status: 'ACTIVE' | 'ARCHIVED';
};

export type GureumiFunnelStatistics = {
  started: number;
  q9Reached: number;
  q9Rate: number;
  q18Reached: number;
  q18Rate: number;
  completed: number;
  completionRate: number;
  feedbackSubmitted: number;
  feedbackRate: number;
};

export type GureumiQuestionStatistics = {
  order: number;
  code: string;
  prompt: string;
  axis: 'NOVELTY' | 'WORRY' | 'RELATION';
  responseCount: number;
  aVeryCount: number;
  aVeryPercentage: number;
  aLittleCount: number;
  aLittlePercentage: number;
  bLittleCount: number;
  bLittlePercentage: number;
  bVeryCount: number;
  bVeryPercentage: number;
  averageScore?: number;
  averageResponseMs?: number;
};

export type GureumiAxisStatistics = {
  key: 'NOVELTY' | 'WORRY' | 'RELATION';
  label: string;
  completedCount: number;
  highCount: number;
  highPercentage: number;
  lowCount: number;
  lowPercentage: number;
  boundaryCount: number;
  boundaryPercentage: number;
  averageScore?: number;
};

export type GureumiRatingStatistics = {
  rating: number;
  count: number;
  percentage: number;
};

export type GureumiResultStatistics = {
  resultType: string;
  displayName: string;
  count: number;
  percentage: number;
  feedbackCount: number;
  averageRating?: number;
  ratings: GureumiRatingStatistics[];
};

export type GureumiFeedbackStatistics = {
  submittedCount: number;
  completionResponsePercentage: number;
  averageRating?: number;
  ratings: GureumiRatingStatistics[];
};

export type GureumiStatistics = {
  version: string;
  availableVersions: GureumiVersionSummary[];
  completedAnswersOnly: boolean;
  firstAttemptOnly: boolean;
  funnel: GureumiFunnelStatistics;
  questions: GureumiQuestionStatistics[];
  axes: GureumiAxisStatistics[];
  results: GureumiResultStatistics[];
  feedback: GureumiFeedbackStatistics;
};
