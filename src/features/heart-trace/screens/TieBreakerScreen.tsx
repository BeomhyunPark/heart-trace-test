import { AnswerOption } from '../../../components/AnswerOption';
import { ProgressBar } from '../../../components/ProgressBar';
import { ScreenLayout } from '../../../components/ScreenLayout';
import type { TieBreakerQuestion } from '../domain/tieBreaker';
import { ANSWER_OPTION_IDS, type ResultTypeId } from '../domain/types';

type TieBreakerScreenProps = {
  question: TieBreakerQuestion;
  questionNumber: number;
  onSelect: (answer: ResultTypeId) => void;
  onPrevious: () => void;
  onBackHome: () => void;
};

export function TieBreakerScreen({
  question,
  questionNumber,
  onSelect,
  onPrevious,
  onBackHome,
}: TieBreakerScreenProps) {
  return (
    <ScreenLayout className="tie-screen">
      <button className="test-home-button" type="button" onClick={onBackHome}>
        <span aria-hidden="true">←</span> 홈
      </button>

      <header className="question-progress">
        <div className="question-progress__label">
          <span>마음의 흔적 찾는 중</span>
          <span>{questionNumber} / {questionNumber}</span>
        </div>
        <ProgressBar current={questionNumber} total={questionNumber} />
      </header>

      <fieldset className="question-fieldset">
        <legend className="question-prompt">
          <span className="question-number">Q{questionNumber} · 마지막 질문</span>
          <span className="question-title">{question.prompt}</span>
        </legend>

        <div className="answer-list" role="radiogroup" aria-label="마지막 문항 선택지">
          {question.options.map((option, optionIndex) => (
            <AnswerOption
              key={option.id}
              name="tie-breaker"
              value={option.id}
              marker={ANSWER_OPTION_IDS[optionIndex]}
              text={option.label}
              selected={false}
              onSelect={() => onSelect(option.id)}
            />
          ))}
        </div>
      </fieldset>

      <nav className="question-actions" aria-label="문항 이동">
        <button className="previous-button" type="button" onClick={onPrevious}>
          이전
        </button>
        <span className="question-actions__placeholder" aria-hidden="true" />
      </nav>
    </ScreenLayout>
  );
}
