import { useState, type CSSProperties } from 'react';

import { assetUrl } from '../../../utils/assetUrl';
import { GUREUMI_RESULTS } from '../data/results';
import type { GureumiResult } from '../domain/types';
import { saveGureumiResultImage } from '../services/resultImage';

type GureumiResultScreenProps = {
  result: GureumiResult;
  restarting: boolean;
  restartError: string;
  onFeedback: (rating: number) => Promise<void>;
  onRestart: () => void;
  onBackHome: () => void;
};

type ResultVariables = CSSProperties & {
  '--gureumi-result-hero-start': string;
  '--gureumi-result-hero-middle': string;
  '--gureumi-result-hero-end': string;
  '--gureumi-result-hero-ink': string;
  '--gureumi-result-hero-label': string;
  '--gureumi-result-label-accent': string;
  '--gureumi-result-balance-label': string;
  '--gureumi-result-accent': string;
  '--gureumi-result-accent-middle': string;
  '--gureumi-result-accent-end': string;
  '--gureumi-result-accent-soft': string;
  '--gureumi-result-accent-ink': string;
  '--gureumi-result-balance-start': string;
  '--gureumi-result-balance-middle': string;
  '--gureumi-result-balance-end': string;
  '--gureumi-result-closing-start': string;
  '--gureumi-result-closing-middle': string;
  '--gureumi-result-closing-end': string;
  '--gureumi-result-sparkle': string;
  '--gureumi-result-action-start': string;
  '--gureumi-result-action-middle': string;
  '--gureumi-result-action-end': string;
};

const FEEDBACK_OPTIONS = [
  '전혀 비슷하지 않다',
  '조금 비슷하지 않다',
  '조금 비슷하다',
  '매우 비슷하다',
] as const;

export function GureumiResultScreen({
  result,
  restarting,
  restartError,
  onFeedback,
  onRestart,
  onBackHome,
}: GureumiResultScreenProps) {
  const definition = GUREUMI_RESULTS[result.resultType];
  const [feedbackRating, setFeedbackRating] = useState(result.feedbackRating ?? 0);
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [savingImage, setSavingImage] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const style: ResultVariables = {
    '--gureumi-result-hero-start': definition.theme.heroStart,
    '--gureumi-result-hero-middle': definition.theme.heroMiddle,
    '--gureumi-result-hero-end': definition.theme.heroEnd,
    '--gureumi-result-hero-ink': definition.theme.heroInk,
    '--gureumi-result-hero-label': definition.theme.heroLabel,
    '--gureumi-result-label-accent': definition.theme.labelAccent,
    '--gureumi-result-balance-label': definition.theme.balanceLabel,
    '--gureumi-result-accent': definition.theme.accent,
    '--gureumi-result-accent-middle': definition.theme.accentMiddle,
    '--gureumi-result-accent-end': definition.theme.accentEnd,
    '--gureumi-result-accent-soft': definition.theme.accentSoft,
    '--gureumi-result-accent-ink': definition.theme.accentInk,
    '--gureumi-result-balance-start': definition.theme.balanceStart,
    '--gureumi-result-balance-middle': definition.theme.balanceMiddle,
    '--gureumi-result-balance-end': definition.theme.balanceEnd,
    '--gureumi-result-closing-start': definition.theme.closingStart,
    '--gureumi-result-closing-middle': definition.theme.closingMiddle,
    '--gureumi-result-closing-end': definition.theme.closingEnd,
    '--gureumi-result-sparkle': definition.theme.sparkle,
    '--gureumi-result-action-start': definition.theme.actionStart,
    '--gureumi-result-action-middle': definition.theme.actionMiddle,
    '--gureumi-result-action-end': definition.theme.actionEnd,
  };

  const handleFeedback = async (rating: number) => {
    const previous = feedbackRating;
    setFeedbackRating(rating);
    setFeedbackBusy(true);
    setFeedbackMessage('');
    try {
      await onFeedback(rating);
      setFeedbackMessage('고마워요! Beta 결과를 더 다듬는 데 반영할게요.');
    } catch {
      setFeedbackRating(previous);
      setFeedbackMessage('만족도를 저장하지 못했어요. 잠시 후 다시 선택해주세요.');
    } finally {
      setFeedbackBusy(false);
    }
  };

  const handleSaveImage = async () => {
    setSavingImage(true);
    setSaveMessage('');
    try {
      await saveGureumiResultImage(result.characterKey);
      setSaveMessage('결과 이미지를 저장했어요.');
    } catch {
      setSaveMessage('이미지를 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setSavingImage(false);
    }
  };

  return (
    <main className="gureumi-result" style={style}>
      <nav className="gureumi-result__toolbar" aria-label="결과 화면 탐색">
        <button type="button" onClick={onBackHome}>← 홈</button>
        <span>{result.version} · {result.displayName}</span>
      </nav>

      <article className="gureumi-result__card">
        <header className="gureumi-result__hero">
          <p>{definition.englishType} · GUREUMI TYPE</p>
          <span>당신의 구르미는</span>
          <h1>{definition.name}</h1>
          <h2>{definition.descriptor}</h2>
          <img
            src={assetUrl(`images/teasers/gureumi-test/${definition.characterKey}.png`)}
            alt={`${definition.name} 캐릭터`}
          />
          <blockquote>{definition.quote}</blockquote>
        </header>

        <section className="gureumi-result__section gureumi-result__map" aria-labelledby="gureumi-map-title">
          <p className="gureumi-result__eyebrow">기질 한눈에 보기</p>
          <h2 id="gureumi-map-title">{definition.name}의 기질 지도</h2>
          <p>{definition.summary}</p>
          <div className="gureumi-result__axes">
            {result.axes.map((axis) => (
              <div key={axis.key}>
                <span>{axis.label}</span>
                <strong>{axis.level === 'HIGH' ? '높음' : '낮음'}</strong>
                <i aria-hidden="true"><b style={{ width: axis.level === 'HIGH' ? '88%' : '34%' }} /></i>
              </div>
            ))}
          </div>
        </section>

        <section className="gureumi-result__section">
          <p className="gureumi-result__eyebrow">{definition.name}의 이야기</p>
          <h2>{definition.strengthLead}</h2>
          <p className="gureumi-result__story">{definition.summary}</p>
          <blockquote className="gureumi-result__desire">
            <small>마음속 핵심 욕구</small>
            “{definition.coreDesire}”
          </blockquote>
        </section>

        <section className="gureumi-result__section">
          <p className="gureumi-result__eyebrow">타고난 빛</p>
          <h2>{definition.strengthLead}</h2>
          <p>{definition.strengthBody}</p>
          <ul className="gureumi-result__strengths" aria-label="대표 강점">
            {definition.strengths.map((strength) => <li key={strength}>{strength}</li>)}
          </ul>
        </section>

        <section className="gureumi-result__balance">
          <p className="gureumi-result__eyebrow">빛이 너무 강해질 때</p>
          <h2>균형 있게 빛나기 위한 한 가지</h2>
          <p>{definition.caution}</p>
          <hr />
          <strong>균형을 위한 작은 제안</strong>
          <p>{definition.balanceTip}</p>
        </section>

        <section className="gureumi-result__section">
          <p className="gureumi-result__eyebrow">다른 구르미와 비교</p>
          <h2>비슷해 보여도 달라요</h2>
          <p>가까운 유형과 비교하면 {definition.name}만의 기질이 더 선명해져요.</p>
          <ul className="gureumi-result__differences">
            {definition.differences.map((difference) => (
              <li key={difference.name}><strong>{difference.name}</strong><p>{difference.body}</p></li>
            ))}
          </ul>
          <div className="gureumi-result__synergy">
            <p className="gureumi-result__eyebrow">함께할 때 빛나는 조합</p>
            <h2>서로의 강점을 살리는 친구들</h2>
            <p>누가 더 좋은 유형이라기보다, 서로의 강점을 살리기 쉬운 조합이에요.</p>
            {definition.synergies.map((synergy) => (
              <article key={synergy.pair}>
                <small>{synergy.label}</small>
                <strong>{synergy.pair}</strong>
                <p>{synergy.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="gureumi-result__feedback" aria-labelledby="gureumi-feedback-title">
          <p className="gureumi-result__eyebrow">BETA FEEDBACK</p>
          <h2 id="gureumi-feedback-title">결과가 나와 얼마나 비슷하다고 느꼈나요?</h2>
          <div role="radiogroup" aria-label="결과 만족도">
            {FEEDBACK_OPTIONS.map((label, index) => {
              const rating = index + 1;
              return (
                <button
                  className={feedbackRating === rating ? 'is-selected' : ''}
                  type="button"
                  role="radio"
                  aria-checked={feedbackRating === rating}
                  disabled={feedbackBusy}
                  onClick={() => void handleFeedback(rating)}
                  key={label}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p aria-live="polite">{feedbackMessage}</p>
        </section>

        {showAllTypes ? (
          <section className="gureumi-result__all-types" aria-labelledby="all-gureumi-title">
            <h2 id="all-gureumi-title">8가지 구르미</h2>
            <div>
              {Object.values(GUREUMI_RESULTS).map((item) => (
                <article key={item.id}>
                  <img src={assetUrl(`images/teasers/gureumi-test/${item.characterKey}.png`)} alt="" />
                  <strong>{item.name}</strong>
                  <p>{item.descriptor}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <footer className="gureumi-result__closing">
          <span aria-hidden="true">✦</span>
          <h2>{definition.closing}</h2>
          <button type="button" disabled={savingImage} onClick={() => void handleSaveImage()}>
            {savingImage ? '이미지를 준비하고 있어요…' : '결과 이미지 저장하기'}
          </button>
          <button className="gureumi-result__all-button" type="button" onClick={() => setShowAllTypes((value) => !value)}>
            {showAllTypes ? '8가지 구르미 접기' : '8가지 구르미 모두 보기 →'}
          </button>
          <p aria-live="polite">{saveMessage}</p>
          <p className="gureumi-result__legal">이 테스트는 Cloninger의 기질 이론에서 논의된 일부 개념을 참고해 독자적으로 제작한 놀이형 자기이해 콘텐츠입니다. 정식 TCI 검사 또는 심리학적 진단·평가 도구가 아닙니다.</p>
          <div className="gureumi-result__actions">
            <button type="button" disabled={restarting} onClick={onRestart}>
              {restarting ? '새 테스트 준비 중…' : '다시 테스트하기'}
            </button>
            <button type="button" onClick={onBackHome}>홈으로 돌아가기</button>
          </div>
          {restartError ? <p className="gureumi-error" role="alert">{restartError}</p> : null}
        </footer>
      </article>
    </main>
  );
}
