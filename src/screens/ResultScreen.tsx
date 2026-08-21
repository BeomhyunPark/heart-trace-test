import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { RESULT_TYPES } from '../data/resultTypes';
import type { ResultTypeId } from '../domain/types';
import {
  getResultImageFilename,
  loadResultImageFile,
  saveResultImageFile,
  type ResultImageAction,
} from '../utils/resultImage';

type ResultScreenProps = {
  resultId: ResultTypeId;
  onRestart: () => void;
  onBackHome: () => void;
};

type ResultStyle = CSSProperties & {
  '--result-background': string;
  '--result-accent': string;
  '--result-text': string;
  '--result-muted': string;
  '--result-button-gradient': string;
  '--result-button-text': string;
};

export function ResultScreen({ resultId, onRestart, onBackHome }: ResultScreenProps) {
  const result = RESULT_TYPES[resultId];
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const closeHelpButtonRef = useRef<HTMLButtonElement>(null);
  const style: ResultStyle = {
    '--result-background': result.theme.background,
    '--result-accent': result.theme.accent,
    '--result-text': result.theme.text,
    '--result-muted': result.theme.muted,
    '--result-button-gradient': result.theme.buttonGradient,
    '--result-button-text': result.theme.buttonText,
  };

  useEffect(() => {
    let isCurrent = true;

    setResultFile(null);
    setImageLoadFailed(false);
    setSaveMessage(null);

    void loadResultImageFile(
      result.resultCardSrc,
      getResultImageFilename(result.id),
    )
      .then((file) => {
        if (isCurrent) {
          setImageLoadFailed(false);
          setResultFile(file);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setImageLoadFailed(true);
          setSaveMessage('이미지를 준비하지 못했어요. 잠시 후 다시 시도해 주세요.');
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [result.id, result.resultCardSrc]);

  useEffect(() => {
    if (!showIosHelp) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowIosHelp(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeHelpButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);

      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [showIosHelp]);

  const handleImageAction = (action: ResultImageAction) => {
    switch (action) {
      case 'shared':
        setSaveMessage('결과 이미지를 공유했어요.');
        break;
      case 'downloaded':
        setSaveMessage('결과 이미지 다운로드를 시작했어요.');
        break;
      case 'ios-help':
        setSaveMessage(null);
        setShowIosHelp(true);
        break;
      case 'cancelled':
        setSaveMessage(null);
        break;
    }
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const file = resultFile ?? await loadResultImageFile(
        result.resultCardSrc,
        getResultImageFilename(result.id),
      );

      setResultFile(file);
      setImageLoadFailed(false);

      const action = await saveResultImageFile(
        file,
        result.resultCardSrc,
      );
      handleImageAction(action);
    } catch {
      setImageLoadFailed(true);
      setSaveMessage('이미지를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={`result-screen result-screen--${result.id}`} style={style}>
      <div
        className="result-screen__content"
        inert={showIosHelp}
        aria-hidden={showIosHelp || undefined}
      >
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
          <h2>{result.name}의 강점</h2>
          {result.strengths.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section className="result-behaviors">
          <h2>이런 모습을 보여요</h2>
          <ul>
            {result.behaviors.map((behavior) => <li key={behavior}>{behavior}</li>)}
          </ul>
        </section>

        <section className="result-traces">
          <h2>{result.name}에게 새겨질 흔적</h2>
          <div className="result-traces__tags">
            {result.engravedTraces.map((trace) => <span key={trace}>{trace}</span>)}
          </div>
        </section>

        <h2 className="result-messages__title">마음에 새겨요</h2>
        <section className="result-messages">
          <article>
            <h2>마음에 남길 한 문장</h2>
            <p>{result.mindSentence}</p>
          </article>
          <article>
            <h2>오늘의 한마디</h2>
            <p>{result.todayMessage}</p>
          </article>
        </section>

        <button
          className="result-save-button"
          type="button"
          disabled={(resultFile === null && !imageLoadFailed) || isSaving}
          onClick={handleSave}
        >
          {isSaving
            ? '저장 준비 중…'
            : imageLoadFailed
              ? '이미지 다시 불러오기'
              : resultFile === null
                ? '이미지 준비 중…'
                : '결과 이미지 저장하기'}
        </button>
        <p className="result-save-notice" aria-live="polite">{saveMessage}</p>

        <p className="result-disclaimer">이 결과는 당신을 규정하거나 저장하지 않아요.</p>

        <div className="result-navigation">
          <button className="result-restart-button" type="button" onClick={onRestart}>처음부터 다시 하기</button>
          <button className="result-home-button" type="button" onClick={onBackHome}>다른 놀거리 보기</button>
        </div>
      </div>

      {showIosHelp ? (
        <div className="save-help" role="presentation" onMouseDown={() => setShowIosHelp(false)}>
          <section
            className="save-help__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-help-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              ref={closeHelpButtonRef}
              className="save-help__close"
              type="button"
              aria-label="저장 안내 닫기"
              onClick={() => setShowIosHelp(false)}
            >
              ×
            </button>
            <h2 id="save-help-title">iPhone에 이미지 저장하기</h2>
            <p>아래 이미지를 길게 누른 뒤<br />‘사진에 저장’을 선택해 주세요.</p>
            <div className="save-help__preview">
              <img src={result.resultCardSrc} alt={`${result.name} 저장용 결과 이미지`} />
            </div>
            <a href={result.resultCardSrc} target="_blank" rel="noopener noreferrer">
              이미지 크게 열기
            </a>
          </section>
        </div>
      ) : null}
    </main>
  );
}
