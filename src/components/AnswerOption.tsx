import type { ReactNode } from 'react';

type AnswerOptionProps = {
  name: string;
  value: string;
  marker?: ReactNode;
  text: string;
  selected: boolean;
  onSelect: () => void;
};

export function AnswerOption({
  name,
  value,
  marker,
  text,
  selected,
  onSelect,
}: AnswerOptionProps) {
  return (
    <label className={`answer-option${selected ? ' answer-option--selected' : ''}`}>
      <input
        className="answer-option__input"
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
      />
      {marker ? (
        <span className="answer-option__marker" aria-hidden="true">{marker}</span>
      ) : null}
      <span className="answer-option__text">{text}</span>
      <span className="answer-option__check" aria-hidden="true">✓</span>
    </label>
  );
}
