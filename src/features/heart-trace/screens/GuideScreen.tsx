import { PrimaryButton } from '../../../components/PrimaryButton';
import { ScreenLayout } from '../../../components/ScreenLayout';

type GuideScreenProps = {
  onStart: () => void;
  onBackHome: () => void;
};

const GUIDE_ITEMS = [
  {
    title: '가볍게 골라요',
    body: <>정답은 없어요. 지금 내 마음과 가까운 쪽을 골라주세요.</>,
  },
  {
    title: '결과를 나눠요',
    body: <>결과 이미지를 저장해 친구들과 나눌 수 있어요.</>,
  },
  {
    title: '서버에 저장되지 않아요',
    body: <>완료한 결과는 서버에 남지 않아요.</>,
  },
] as const;

export function GuideScreen({ onStart, onBackHome }: GuideScreenProps) {
  return (
    <ScreenLayout className="guide-screen">
      <button className="test-home-button" type="button" onClick={onBackHome}>
        <span aria-hidden="true">←</span> 홈
      </button>
      <header className="guide-screen__header">
        <h1>시작하기 전에</h1>
      </header>

      <ol className="guide-list">
        {GUIDE_ITEMS.map((item) => (
          <li className="guide-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </li>
        ))}
      </ol>

      <PrimaryButton className="guide-screen__button" onClick={onStart}>알겠어요</PrimaryButton>
    </ScreenLayout>
  );
}
