import { useMemo, useState } from 'react';

import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressBar } from '../../components/ProgressBar';
import { ScreenLayout } from '../../components/ScreenLayout';
import { BALANCE_GAME_QUESTIONS, CURATED_LIGHT_QUESTION_IDS } from './data/questions';
import type { BalanceGameCategory, BalanceGameQuestion } from './domain/types';
import './styles/balance-game.css';

type BalanceGameAppProps = {
  onBackHome: () => void;
};

type Phase = 'setup' | 'picker' | 'play' | 'complete';
type QuestionFilter = 'all' | BalanceGameCategory;

const CATEGORY_LABELS: Record<BalanceGameCategory, string> = {
  daily: '일상 · 성향',
  faith: '교회 · 신앙',
};

const CURATED_QUESTIONS = CURATED_LIGHT_QUESTION_IDS.map((questionId) => {
  const question = BALANCE_GAME_QUESTIONS.find((candidate) => candidate.id === questionId);

  if (!question) {
    throw new Error(`추천 질문을 찾을 수 없습니다: ${questionId}`);
  }

  return question;
});

export function BalanceGameApp({ onBackHome }: BalanceGameAppProps) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [filter, setFilter] = useState<QuestionFilter>('all');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<readonly string[]>([]);
  const [playQuestions, setPlayQuestions] = useState<readonly BalanceGameQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);

  const visibleQuestions = useMemo(
    () => BALANCE_GAME_QUESTIONS.filter(
      (question) => filter === 'all' || question.category === filter,
    ),
    [filter],
  );

  const startGame = (questions: readonly BalanceGameQuestion[]) => {
    setPlayQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedSide(null);
    setPhase('play');
  };

  const startCustomGame = () => {
    const questions = BALANCE_GAME_QUESTIONS.filter(
      (question) => selectedQuestionIds.includes(question.id),
    );

    if (questions.length > 0) {
      startGame(questions);
    }
  };

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestionIds((current) => current.includes(questionId)
      ? current.filter((id) => id !== questionId)
      : [...current, questionId]);
  };

  const showPicker = () => {
    setSelectedSide(null);
    setPhase('picker');
  };

  if (phase === 'setup') {
    return (
      <ScreenLayout className="balance-game-screen balance-setup">
        <button className="test-home-button" type="button" onClick={onBackHome}>
          <span aria-hidden="true">←</span> 홈
        </button>

        <header className="balance-header">
          <p className="eyebrow">온기 · VS 놀이</p>
          <h1 aria-label="극과 극 밸런스 게임">극과 극<br />밸런스 게임</h1>
          <p>정답보다 서로의 이유가 더 재미있는 시간이에요.</p>
        </header>

        <section className="balance-section" aria-labelledby="weight-title">
          <span className="balance-step">01</span>
          <h2 id="weight-title">오늘 대화의 온도</h2>
          <div className="balance-weight-grid">
            <button className="balance-weight is-selected" type="button" aria-pressed="true">
              <span aria-hidden="true">☀</span>
              <strong>가볍게</strong>
              <small>처음 만나도 편한 질문</small>
            </button>
            <button className="balance-weight" type="button" disabled>
              <span aria-hidden="true">☾</span>
              <strong>조금 깊게</strong>
              <small>다음 업데이트에서 만나요</small>
            </button>
          </div>
        </section>

        <section className="balance-section" aria-labelledby="mode-title">
          <span className="balance-step">02</span>
          <h2 id="mode-title">질문을 고르는 방법</h2>
          <div className="balance-mode-list">
            <button type="button" onClick={() => startGame(CURATED_QUESTIONS)}>
              <span className="balance-mode__icon" aria-hidden="true">▶</span>
              <span><strong>추천 흐름으로 시작</strong><small>가벼운 5문항을 자연스러운 순서로</small></span>
              <b aria-hidden="true">→</b>
            </button>
            <button type="button" onClick={showPicker}>
              <span className="balance-mode__icon" aria-hidden="true">✓</span>
              <span><strong>직접 골라 담기</strong><small>리더가 모임에 맞는 질문만 선택</small></span>
              <b aria-hidden="true">→</b>
            </button>
          </div>
        </section>
        <p className="balance-credit">창작자 · CK</p>
      </ScreenLayout>
    );
  }

  if (phase === 'picker') {
    return (
      <ScreenLayout
        className="balance-game-screen balance-picker"
        footer={(
          <div className="balance-picker__footer">
            <p aria-label={`${selectedQuestionIds.length}개 선택`}><strong>{selectedQuestionIds.length}</strong>개 선택</p>
            <PrimaryButton disabled={selectedQuestionIds.length === 0} onClick={startCustomGame}>
              선택한 질문으로 시작
            </PrimaryButton>
          </div>
        )}
      >
        <button className="test-home-button" type="button" onClick={() => setPhase('setup')}>
          <span aria-hidden="true">←</span> 설정
        </button>
        <header className="balance-picker__header">
          <p className="eyebrow">직접 골라 담기</p>
          <h1>오늘 나눌 질문</h1>
          <p>순서는 카테고리 안에서 부담 없이 이어지도록 정리해드려요.</p>
        </header>

        <div className="balance-filters" role="group" aria-label="질문 카테고리">
          {([['all', '전체'], ['daily', '일상 · 성향'], ['faith', '교회 · 신앙']] as const)
            .map(([id, label]) => (
              <button
                className={filter === id ? 'is-active' : undefined}
                type="button"
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
                key={id}
              >
                {label}
              </button>
            ))}
        </div>

        <div className="balance-question-list">
          {visibleQuestions.map((question) => {
            const isSelected = selectedQuestionIds.includes(question.id);

            return (
              <label className={`balance-question-card${isSelected ? ' is-selected' : ''}`} key={question.id}>
                <input type="checkbox" checked={isSelected} onChange={() => toggleQuestion(question.id)} />
                <span className="balance-question-card__check" aria-hidden="true">✓</span>
                <span className="balance-question-card__copy">
                  <small>{CATEGORY_LABELS[question.category]}</small>
                  <strong>{question.prompt}</strong>
                  <span>{question.left} <b>VS</b> {question.right}</span>
                </span>
              </label>
            );
          })}
        </div>
      </ScreenLayout>
    );
  }

  if (phase === 'complete') {
    return (
      <ScreenLayout className="balance-game-screen balance-complete">
        <div className="balance-complete__mark" aria-hidden="true">✦</div>
        <p className="eyebrow">오늘의 밸런스 완료</p>
        <h1>{playQuestions.length}개의 선택,<br />서로 다른 이야기</h1>
        <p>같은 답보다 왜 골랐는지를 나눌 때<br />우리 사이가 조금 더 가까워져요.</p>
        <div className="balance-complete__actions">
          <PrimaryButton onClick={showPicker}>다른 질문 골라보기</PrimaryButton>
          <button type="button" onClick={onBackHome}>놀이터 홈으로</button>
        </div>
      </ScreenLayout>
    );
  }

  const question = playQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === playQuestions.length - 1;

  return (
    <ScreenLayout className="balance-game-screen balance-play">
      <button className="test-home-button" type="button" onClick={showPicker}>
        <span aria-hidden="true">←</span> 질문 선택
      </button>

      <header className="balance-play__progress">
        <span>{currentQuestionIndex + 1} / {playQuestions.length}</span>
        <ProgressBar current={currentQuestionIndex + 1} total={playQuestions.length} label="밸런스 게임 진행률" />
      </header>

      <section className="balance-play__question" aria-labelledby="balance-question-title">
        <small>{CATEGORY_LABELS[question.category]}</small>
        <h1 id="balance-question-title">{question.prompt}</h1>
        <p>하나를 고르고, 서로의 이유를 들어보세요.</p>
      </section>

      <div className="balance-choice-list" role="radiogroup" aria-label={question.prompt}>
        <button className={selectedSide === 'left' ? 'is-selected' : undefined} type="button" role="radio" aria-label={question.left} aria-checked={selectedSide === 'left'} onClick={() => setSelectedSide('left')}>
          <small>A</small><strong>{question.left}</strong>
        </button>
        <span aria-hidden="true">VS</span>
        <button className={selectedSide === 'right' ? 'is-selected' : undefined} type="button" role="radio" aria-label={question.right} aria-checked={selectedSide === 'right'} onClick={() => setSelectedSide('right')}>
          <small>B</small><strong>{question.right}</strong>
        </button>
      </div>

      <div className={`balance-talk-prompt${selectedSide ? ' is-visible' : ''}`} aria-live="polite">
        {selectedSide ? '왜 이쪽을 골랐나요? 한 사람씩 이유를 나눠보세요.' : '먼저 각자 마음속으로 하나를 골라보세요.'}
      </div>

      <PrimaryButton
        className="balance-play__next"
        disabled={selectedSide === null}
        onClick={() => {
          if (isLastQuestion) {
            setPhase('complete');
            return;
          }

          setCurrentQuestionIndex((index) => index + 1);
          setSelectedSide(null);
        }}
      >
        {isLastQuestion ? '마무리하기' : '다음 질문'}
      </PrimaryButton>
    </ScreenLayout>
  );
}
