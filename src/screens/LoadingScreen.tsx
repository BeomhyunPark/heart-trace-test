import { useEffect, useMemo, useState } from 'react';

import { LOADING_SEQUENCE_DURATION_MS } from '../app/timing';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenLayout } from '../components/ScreenLayout';
import { assetUrl } from '../utils/assetUrl';

const HATCH_STAGE_THRESHOLDS = [0, 20, 38, 53, 66, 77, 86, 94] as const;

const ANALYSIS_STEPS = [
  { threshold: 0, label: '마음의 대답을 모으고 있어요' },
  { threshold: 34, label: '흔적의 결을 비교하고 있어요' },
  { threshold: 70, label: '가장 선명한 흔적을 찾고 있어요' },
  { threshold: 100, label: '당신의 흔적을 찾았어요' },
] as const;

function getActiveStep(progress: number) {
  let activeStep = 0;

  ANALYSIS_STEPS.forEach(({ threshold }, index) => {
    if (progress >= threshold) {
      activeStep = index;
    }
  });

  return activeStep;
}

function getHatchStage(progress: number) {
  let stage = 1;

  HATCH_STAGE_THRESHOLDS.forEach((threshold, index) => {
    if (progress >= threshold) {
      stage = index + 1;
    }
  });

  return stage;
}

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const activeStep = getActiveStep(progress);
  const hatchStage = getHatchStage(progress);
  const hatchImages = useMemo(() => Array.from(
    { length: 8 },
    (_, index) => assetUrl(`images/motion/hatching/orb-${String(index + 1).padStart(2, '0')}.png`),
  ), []);

  useEffect(() => {
    const tickMs = 80;
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setProgress(Math.min(
        100,
        ((Date.now() - startedAt) / LOADING_SEQUENCE_DURATION_MS) * 100,
      ));
    }, tickMs);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <ScreenLayout className="loading-screen">
      <header className="loading-screen__header">
        <p className="eyebrow">20개의 대답을 모두 모았어요</p>
        <h1>가장 선명한 흔적을<br />찾고 있어요</h1>
      </header>

      <div className="soul-orb" aria-hidden="true" data-stage={hatchStage}>
        <img className="soul-orb__rays" src={assetUrl('images/loading/rays.svg')} alt="" />
        <img className="soul-orb__halo" src={assetUrl('images/loading/halo.svg')} alt="" />
        <img className="soul-orb__shockwave" src={assetUrl('images/loading/shockwave.svg')} alt="" />
        <div className="soul-orb__hatch">
          {hatchImages.map((src, index) => (
            <img
              key={src}
              className={`soul-orb__stage${hatchStage === index + 1 ? ' soul-orb__stage--active' : ''}`}
              src={src}
              alt=""
            />
          ))}
        </div>
        <img className="soul-orb__ring" src={assetUrl('images/loading/ring-inner.svg')} alt="" />
        <img className="soul-orb__character" src={assetUrl('images/loading/soul-character.svg')} alt="" />
        <img className="soul-orb__highlight" src={assetUrl('images/loading/orb-highlight.svg')} alt="" />
      </div>

      <div className="loading-screen__copy">
        <p>잠시만 기다려주세요.<br />마음에 남은 흔적들이 빛을 따라 모이고 있어요.</p>
      </div>

      <ProgressBar current={Math.round(progress)} total={100} label="결과 분석 진행률" />

      <section className="loading-status" aria-live="polite" aria-atomic="true">
        <h2>{ANALYSIS_STEPS[activeStep].label}</h2>
        <ul aria-label="결과 분석 단계">
          {ANALYSIS_STEPS.slice(0, 3).map((step, index) => {
            const state = index < activeStep ? 'done' : index === activeStep ? 'active' : 'pending';

            return (
              <li key={step.label} className={`loading-status__item loading-status__item--${state}`}>
                <span aria-hidden="true">{state === 'done' ? '✓' : state === 'active' ? '●' : '○'}</span>
                {step.label}
              </li>
            );
          })}
        </ul>
      </section>

      <p className="loading-screen__footer">곧 당신의 캐릭터가 나타나요</p>
    </ScreenLayout>
  );
}
