import { useEffect, useMemo, useState } from 'react';

import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressBar } from '../../components/ProgressBar';
import { ScreenLayout } from '../../components/ScreenLayout';
import {
  KNOW_ME_QUESTIONS,
} from './data/questions';
import { getQuizScore } from './domain/scoring';
import type { KnowMeQuestion, QuizAnswers } from './domain/types';
import {
  createKnowMeResultFile,
  shareKnowMeResultFile,
} from './services/resultImage';
import './styles/know-me-quiz.css';

type KnowMeQuizAppProps = { onBackHome: () => void };
type QuizStage = 'setup' | 'answer' | 'handoff' | 'guess' | 'checking' | 'result';

const MIN_QUESTIONS = 5;
const MAX_QUESTIONS = 8;
const CHECK_DELAY_MS = 1600;

function QuizTopBar({
  label,
  current,
  total,
  onBackHome,
}: {
  label: string;
  current: number;
  total: number;
  onBackHome: () => void;
}) {
  return (
    <>
      <div className="know-me-topbar">
        <button className="test-home-button" type="button" onClick={onBackHome}>
          <span aria-hidden="true">←</span> 홈
        </button>
        <span>{label}</span>
      </div>
      <ProgressBar
        label={`${label} 진행률`}
        current={current}
        total={total}
      />
    </>
  );
}

function QuestionOptions({
  question,
  selectedOption,
  onSelect,
}: {
  question: KnowMeQuestion;
  selectedOption: number | undefined;
  onSelect?: (optionIndex: number) => void;
}) {
  return (
    <div className="know-me-options" role="group" aria-label={question.prompt}>
      {question.options.map((option, optionIndex) => {
        const isSelected = selectedOption === optionIndex;

        return (
          <button
            className={isSelected ? 'is-selected' : undefined}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect?.(optionIndex)}
            key={option}
          >
            <span>{optionIndex + 1}</span>
            <strong>{option}</strong>
          </button>
        );
      })}
    </div>
  );
}

export function KnowMeQuizApp({ onBackHome }: KnowMeQuizAppProps) {
  const [stage, setStage] = useState<QuizStage>('setup');
  const [protagonistName, setProtagonistName] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [guesses, setGuesses] = useState<QuizAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const selectedQuestions = useMemo(
    () => selectedQuestionIds
      .map((questionId) => KNOW_ME_QUESTIONS.find((question) => question.id === questionId))
      .filter((question): question is KnowMeQuestion => Boolean(question)),
    [selectedQuestionIds],
  );

  useEffect(() => {
    if (stage !== 'checking') return;
    const timer = window.setTimeout(() => setStage('result'), CHECK_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [stage]);

  const resetQuiz = () => {
    setStage('setup');
    setAnswers({});
    setGuesses({});
    setCurrentIndex(0);
    setShareMessage('');
  };

  if (stage === 'setup') {
    const canStart = protagonistName.trim().length > 0 && selectedQuestionIds.length >= MIN_QUESTIONS;
    const startButtonLabel = !protagonistName.trim()
      ? '이름을 입력해 주세요'
      : selectedQuestionIds.length < MIN_QUESTIONS
        ? `질문 ${MIN_QUESTIONS - selectedQuestionIds.length}개 더 골라 주세요`
        : `${protagonistName.trim()}의 답 정하기`;

    return (
      <ScreenLayout className="know-me-screen know-me-setup">
        <button className="test-home-button" type="button" onClick={onBackHome}>
          <span aria-hidden="true">←</span> 홈
        </button>
        <header className="know-me-hero">
          <p className="eyebrow">온기 · 맞히기 게임</p>
          <h1 aria-label="나를 맞혀봐">나를<br />맞혀봐</h1>
          <p>창작자 · hyunee</p>
        </header>

        <section className="know-me-setup__section" aria-labelledby="protagonist-title">
          <h2 id="protagonist-title">오늘의 주인공</h2>
          <input
            value={protagonistName}
            type="text"
            maxLength={12}
            autoComplete="off"
            placeholder="이름 입력"
            aria-label="오늘의 주인공 이름"
            onChange={(event) => setProtagonistName(event.target.value)}
          />
        </section>

        <section className="know-me-setup__section" aria-labelledby="question-picker-title">
          <div className="know-me-section-heading">
            <h2 id="question-picker-title">질문 고르기</h2>
            <span>{selectedQuestionIds.length}/{MAX_QUESTIONS}</span>
          </div>
          <div className="know-me-question-picker">
            {KNOW_ME_QUESTIONS.map((question) => {
              const isSelected = selectedQuestionIds.includes(question.id);
              return (
                <button
                  className={isSelected ? 'is-selected' : undefined}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedQuestionIds((current) => {
                    if (current.includes(question.id)) {
                      return current.filter((questionId) => questionId !== question.id);
                    }
                    return current.length >= MAX_QUESTIONS ? current : [...current, question.id];
                  })}
                  key={question.id}
                >
                  <span aria-hidden="true">{isSelected ? '✓' : '+'}</span>
                  <strong>{question.prompt}</strong>
                </button>
              );
            })}
          </div>
        </section>

        <PrimaryButton
          className="know-me-start"
          disabled={!canStart}
          onClick={() => {
            setProtagonistName(protagonistName.trim());
            setCurrentIndex(0);
            setStage('answer');
          }}
        >
          {startButtonLabel}
        </PrimaryButton>
      </ScreenLayout>
    );
  }

  if (stage === 'handoff') {
    return (
      <ScreenLayout className="know-me-screen know-me-handoff">
        <button className="test-home-button" type="button" onClick={onBackHome}>
          <span aria-hidden="true">←</span> 홈
        </button>
        <div className="know-me-handoff__lock" aria-hidden="true"><span>✓</span></div>
        <p className="eyebrow">답변 저장 완료</p>
        <h1 aria-label={`${protagonistName}의 답을 숨겼어요`}>{protagonistName}의 답을<br />숨겼어요</h1>
        <PrimaryButton onClick={() => {
          setCurrentIndex(0);
          setStage('guess');
        }}>
          이제 맞혀볼게요
        </PrimaryButton>
      </ScreenLayout>
    );
  }

  if (stage === 'checking') {
    return (
      <ScreenLayout className="know-me-screen know-me-checking">
        <div className="know-me-checking__cards" aria-hidden="true"><i /><i /><i /></div>
        <p className="eyebrow">{protagonistName} 맞히기</p>
        <h1>답을 맞춰보고 있어요</h1>
        <div className="know-me-checking__dots" aria-hidden="true"><i /><i /><i /></div>
        <p className="know-me-sr-only" role="status">모든 답을 비교하고 있어요</p>
      </ScreenLayout>
    );
  }

  if (stage === 'result') {
    const score = getQuizScore(selectedQuestionIds, answers, guesses);
    const shareResult = async () => {
      setIsSharing(true);
      setShareMessage('');
      try {
        const file = await createKnowMeResultFile({
          protagonistName,
          score,
          entries: selectedQuestions.map((question) => ({
            prompt: question.prompt,
            answer: question.options[answers[question.id]],
            guess: question.options[guesses[question.id]],
            matched: answers[question.id] === guesses[question.id],
          })),
        });
        const action = await shareKnowMeResultFile(file);
        setShareMessage(action === 'shared' ? '결과 이미지를 공유했어요.' : action === 'downloaded' ? '결과 이미지를 저장했어요.' : '공유를 취소했어요.');
      } catch {
        setShareMessage('이미지를 만들지 못했어요. 잠시 후 다시 시도해 주세요.');
      } finally {
        setIsSharing(false);
      }
    };

    return (
      <ScreenLayout className="know-me-screen know-me-result">
        <div className="know-me-result__mark" aria-hidden="true">ME</div>
        <p className="eyebrow">{protagonistName} 맞히기 결과</p>
        <h1 aria-label={`${selectedQuestions.length}개 중 ${score}개 정답`}>{selectedQuestions.length}개 중<br /><strong>{score}개</strong> 정답</h1>
        <p>우리는 {protagonistName}를 이만큼 알고 있었어요.</p>

        <div className="know-me-result__answers">
          {selectedQuestions.map((question) => {
            const matched = answers[question.id] === guesses[question.id];
            return (
              <div className={matched ? 'is-correct' : undefined} key={question.id}>
                <span>{matched ? '○' : '×'}</span>
                <section>
                  <small>{question.prompt}</small>
                  <p><i>우리 예상</i>{question.options[guesses[question.id]]}</p>
                  <p><i>{protagonistName}의 답</i><strong>{question.options[answers[question.id]]}</strong></p>
                </section>
              </div>
            );
          })}
        </div>

        <div className="know-me-result__actions">
          <PrimaryButton disabled={isSharing} onClick={shareResult}>
            {isSharing ? '이미지 만드는 중…' : '결과 이미지 공유하기'}
          </PrimaryButton>
          {shareMessage ? <p aria-live="polite">{shareMessage}</p> : null}
          <button type="button" onClick={resetQuiz}>다시 하기</button>
          <button type="button" onClick={onBackHome}>홈으로</button>
        </div>
      </ScreenLayout>
    );
  }

  const activeQuestion = selectedQuestions[currentIndex];

  if (!activeQuestion) {
    return null;
  }

  if (stage === 'answer') {
    const selectedOption = answers[activeQuestion.id];
    const isLastQuestion = currentIndex === selectedQuestions.length - 1;
    return (
      <ScreenLayout className="know-me-screen know-me-play is-answering">
        <QuizTopBar label={`${protagonistName}의 답`} current={currentIndex + 1} total={selectedQuestions.length} onBackHome={onBackHome} />
        <p className="know-me-question-number">Q{currentIndex + 1}</p>
        <h1>{activeQuestion.prompt}</h1>
        <QuestionOptions
          question={activeQuestion}
          selectedOption={selectedOption}
          onSelect={(optionIndex) => setAnswers((current) => ({ ...current, [activeQuestion.id]: optionIndex }))}
        />
        <div className="know-me-play__actions">
          <PrimaryButton
            disabled={selectedOption === undefined}
            onClick={() => {
              if (isLastQuestion) {
                setStage('handoff');
              } else {
                setCurrentIndex((index) => index + 1);
              }
            }}
          >
            {isLastQuestion ? '답 숨기기' : '다음 질문'}
          </PrimaryButton>
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          >이전</button>
        </div>
      </ScreenLayout>
    );
  }

  const selectedGuess = guesses[activeQuestion.id];
  const isLastQuestion = currentIndex === selectedQuestions.length - 1;

  return (
    <ScreenLayout className="know-me-screen know-me-play is-guessing">
      <QuizTopBar label={`${protagonistName} 맞히기`} current={currentIndex + 1} total={selectedQuestions.length} onBackHome={onBackHome} />
      <p className="know-me-question-number">Q{currentIndex + 1}</p>
      <h1>{activeQuestion.prompt}</h1>

      <QuestionOptions
        question={activeQuestion}
        selectedOption={selectedGuess}
        onSelect={(optionIndex) => setGuesses((current) => ({ ...current, [activeQuestion.id]: optionIndex }))}
      />

      <div className="know-me-play__actions">
        <PrimaryButton
          disabled={selectedGuess === undefined}
          onClick={() => {
            if (isLastQuestion) {
              setStage('checking');
            } else {
              setCurrentIndex((index) => index + 1);
            }
          }}
        >
          {isLastQuestion ? '정답 확인하기' : '다음 문제'}
        </PrimaryButton>
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
        >이전</button>
      </div>
    </ScreenLayout>
  );
}
