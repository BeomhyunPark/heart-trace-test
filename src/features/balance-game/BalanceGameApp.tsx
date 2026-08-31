import { ScreenLayout } from '../../components/ScreenLayout';

type BalanceGameAppProps = {
  onBackHome: () => void;
};

/**
 * 밸런스 게임의 기능 진입점입니다.
 * 실제 라운드 데이터와 진행 규칙이 확정되기 전까지 registry에는 등록하지 않습니다.
 */
export function BalanceGameApp({ onBackHome }: BalanceGameAppProps) {
  return (
    <ScreenLayout className="balance-game-screen">
      <button className="test-home-button" type="button" onClick={onBackHome}>
        <span aria-hidden="true">←</span> 홈
      </button>
      <header>
        <p className="eyebrow">온기 · VS 놀이</p>
        <h1>극과 극 밸런스 게임</h1>
        <p>게임 규칙과 질문을 준비하고 있어요.</p>
      </header>
    </ScreenLayout>
  );
}
