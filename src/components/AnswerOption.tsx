import type { ReactNode } from 'react';

type AnswerOptionProps = {
  marker?: ReactNode;
  text: string;
  selected: boolean;
  onSelect: () => void;
};

export function AnswerOption({ marker, text, selected, onSelect }: AnswerOptionProps) {
  return (
    <button
      className={`answer-option${selected ? ' answer-option--selected' : ''}`}
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
    >
      {marker ? <span className="answer-option__marker">{marker}</span> : null}
      <span className="answer-option__text">{text}</span>
      <span className="answer-option__check" aria-hidden="true">✓</span>
    </button>
  );
}
