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

      <header className="tie-screen__header">
        <span className="question-number">마지막 질문</span>
        <h1>{question.prompt}</h1>
      </header>

      <div className="answer-list tie-screen__options" role="radiogroup" aria-label="추가 질문 선택지">
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

      <button className="previous-button" type="button" onClick={onPrevious}>
        이전
      </button>
    </ScreenLayout>
  );
}
