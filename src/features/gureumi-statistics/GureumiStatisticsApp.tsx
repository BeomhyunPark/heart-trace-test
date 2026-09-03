import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';

import {
  getGureumiStatistics,
  GureumiStatisticsApiError,
} from './api/statisticsApi';
import type {
  GureumiFunnelStatistics,
  GureumiStatistics,
  GureumiStatisticsFilters,
} from './domain/types';
import './styles/gureumi-statistics.css';

const ADMIN_KEY_STORAGE = 'ongi_gureumi_admin_key_v1';

type GureumiStatisticsAppProps = {
  onBackHome: () => void;
};

type LoadState = 'idle' | 'loading' | 'ready';

const DEFAULT_FILTERS: GureumiStatisticsFilters = {
  completedAnswersOnly: true,
  firstAttemptOnly: true,
};

const AXIS_SHORT_LABELS: Record<string, string> = {
  NOVELTY: 'N',
  WORRY: 'W',
  RELATION: 'R',
};

function readAdminKey(): string {
  try {
    return window.sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
}

function storeAdminKey(key: string): void {
  try {
    if (key) window.sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
    else window.sessionStorage.removeItem(ADMIN_KEY_STORAGE);
  } catch {
    // sessionStorage가 막혀도 현재 화면에서는 사용할 수 있다.
  }
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatScore(value?: number): string {
  return value === undefined ? '—' : value.toFixed(2);
}

function formatResponseTime(value?: number): string {
  return value === undefined ? '—' : `${(value / 1000).toFixed(1)}초`;
}

function funnelCards(funnel: GureumiFunnelStatistics) {
  return [
    { label: '시작', count: funnel.started, rate: 100, tone: 'neutral' },
    { label: 'Q9 도달', count: funnel.q9Reached, rate: funnel.q9Rate, tone: 'blue' },
    { label: 'Q18 도달', count: funnel.q18Reached, rate: funnel.q18Rate, tone: 'purple' },
    { label: '완료', count: funnel.completed, rate: funnel.completionRate, tone: 'warm' },
    { label: '피드백', count: funnel.feedbackSubmitted, rate: funnel.feedbackRate, tone: 'pink' },
  ];
}

export function GureumiStatisticsApp({ onBackHome }: GureumiStatisticsAppProps) {
  const [adminKey, setAdminKey] = useState(readAdminKey);
  const [keyInput, setKeyInput] = useState('');
  const [filters, setFilters] = useState<GureumiStatisticsFilters>(DEFAULT_FILTERS);
  const [statistics, setStatistics] = useState<GureumiStatistics | null>(null);
  const [loadState, setLoadState] = useState<LoadState>(adminKey ? 'loading' : 'idle');
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const requestSequence = useRef(0);

  const load = useCallback(async (key: string, nextFilters: GureumiStatisticsFilters) => {
    const sequence = ++requestSequence.current;
    setLoadState('loading');
    setError('');
    try {
      const response = await getGureumiStatistics(key, nextFilters);
      if (sequence !== requestSequence.current) return;
      setStatistics(response);
      setLoadState('ready');
    } catch (loadError) {
      if (sequence !== requestSequence.current) return;
      const message = loadError instanceof Error
        ? loadError.message
        : '통계를 불러오지 못했습니다.';
      if (loadError instanceof GureumiStatisticsApiError && loadError.status === 401) {
        storeAdminKey('');
        setAdminKey('');
        setStatistics(null);
        setLoadState('idle');
      } else {
        setLoadState(statistics ? 'ready' : 'idle');
      }
      setError(message);
    }
  }, [statistics]);

  useEffect(() => {
    if (!adminKey) return;
    void load(adminKey, filters);
    // refreshKey는 수동 새로고침 요청을 표현한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey, filters.version, filters.completedAnswersOnly, filters.firstAttemptOnly, refreshKey]);

  const handleAccess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextKey = keyInput.trim();
    if (!nextKey) {
      setError('관리자 키를 입력해주세요.');
      return;
    }
    storeAdminKey(nextKey);
    setAdminKey(nextKey);
    setKeyInput('');
  };

  const updateFilters = (next: Partial<GureumiStatisticsFilters>) => {
    setFilters((current) => ({ ...current, ...next }));
  };

  const signOut = () => {
    requestSequence.current += 1;
    storeAdminKey('');
    setAdminKey('');
    setStatistics(null);
    setLoadState('idle');
    setError('');
  };

  if (!adminKey) {
    return (
      <main className="gureumi-stats-access">
        <form onSubmit={handleAccess}>
          <p>INTERNAL · GUREUMI BETA</p>
          <h1>통계 화면 잠금 해제</h1>
          <span>익명 집계 데이터이지만 공개 URL만으로 노출하지 않습니다.</span>
          <label htmlFor="gureumi-admin-key">관리자 키</label>
          <input
            id="gureumi-admin-key"
            type="password"
            autoComplete="current-password"
            value={keyInput}
            onChange={(event) => setKeyInput(event.target.value)}
          />
          <button type="submit">통계 보기</button>
          {error ? <strong role="alert">{error}</strong> : null}
          <small>키는 URL이나 localStorage에 남기지 않고 현재 탭에만 보관합니다.</small>
          <button className="gureumi-stats-access__home" type="button" onClick={onBackHome}>온기 홈으로</button>
        </form>
      </main>
    );
  }

  if (!statistics && loadState === 'loading') {
    return (
      <main className="gureumi-stats-loading" aria-live="polite">
        <span>☁</span>
        <h1>구르미 Beta 통계를 불러오는 중입니다</h1>
      </main>
    );
  }

  if (!statistics) {
    return (
      <main className="gureumi-stats-access">
        <section>
          <h1>통계를 불러오지 못했습니다</h1>
          <p role="alert">{error}</p>
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)}>다시 시도</button>
          <button type="button" onClick={signOut}>다른 키 입력</button>
        </section>
      </main>
    );
  }

  return (
    <main className="gureumi-stats-page">
      <div className="gureumi-stats-workspace">
        <header className="gureumi-stats-header">
          <div>
            <h1>구르미 Beta 통계</h1>
            <p>문항 품질 검증용 집계 · 개인정보와 raw token은 표시하지 않음</p>
          </div>
          <div className="gureumi-stats-filters" aria-label="통계 필터">
            <label>
              <span className="sr-only">테스트 버전</span>
              <select
                value={filters.version ?? statistics.version}
                onChange={(event) => updateFilters({ version: event.target.value })}
              >
                {statistics.availableVersions.map((version) => (
                  <option value={version.code} key={version.code}>
                    {version.code}{version.status === 'ACTIVE' ? ' · ACTIVE' : ''}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              aria-pressed={filters.completedAnswersOnly}
              onClick={() => updateFilters({ completedAnswersOnly: !filters.completedAnswersOnly })}
            >
              {filters.completedAnswersOnly ? '완료자 응답' : '전체 응답'}
            </button>
            <button
              type="button"
              aria-pressed={filters.firstAttemptOnly}
              onClick={() => updateFilters({ firstAttemptOnly: !filters.firstAttemptOnly })}
            >
              {filters.firstAttemptOnly ? '최초 검사' : '전체 검사'}
            </button>
            <button
              className="gureumi-stats-filters__refresh"
              type="button"
              disabled={loadState === 'loading'}
              onClick={() => setRefreshKey((value) => value + 1)}
            >
              {loadState === 'loading' ? '갱신 중…' : '새로고침'}
            </button>
            <button className="gureumi-stats-filters__exit" type="button" onClick={signOut}>잠금</button>
          </div>
        </header>

        {error ? <p className="gureumi-stats-error" role="alert">{error}</p> : null}

        <section className="gureumi-stats-funnel" aria-label="진행 funnel">
          {funnelCards(statistics.funnel).map((card) => (
            <article className={`gureumi-stats-funnel__card is-${card.tone}`} key={card.label}>
              <strong>{card.label}</strong>
              <p>{card.count.toLocaleString('ko-KR')} <span>· {formatPercent(card.rate)}</span></p>
            </article>
          ))}
        </section>

        <div className="gureumi-stats-analysis">
          <section className="gureumi-stats-panel gureumi-stats-questions" aria-labelledby="question-statistics-title">
            <header>
              <h2 id="question-statistics-title">문항별 응답 분석</h2>
              <p>선택 비율 · 서버 계산 평균 score · 평균 응답 시간</p>
            </header>
            <div className="gureumi-stats-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>문항</th>
                    <th>상황</th>
                    <th>표본</th>
                    <th>A 매우</th>
                    <th>A 조금</th>
                    <th>B 조금</th>
                    <th>B 매우</th>
                    <th>평균</th>
                    <th>응답시간</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.questions.map((question) => (
                    <tr key={question.order}>
                      <td>
                        <b>Q{String(question.order).padStart(2, '0')}</b>
                        <small>{AXIS_SHORT_LABELS[question.axis]} · {question.code}</small>
                      </td>
                      <td>{question.prompt}</td>
                      <td>{question.responseCount.toLocaleString('ko-KR')}</td>
                      <td title={`${question.aVeryCount}건`}>{formatPercent(question.aVeryPercentage)}</td>
                      <td title={`${question.aLittleCount}건`}>{formatPercent(question.aLittlePercentage)}</td>
                      <td title={`${question.bLittleCount}건`}>{formatPercent(question.bLittlePercentage)}</td>
                      <td title={`${question.bVeryCount}건`}>{formatPercent(question.bVeryPercentage)}</td>
                      <td>{formatScore(question.averageScore)}</td>
                      <td>{formatResponseTime(question.averageResponseMs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <aside>
              <strong>분포가 몰려도 cutoff부터 바꾸지 않기</strong>
              <p>문항 매력도, 축 혼입, 반복성, 집단 편향, 오해 가능성을 먼저 검토합니다.</p>
            </aside>
          </section>

          <aside className="gureumi-stats-sidebar">
            <section className="gureumi-stats-panel" aria-labelledby="axis-statistics-title">
              <h2 id="axis-statistics-title">축 분포와 Boundary</h2>
              <div className="gureumi-stats-axis-list">
                {statistics.axes.map((axis) => (
                  <article key={axis.key}>
                    <div>
                      <strong>{axis.label}</strong>
                      <span>평균 {formatScore(axis.averageScore)}</span>
                    </div>
                    <p>HIGH {formatPercent(axis.highPercentage)} / LOW {formatPercent(axis.lowPercentage)} · 경계 {formatPercent(axis.boundaryPercentage)}</p>
                    <i aria-hidden="true"><b style={{ width: `${axis.highPercentage}%` }} /></i>
                    <small>{axis.completedCount.toLocaleString('ko-KR')}건 · HIGH {axis.highCount} · LOW {axis.lowCount} · 경계 {axis.boundaryCount}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="gureumi-stats-panel" aria-labelledby="result-statistics-title">
              <h2 id="result-statistics-title">8개 결과 분포</h2>
              <div className="gureumi-stats-result-list">
                {statistics.results.map((result) => (
                  <article key={result.resultType}>
                    <div>
                      <strong>{result.displayName}</strong>
                      <span>{result.count.toLocaleString('ko-KR')}명 · {formatPercent(result.percentage)}</span>
                    </div>
                    <p>만족도 {result.averageRating === undefined ? '—' : `${result.averageRating.toFixed(2)} / 4`} · {result.feedbackCount}건</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="gureumi-stats-panel gureumi-stats-feedback" aria-labelledby="feedback-statistics-title">
              <h2 id="feedback-statistics-title">결과 만족도</h2>
              <p className="gureumi-stats-feedback__summary">
                평균 <strong>{statistics.feedback.averageRating?.toFixed(2) ?? '—'} / 4</strong>
                <span>응답 {statistics.feedback.submittedCount.toLocaleString('ko-KR')}건 · 완료 대비 {formatPercent(statistics.feedback.completionResponsePercentage)}</span>
              </p>
              <div>
                {statistics.feedback.ratings.map((rating) => (
                  <p key={rating.rating}>
                    <span>{['전혀 아님', '조금 아님', '조금 비슷', '매우 비슷'][rating.rating - 1]}</span>
                    <strong>{formatPercent(rating.percentage)}</strong>
                    <small>{rating.count}건</small>
                  </p>
                ))}
              </div>
            </section>

            <p className="gureumi-stats-privacy">※ 집계 데이터만 제공하며 개별 attempt, raw token, 개인정보는 표시하지 않습니다. 축과 결과는 완료된 검사 기준입니다.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
