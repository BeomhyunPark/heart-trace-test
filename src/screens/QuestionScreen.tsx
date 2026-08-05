import { AnswerOption } from '../components/AnswerOption';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenLayout } from '../components/ScreenLayout';
import { TEST_QUESTION_COUNT, type Question, type ResultTypeId } from '../domain/types';

type QuestionScreenProps = {
  question: Question;
  questionIndex: number;
  selectedAnswer: ResultTypeId | null;
  onAnswer: (answer: ResultTypeId) => void;
  onPrevious: () => void;
};

export function QuestionScreen({
  question,
  questionIndex,
  selectedAnswer,
  onAnswer,
  onPrevious,
}: QuestionScreenProps) {
  const questionNumber = questionIndex + 1;

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
        <legend>
          <span className="question-number">Q{questionNumber}</span>
          <span className="question-title">{question.text}</span>
        </legend>

        <p className="question-helper">선택하면 자동 저장되고 다음 문항으로 넘어가요</p>

        <div className="answer-list" role="radiogroup" aria-label={`${questionNumber}번 문항 선택지`}>
          {question.options.map((option) => (
            <AnswerOption
              key={option.id}
              marker={option.id}
              text={option.text}
              selected={selectedAnswer === option.resultType}
              onSelect={() => onAnswer(option.resultType)}
            />
          ))}
        </div>
      </fieldset>

      {questionIndex > 0 ? (
        <button className="previous-button" type="button" onClick={onPrevious}>
          <span aria-hidden="true">‹</span> 이전
        </button>
      ) : null}
    </ScreenLayout>
  );
}
