type ProgressBarProps = {
  current: number;
  total: number;
  label?: string;
};

export function ProgressBar({ current, total, label = '검사 진행률' }: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, (current / total) * 100));
  const accessibleCurrent = Math.round(current);

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={accessibleCurrent}
    >
      <span className="progress-bar__value" style={{ width: `${percent}%` }} />
    </div>
  );
}
