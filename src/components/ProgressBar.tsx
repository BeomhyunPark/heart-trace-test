type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, (current / total) * 100));

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-label="검사 진행률"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
    >
      <span className="progress-bar__value" style={{ width: `${percent}%` }} />
    </div>
  );
}
