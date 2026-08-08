import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenLayout } from '../components/ScreenLayout';

type GuideScreenProps = {
  onStart: () => void;
};

const GUIDE_ITEMS = [
  {
    title: '부담가지지 말아요',
    body: <>이 테스트는 수련회를 더욱 즐겁게 시작하기 위한<br />아이스브레이킹 콘텐츠입니다! 😊</>,
  },
  {
    title: '가볍게 골라요',
    body: <>정답은 없어요.<br />지금 내 마음과 더 가까운 쪽을 골라주세요.</>,
  },
  {
    title: '조원들과 나눠요',
    body: <>결과 이미지를 저장하고<br />조원들과 대화해보세요.</>,
  },
  {
    title: '저장되지 않아요',
    body: <>나의 흔적은 나만 보관해요.</>,
  },
] as const;

export function GuideScreen({ onStart }: GuideScreenProps) {
  return (
    <ScreenLayout className="guide-screen">
      <header className="guide-screen__header">
        <p className="eyebrow">주의사항</p>
        <h1>시작하기 전에 잠깐</h1>
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
