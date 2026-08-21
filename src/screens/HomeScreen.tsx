import { ACTIVITIES, type ActivityId } from '../data/activities';
import { ScreenLayout } from '../components/ScreenLayout';

type HomeScreenProps = {
  onSelectActivity: (activityId: ActivityId) => void;
};

const ACTIVITY_MARKS: Record<ActivityId, string> = {
  'heart-trace': '',
  'balance-game': 'VS',
  'ideal-world-cup': '🏆',
};

export function HomeScreen({ onSelectActivity }: HomeScreenProps) {
  const featuredActivity = ACTIVITIES.find((activity) => activity.featured);
  const upcomingActivities = ACTIVITIES.filter((activity) => !activity.featured);

  if (!featuredActivity) {
    return null;
  }

  return (
    <ScreenLayout className="home-screen">
      <header className="home-hero">
        <div className="home-brand" aria-label="온기">
          <span className="home-brand__spark" aria-hidden="true"></span>
          <span>온기</span>
        </div>
        <div>
          <p className="home-hero__kicker">ICE BREAKING</p>
          <h1>우리 사이에 온기를</h1>
          <p className="home-hero__description">
            어색함은 조금 덜고,<br />
            서로의 마음은 조금 더 알아가는 시간.<br />
            하나님 안에서 만난 우리 사이에<br />온기를 더해보세요.
          </p>
        </div>
        <ul className="home-categories" aria-label="콘텐츠 종류">
          <li>성격검사</li>
          <li>VS 놀이</li>
          <li>토너먼트</li>
        </ul>
      </header>

      <section className="home-section" aria-labelledby="featured-title">
        <div className="home-section__heading">
          <div>
            <p>지금 바로 해봐요</p>
            <h2 id="featured-title">추천 콘텐츠</h2>
          </div>
          <span aria-hidden="true">01</span>
        </div>

        <button
          className="activity-card activity-card--featured"
          type="button"
          disabled={!featuredActivity.available}
          onClick={() => onSelectActivity(featuredActivity.id)}
        >
          <span className="activity-card__topline">
            <span className="activity-card__kind">{featuredActivity.kind}</span>
            <span className="activity-card__badge">{featuredActivity.badge}</span>
          </span>
          <span className="activity-card__visual" aria-hidden="true">
            <i>{ACTIVITY_MARKS[featuredActivity.id]}</i>
          </span>
          <span className="activity-card__copy">
            <strong>{featuredActivity.title}</strong>
            <span>{featuredActivity.description}</span>
          </span>
          <span className="activity-card__footer">
            <small>{featuredActivity.meta}</small>
            <b>시작하기 <i aria-hidden="true">→</i></b>
          </span>
        </button>
      </section>

      <section className="home-section home-section--upcoming" aria-labelledby="upcoming-title">
        <div className="home-section__heading">
          <div>
            <p>하나씩 채워갈게요</p>
            <h2 id="upcoming-title">다음 놀거리</h2>
          </div>
          <span aria-hidden="true">02</span>
        </div>

        <div className="activity-grid">
          {upcomingActivities.map((activity) => (
            <article className={`activity-card activity-card--${activity.id}`} key={activity.id}>
              <div className="activity-card__topline">
                <span className="activity-card__kind">{activity.kind}</span>
                <span className="activity-card__badge">{activity.badge}</span>
              </div>
              <span className="activity-card__mini-visual" aria-hidden="true">
                {ACTIVITY_MARKS[activity.id]}
              </span>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <small>{activity.meta}</small>
            </article>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <span aria-hidden="true">✦</span>
        <p>아이스브레이킹앱, by hyunee</p>
        <details className="creator-contact">
          <summary>
            <span>창작자에게 연락하기</span>
            <i aria-hidden="true">▾</i>
          </summary>
          <div className="creator-contact__links">
            <a href="mailto:cmpsr123@naver.com">
              <span className="creator-contact__icon" aria-hidden="true">@</span>
              <span>
                <strong>이메일</strong>
                <small>cmpsr123@naver.com</small>
              </span>
            </a>
            <a
              href="https://open.kakao.com/me/BeomhyunPark"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="creator-contact__icon creator-contact__icon--kakao" aria-hidden="true">K</span>
              <span>
                <strong>카카오톡 오픈채팅</strong>
                <small>메시지 보내기</small>
              </span>
            </a>
            <a
              href="https://github.com/BeomhyunPark"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="creator-contact__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.69a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
                </svg>
              </span>
              <span>
                <strong>GitHub</strong>
                <small>BeomhyunPark</small>
              </span>
            </a>
          </div>
        </details>
      </footer>
    </ScreenLayout>
  );
}
