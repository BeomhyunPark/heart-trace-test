import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenLayout } from '../components/ScreenLayout';

type GuideScreenProps = {
  onStart: () => void;
};

const GUIDE_ITEMS = [
  {
    icon: '☺',
    title: '부담가지지 말아요',
    body: <>이 테스트는 수련회를 더욱 즐겁게 시작하기 위한<br />아이스브레이킹 콘텐츠입니다! 😊</>,
  },
  {
    icon: '◌',
    title: '가볍게 골라요',
    body: <>정답은 없어요.<br />지금 내 마음과 더 가까운 쪽을 눌러주세요.</>,
  },
  {
    icon: '✦',
    title: '도착하면 나눠요',
    body: <>결과 이미지를 저장하고<br />다양한 흔적의 사람을 찾아보세요.<br />오늘의 흔적 미션도 함께 도전해 보면<br />더 재밌을 거예요!</>,
  },
  {
    icon: '♙',
    title: '저장되지 않아요',
    body: <>나의 흔적은 나만 보관해요.</>,
  },
] as const;

export function GuideScreen({ onStart }: GuideScreenProps) {
  return (
    <ScreenLayout className="guide-screen" footer={<PrimaryButton onClick={onStart}>검사 시작하기</PrimaryButton>}>
      <header className="guide-screen__header">
        <p className="eyebrow">검사 전에 잠깐</p>
        <h1>마음의 흔적을 찾는 방법</h1>
      </header>

      <ol className="guide-list">
        {GUIDE_ITEMS.map((item) => (
          <li className="guide-card" key={item.title}>
            <span className="guide-card__icon" aria-hidden="true">{item.icon}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </ScreenLayout>
  );
}
