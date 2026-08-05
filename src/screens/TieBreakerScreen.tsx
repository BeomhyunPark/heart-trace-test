import { AnswerOption } from '../components/AnswerOption';
import { ScreenLayout } from '../components/ScreenLayout';
import type { TieBreakerQuestion } from '../domain/tieBreaker';
import type { ResultTypeId } from '../domain/types';

type TieBreakerScreenProps = {
  question: TieBreakerQuestion;
  onSelect: (answer: ResultTypeId) => void;
  onPrevious: () => void;
};

export function TieBreakerScreen({ question, onSelect, onPrevious }: TieBreakerScreenProps) {
  return (
    <ScreenLayout className="tie-screen">
      <header className="tie-screen__header">
        <p className="eyebrow">흔적이 두 개 이상 선명해요</p>
        <h1>{question.prompt}</h1>
        <p>아래에는 동점인 유형만 표시돼요.</p>
      </header>

      <div className="answer-list tie-screen__options" role="radiogroup" aria-label="추가 질문 선택지">
        {question.options.map((option) => (
          <AnswerOption
            key={option.id}
            name="tie-breaker"
            value={option.id}
            text={option.label}
            selected={false}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>

      <button className="previous-button" type="button" onClick={onPrevious}>
        <span aria-hidden="true">‹</span> 이전
      </button>
    </ScreenLayout>
  );
}
