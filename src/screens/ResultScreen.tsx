import type { CSSProperties } from 'react';

import { RESULT_TYPES } from '../data/resultTypes';
import type { ResultTypeId } from '../domain/types';

type ResultScreenProps = {
  resultId: ResultTypeId;
};

type ResultStyle = CSSProperties & {
  '--result-background': string;
  '--result-accent': string;
  '--result-text': string;
  '--result-muted': string;
  '--result-button-gradient': string;
  '--result-button-text': string;
};

export function ResultScreen({ resultId }: ResultScreenProps) {
  const result = RESULT_TYPES[resultId];
  const style: ResultStyle = {
    '--result-background': result.theme.background,
    '--result-accent': result.theme.accent,
    '--result-text': result.theme.text,
    '--result-muted': result.theme.muted,
    '--result-button-gradient': result.theme.buttonGradient,
    '--result-button-text': result.theme.buttonText,
  };

  return (
    <main className={`result-screen result-screen--${result.id}`} style={style}>
      <div className="result-screen__content">
        <header className="result-hero">
          <p className="eyebrow">당신에게 가장 선명한 흔적</p>
          <h1>{result.name}</h1>
          <div className="result-hero__character">
            <span className="result-hero__glow" aria-hidden="true" />
            <img src={result.imageSrc} alt={`${result.name} 캐릭터`} />
          </div>
          <p className="result-hero__trace">{result.trace}</p>
          <p className="result-hero__descriptor">{result.descriptor}</p>
        </header>

        <section className="result-intro" aria-label={`${result.name} 소개`}>
          {result.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <img className="result-separator" src={result.separatorSrc} alt="" aria-hidden="true" />

        <section className="result-panel">
          <h2>이런 힘을 가지고 있어요</h2>
          {result.strengths.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section className="result-behaviors">
          <h2>이런 모습으로 나타나요</h2>
          <ul>
            {result.behaviors.map((behavior) => <li key={behavior}>{behavior}</li>)}
          </ul>
        </section>

        <section className="result-traces">
          <h2>{result.name}에게 새겨질 흔적</h2>
          <div className="result-traces__tags">
            {result.engravedTraces.map((trace) => <span key={trace}># {trace}</span>)}
          </div>
        </section>

        <section className="result-messages">
          <article>
            <h2>마음에 남길 한 문장</h2>
            <p>{result.mindSentence}</p>
          </article>
          <article>
            <h2>오늘의 흔적 미션</h2>
            <p>{result.todayMessage}</p>
          </article>
        </section>

        <button
          className="result-save-button"
          type="button"
          disabled
          title="결과 이미지 저장은 다음 개발 단계에서 제공됩니다."
        >
          결과 이미지 저장하기
        </button>
        <p className="result-save-notice">이미지 저장 기능은 다음 단계에서 연결돼요.</p>

        <p className="result-disclaimer">
          이 결과는 수련회 아이스브레이킹을 위한 콘텐츠이며,<br />전문적인 심리 진단이 아닙니다.
        </p>
      </div>
    </main>
  );
}
