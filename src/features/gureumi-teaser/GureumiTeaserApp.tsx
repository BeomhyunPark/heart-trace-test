import type { ActivityId } from '../../app/activityCatalog';
import { ScreenLayout } from '../../components/ScreenLayout';
import { assetUrl } from '../../utils/assetUrl';
import './styles/gureumi-teaser.css';

type GureumiTeaserAppProps = {
  onBackHome: () => void;
  onSelectActivity?: (activityId: ActivityId) => void;
};

const GUREUMI_CHARACTERS = [
  { id: 'electric', name: '찌릿이' },
  { id: 'dalmong', name: '달몽이' },
  { id: 'arong', name: '아롱이' },
  { id: 'sunny', name: '쨍이' },
  { id: 'mongsil', name: '몽실이' },
  { id: 'chokchok', name: '촉촉이' },
  { id: 'hoowoo', name: '후우' },
  { id: 'pogeun', name: '포근이' },
] as const;

export function GureumiTeaserApp({
  onBackHome,
  onSelectActivity,
}: GureumiTeaserAppProps) {
  return (
    <ScreenLayout className="gureumi-teaser-screen">
      <nav className="gureumi-teaser-toolbar" aria-label="티저 화면 탐색">
        <button type="button" onClick={onBackHome}>
          <span aria-hidden="true">←</span>
          홈
        </button>
        <span>구르미 테스트 미리보기</span>
      </nav>

      <article className="gureumi-teaser-panel" aria-labelledby="gureumi-teaser-title">
        <p className="gureumi-teaser-kicker">ONGI · SECOND TEST</p>
        <h1 id="gureumi-teaser-title">
          <span>두 번째 테스트,</span>
          <span>흔적을 이을 캐릭터는?</span>
        </h1>
        <p className="gureumi-teaser-intro">
          서로 다른 빛과 표정을 지닌 여덟 친구가<br />
          곧 새로운 이야기로 찾아와요.
        </p>

        <section
          className="gureumi-mystery-stage"
          aria-label="공개를 기다리는 구르미 캐릭터 여덟 친구"
        >
          <p>두 번째 테스트 · 곧 공개</p>
          <span className="gureumi-mystery-stage__glow" aria-hidden="true" />
          {GUREUMI_CHARACTERS.map(({ id, name }) => (
            <img
              className={`gureumi-mystery-character gureumi-mystery-character--${id}`}
              src={assetUrl(`images/teasers/gureumi-test/${id}.png`)}
              alt=""
              aria-hidden="true"
              decoding="async"
              draggable="false"
              title={name}
              key={id}
            />
          ))}
        </section>

        <section className="gureumi-update-card" aria-labelledby="gureumi-update-title">
          <h2 id="gureumi-update-title">두 번째 테스트에서</h2>
          <ul>
            <li>여덟 캐릭터의 서로 다른 유형</li>
            <li>관계 속에서 드러나는 새로운 모습</li>
          </ul>
        </section>

        <p className="gureumi-teaser-waiting">기다리는 동안, 첫 번째 테스트 하기</p>
        <button
          className="gureumi-teaser-cta"
          type="button"
          onClick={() => onSelectActivity?.('heart-trace')}
        >
          마음의 흔적 테스트 하러 가기
        </button>
        <p className="gureumi-teaser-footer">두 번째 테스트는 곧 공개됩니다.</p>
      </article>
    </ScreenLayout>
  );
}
