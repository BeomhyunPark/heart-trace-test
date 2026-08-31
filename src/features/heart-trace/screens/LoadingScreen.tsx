import { type CSSProperties, useEffect, useState } from 'react';

import { ProgressBar } from '../../../components/ProgressBar';
import { ScreenLayout } from '../../../components/ScreenLayout';
import { assetUrl } from '../../../utils/assetUrl';
import { LOADING_SEQUENCE_DURATION_MS } from '../state/timing';

const HATCH_STAGE_THRESHOLDS = [0, 25.74, 47.19, 64.35, 78.078, 88.374, 95.667, 100] as const;
const HATCH_IMAGES = Array.from(
  { length: 8 },
  (_, index) => assetUrl(`images/motion/hatching/orb-${String(index + 1).padStart(2, '0')}.png`),
);
const SOUL_ORB_TIMING_STYLE = {
  '--loading-sequence-duration': `${LOADING_SEQUENCE_DURATION_MS}ms`,
} as CSSProperties;

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

  useEffect(() => {
    const startedAt = Date.now();
    let frameId = 0;

    const updateProgress = () => {
      const nextProgress = Math.min(
        100,
        ((Date.now() - startedAt) / LOADING_SEQUENCE_DURATION_MS) * 100,
      );

      setProgress(nextProgress);

      if (nextProgress < 100) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    frameId = window.requestAnimationFrame(updateProgress);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <ScreenLayout className="loading-screen">
      <header className="loading-screen__header">
        <p className="eyebrow">20개의 대답을 모두 모았어요</p>
        <h1>가장 선명한 흔적을<br />찾고 있어요</h1>
      </header>

      <div
        className="soul-orb"
        style={SOUL_ORB_TIMING_STYLE}
        aria-hidden="true"
        data-stage={hatchStage}
      >
        <img className="soul-orb__character" src={assetUrl('images/loading/soul-character.svg')} alt="" />
        <img className="soul-orb__ring" src={assetUrl('images/loading/ring-inner.svg')} alt="" />
        <img className="soul-orb__highlight" src={assetUrl('images/loading/orb-highlight.svg')} alt="" />
        <div className="soul-orb__hatch">
          <div className="soul-orb__halo" />
          <div className="soul-orb__core">
            {HATCH_IMAGES.map((src, index) => (
              <img
                key={src}
                className={`soul-orb__stage soul-orb__stage--${index + 1}`}
                src={src}
                alt=""
              />
            ))}
          </div>
        </div>
      </div>

      <div className="loading-screen__copy">
        <p>잠시만 기다려주세요.<br />마음에 남은 흔적들이 빛을 따라 모이고 있어요.</p>
      </div>

      <ProgressBar current={progress} total={100} label="결과 분석 진행률" />

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
