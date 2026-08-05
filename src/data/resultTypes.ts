import type { ResultType, ResultTypeId } from '../domain/types';

export const RESULT_TYPES = {
  bear: {
    id: 'bear',
    name: '곰곰이',
    trace: '붙잡음의 흔적',
    engravedTraces: ['위로', '용서', '자유'],
  },
  spring: {
    id: 'spring',
    name: '봄봄이',
    trace: '감춤의 흔적',
    engravedTraces: ['사랑', '담대함', '정체성'],
  },
  effort: {
    id: 'effort',
    name: '낑낑이',
    trace: '애씀의 흔적',
    engravedTraces: ['은혜', '균형', '신뢰'],
  },
  pause: {
    id: 'pause',
    name: '숨숨이',
    trace: '숨 고르기의 흔적',
    engravedTraces: ['용기', '공동체', '소망'],
  },
  express: {
    id: 'express',
    name: '톡톡이',
    trace: '표출의 흔적',
    engravedTraces: ['온유', '인내', '평안'],
  },
} as const satisfies Record<ResultTypeId, ResultType>;

