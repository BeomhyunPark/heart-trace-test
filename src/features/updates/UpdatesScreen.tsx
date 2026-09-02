import { BrandMark } from '../../components/BrandMark';
import { ScreenLayout } from '../../components/ScreenLayout';
import { RELEASES } from './releaseHistory';

type UpdatesScreenProps = {
  onBackHome: () => void;
};

export function UpdatesScreen({ onBackHome }: UpdatesScreenProps) {
  return (
    <ScreenLayout className="updates-screen">
      <header className="updates-header">
        <button className="updates-back" type="button" onClick={onBackHome}>
          <span aria-hidden="true">←</span> 홈
        </button>
        <div className="updates-brand" aria-label="온기">
          <BrandMark />
          <span>ONGI HISTORY</span>
        </div>
        <p className="updates-eyebrow">우리 사이에 쌓인 기록</p>
        <h1>업데이트 내역</h1>
        <p className="updates-intro">
          하나의 흔적테스트에서 시작해<br />함께 사용하는 온기가 되기까지.
        </p>
      </header>
      <ol className="release-timeline" aria-label="온기 버전별 업데이트">
        {RELEASES.map((release) => (
          <li className={`release-entry${release.current ? ' release-entry--current' : ''}`} key={release.version}>
            <article aria-labelledby={`release-${release.version}`}>
              <div className="release-entry__meta">
                <span className="release-entry__version">{release.version}</span>
                {release.current ? <span className="release-entry__badge">CURRENT</span> : null}
                {release.reconstructed ? <span className="release-entry__badge release-entry__badge--archive">ARCHIVE</span> : null}
                <time dateTime={release.date.replaceAll('.', '-')}>{release.date}</time>
              </div>
              <h2 id={`release-${release.version}`}>{release.title}</h2>
              <p className="release-entry__summary">{release.summary}</p>
              <ul className="release-entry__changes">
                {release.changes.map((change) => (
                  <li key={change.title}>
                    <strong>{change.title}</strong>
                    <p>{change.description}</p>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>

      <footer className="updates-footer">
        <span aria-hidden="true">✦</span>
        <p>다음 기록도 우리 사이에 따뜻하게 쌓아갈게요.</p>
        <button type="button" onClick={onBackHome}>온기로 돌아가기</button>
      </footer>
    </ScreenLayout>
  );
}
