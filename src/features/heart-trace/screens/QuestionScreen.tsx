import { AnswerOption } from '../../../components/AnswerOption';
import { ProgressBar } from '../../../components/ProgressBar';
import { ScreenLayout } from '../../../components/ScreenLayout';
import { TEST_QUESTION_COUNT, type ChoiceId, type Question } from '../domain/types';

type QuestionScreenProps = {
  question: Question;
  questionIndex: number;
  selectedOptionId: ChoiceId | null;
  isSkipped: boolean;
  skippedCount: number;
  maxSkippedCount: number;
  onAnswer: (optionId: ChoiceId) => void;
  onSkip: () => void;
  onPrevious: () => void;
};

export function QuestionScreen({
  question,
  questionIndex,
  selectedOptionId,
  isSkipped,
  skippedCount,
  maxSkippedCount,
  onAnswer,
  onSkip,
  onPrevious,
}: QuestionScreenProps) {
  const questionNumber = questionIndex + 1;
  const skipLimitReached = skippedCount >= maxSkippedCount && !isSkipped;
  const promptDensity = question.text.length <= 28
    ? 'standard'
    : question.text.length <= 48
      ? 'compact'
      : 'dense';

  return (
    <ScreenLayout className="question-screen">
      <header className="question-progress">
        <div className="question-progress__label">
          <span>마음의 흔적 찾는 중</span>
          <span aria-live="polite">{questionNumber} / {TEST_QUESTION_COUNT}</span>
        </div>
        <ProgressBar current={questionNumber} total={TEST_QUESTION_COUNT} />
      </header>

      <fieldset className="question-fieldset">
        <legend className={`question-prompt question-prompt--${promptDensity}`}>
          <span className="question-number">Q{questionNumber}</span>
          <span className="question-title">{question.text}</span>
        </legend>

        <p className="question-helper">선택하면 자동 저장되고 다음 문항으로 넘어가요</p>

        <div className="answer-list" role="radiogroup" aria-label={`${questionNumber}번 문항 선택지`}>
          {question.options.map((option) => (
            <AnswerOption
              key={option.id}
              name={`question-${question.id}`}
              value={option.id}
              marker={option.id}
              text={option.text}
              selected={selectedOptionId === option.id}
              onSelect={() => onAnswer(option.id)}
            />
          ))}
        </div>
      </fieldset>

      <section className="question-skip" aria-label="문항 건너뛰기">
        <p className="question-skip__count">
          건너뛰기 {skippedCount} / {maxSkippedCount}
        </p>
        <button
          className={`question-skip__button${isSkipped ? ' question-skip__button--active' : ''}`}
          type="button"
          aria-pressed={isSkipped}
          disabled={skipLimitReached}
          onClick={onSkip}
        >
          {isSkipped
            ? '건너뛴 문항이에요 · 다음으로'
            : '딱 맞는 답이 없어요 · 건너뛰기'}
        </button>
        {skipLimitReached ? (
          <p className="question-skip__notice" role="status">
            정확한 결과를 위해 이번 문항은{' '}<br />가장 가까운 답을 선택해 주세요.
          </p>
        ) : (
          <p className="question-skip__helper">
            가장 가까운 답도 없다면 건너뛸 수 있어요.
          </p>
        )}
      </section>

      {questionIndex > 0 ? (
        <button className="previous-button" type="button" onClick={onPrevious}>
          이전
        </button>
      ) : null}
    </ScreenLayout>
  );
}
