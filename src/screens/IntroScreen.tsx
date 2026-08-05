import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenLayout } from '../components/ScreenLayout';

type IntroScreenProps = {
  onContinue: () => void;
};

export function IntroScreen({ onContinue }: IntroScreenProps) {
  return (
    <ScreenLayout className="intro-screen" footer={<PrimaryButton onClick={onContinue}>테스트 시작하기</PrimaryButton>}>
      <header className="intro-screen__header">
        <p className="eyebrow">2026 여름수련회 · STIGMA</p>
        <h1>마음속 흔적 찾기</h1>
        <p className="intro-screen__subtitle">나와 닮은 흔적이는 누구일까?</p>
      </header>

      <div className="intro-screen__visual" aria-hidden="true">
        <span className="intro-screen__glow" />
        <img src="/images/characters/start-orb.png" alt="" />
      </div>

      <p className="intro-screen__message">
        흔적이들은 우리 마음속에 사는 작은 존재예요.<br />
        질문에 솔직하게 답하면,<br />
        내 안에 사는 흔적이가 모습을 드러낼 거예요.
      </p>

      <p className="intro-screen__meta">약 4분 · 20문항 · 5유형</p>
    </ScreenLayout>
  );
}
