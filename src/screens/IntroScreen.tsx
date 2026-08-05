import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenLayout } from '../components/ScreenLayout';
import { StartSoulOrb } from '../components/StartSoulOrb';

type IntroScreenProps = {
  onContinue: () => void;
};

export function IntroScreen({ onContinue }: IntroScreenProps) {
  return (
    <ScreenLayout className="intro-screen">
      <header className="intro-screen__header">
        <p className="eyebrow">2026 여름수련회 · STIGMA</p>
        <h1>내가<br />흔적을 대하는 자세는?</h1>
      </header>

      <div className="intro-screen__message">
        흔적이들은 우리 마음속에 사는 작은 존재에요.<br />
        질문에 솔직하게 답하면,<br />
        내 안에 사는 흔적이가 모습을 드러낼 거에요.
      </div>

      <div className="intro-screen__visual" aria-hidden="true">
        <StartSoulOrb />
      </div>

      <PrimaryButton className="intro-screen__button" onClick={onContinue}>테스트 시작하기</PrimaryButton>
      <p className="intro-screen__meta">약 4분 · 20문항 · 5유형</p>
    </ScreenLayout>
  );
}
