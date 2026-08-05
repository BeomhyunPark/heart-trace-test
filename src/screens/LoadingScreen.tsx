import { ProgressBar } from '../components/ProgressBar';
import { ScreenLayout } from '../components/ScreenLayout';

export function LoadingScreen() {
  return (
    <ScreenLayout className="loading-screen" footer={<p className="loading-screen__footer">곧 당신의 캐릭터가 나타나요</p>}>
      <header className="loading-screen__header">
        <p className="eyebrow">20개의 대답을 모두 모았어요</p>
      </header>

      <div className="soul-orb" aria-hidden="true">
        <img className="soul-orb__rays" src="/images/loading/rays.svg" alt="" />
        <img className="soul-orb__halo" src="/images/loading/halo.svg" alt="" />
        <img className="soul-orb__shockwave" src="/images/loading/shockwave.svg" alt="" />
        <img className="soul-orb__image" src="/images/loading/soul-orb.png" alt="" />
        <img className="soul-orb__ring" src="/images/loading/ring-inner.svg" alt="" />
        <img className="soul-orb__character" src="/images/loading/soul-character.svg" alt="" />
        <img className="soul-orb__highlight" src="/images/loading/orb-highlight.svg" alt="" />
      </div>

      <div className="loading-screen__copy">
        <h1>가장 선명한 흔적을 찾고 있어요</h1>
        <p>잠시만 기다려주세요.<br />마음에 남은 흔적들이 빛을 따라 모이고 있어요.</p>
      </div>

      <section className="loading-status" aria-live="polite" aria-label="결과 분석 중">
        <h2>흔적을 살펴보고 있어요</h2>
        <ProgressBar current={3} total={4} />
        <ul>
          <li>✓ 마음의 대답을 모았어요</li>
          <li>✓ 흔적의 결을 비교했어요</li>
          <li className="loading-status__active">··· 가장 선명한 흔적을 찾는 중</li>
        </ul>
      </section>
    </ScreenLayout>
  );
}
