import { useEffect, useState } from 'react';

import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressBar } from '../../components/ProgressBar';
import { ScreenLayout } from '../../components/ScreenLayout';
import { FOOD_CANDIDATE_BY_ID, FOOD_CANDIDATES } from './data/foods';
import {
  chooseWinner,
  createTournament,
  getCurrentMatch,
  getRoundLabel,
  getTotalMatchCount,
  startNextRound,
} from './domain/tournament';
import type {
  FoodCandidate,
  TournamentSize,
  WorldCupSession,
} from './domain/types';
import {
  clearWorldCupSession,
  loadWorldCupSession,
  saveWorldCupSession,
} from './services/sessionStorage';
import './styles/ideal-world-cup.css';

type IdealWorldCupAppProps = {
  onBackHome: () => void;
};

const CANDIDATE_IDS = FOOD_CANDIDATES.map((candidate) => candidate.id);
const VALID_CANDIDATE_IDS = new Set(CANDIDATE_IDS);
const SIZE_OPTIONS: readonly TournamentSize[] = [64, 32, 16];

const SIZE_COPY: Record<TournamentSize, string> = {
  64: '총 63번의 선택',
  32: '총 31번의 선택',
  16: '총 15번의 선택',
};

function findCandidate(candidateId: string): FoodCandidate {
  const candidate = FOOD_CANDIDATE_BY_ID.get(candidateId);

  if (!candidate) {
    throw new Error(`음식 후보를 찾을 수 없습니다: ${candidateId}`);
  }

  return candidate;
}

function createSession(tournamentSize: TournamentSize): WorldCupSession {
  return {
    version: 1,
    current: createTournament(CANDIDATE_IDS, tournamentSize),
    previous: null,
  };
}

export function IdealWorldCupApp({ onBackHome }: IdealWorldCupAppProps) {
  const [selectedSize, setSelectedSize] = useState<TournamentSize>(64);
  const [savedSession, setSavedSession] = useState<WorldCupSession | null>(
    () => loadWorldCupSession(VALID_CANDIDATE_IDS),
  );
  const [activeSession, setActiveSession] = useState<WorldCupSession | null>(null);

  useEffect(() => {
    if (activeSession) {
      saveWorldCupSession(activeSession);
    }
  }, [activeSession]);

  const startNewTournament = (tournamentSize: TournamentSize) => {
    clearWorldCupSession();
    setSavedSession(null);
    setActiveSession(createSession(tournamentSize));
  };

  const resetToSetup = () => {
    clearWorldCupSession();
    setSavedSession(null);
    setActiveSession(null);
  };

  const undoLastChoice = () => {
    setActiveSession((session) => {
      if (!session?.previous) {
        return session;
      }

      return {
        version: 1,
        current: session.previous,
        previous: null,
      };
    });
  };

  if (!activeSession) {
    const savedState = savedSession?.current;

    return (
      <ScreenLayout className="world-cup-screen world-cup-setup">
        <button className="test-home-button" type="button" onClick={onBackHome}>
          <span aria-hidden="true">←</span> 홈
        </button>

        <header className="world-cup-hero">
          <p className="eyebrow">온기 · 토너먼트</p>
          <h1 aria-label="음식 최애 월드컵">음식 최애<br />월드컵</h1>
          <p>오늘 가장 끌리는 음식 하나를 남겨보세요.</p>
        </header>

        {savedState ? (
          <section className="world-cup-resume" aria-labelledby="resume-title">
            <span>진행 중인 대진</span>
            <h2 id="resume-title">
              {savedState.tournamentSize}강 · {getRoundLabel(savedState.roundCandidateIds.length)}
            </h2>
            <p>{savedState.history.length}개의 선택이 저장되어 있어요.</p>
            <div>
              <PrimaryButton onClick={() => setActiveSession(savedSession)}>이어하기</PrimaryButton>
              <button type="button" onClick={() => {
                clearWorldCupSession();
                setSavedSession(null);
              }}>
                저장된 대진 지우기
              </button>
            </div>
          </section>
        ) : null}

        <section className="world-cup-setup__section" aria-labelledby="topic-title">
          <span className="world-cup-step">01</span>
          <h2 id="topic-title">오늘의 주제</h2>
          <article className="world-cup-topic-card">
            <img src="/images/world-cup/food/bibimbap.webp" alt="" />
            <span>
              <small>64개 후보</small>
              <strong>음식 월드컵</strong>
            </span>
            <b aria-hidden="true">✓</b>
          </article>
        </section>

        <section className="world-cup-setup__section" aria-labelledby="size-title">
          <span className="world-cup-step">02</span>
          <h2 id="size-title">몇 강부터 시작할까요?</h2>
          <div className="world-cup-size-options">
            {SIZE_OPTIONS.map((size) => (
              <button
                className={selectedSize === size ? 'is-selected' : undefined}
                type="button"
                aria-label={`${size}강, ${SIZE_COPY[size]}`}
                aria-pressed={selectedSize === size}
                onClick={() => setSelectedSize(size)}
                key={size}
              >
                <strong>{size}강</strong>
                <small>{SIZE_COPY[size]}</small>
              </button>
            ))}
          </div>
        </section>

        <PrimaryButton className="world-cup-start" onClick={() => startNewTournament(selectedSize)}>
          {selectedSize}강 시작하기
        </PrimaryButton>
      </ScreenLayout>
    );
  }

  const state = activeSession.current;

  if (state.phase === 'round-complete') {
    const completedRoundLabel = getRoundLabel(state.roundCandidateIds.length);
    const nextRoundLabel = getRoundLabel(state.winners.length);
    const previewCandidates = state.winners.slice(0, 6).map(findCandidate);

    return (
      <ScreenLayout className="world-cup-screen world-cup-round-complete">
        <button className="test-home-button" type="button" onClick={onBackHome}>
          <span aria-hidden="true">←</span> 홈
        </button>
        <div className="world-cup-round-complete__mark" aria-hidden="true">★</div>
        <p className="eyebrow">{completedRoundLabel} 완료</p>
        <h1>{nextRoundLabel} 진출!</h1>
        <p>{state.winners.length}개의 음식이 다음 대결을 기다리고 있어요.</p>

        <div className="world-cup-advance-preview" aria-label={`${nextRoundLabel} 진출 후보 미리보기`}>
          {previewCandidates.map((candidate) => (
            <img src={candidate.image} alt={candidate.name} loading="lazy" key={candidate.id} />
          ))}
        </div>

        <div className="world-cup-round-complete__actions">
          <PrimaryButton onClick={() => setActiveSession((session) => session ? {
            ...session,
            current: startNextRound(session.current),
          } : session)}>
            {nextRoundLabel} 계속하기
          </PrimaryButton>
          <button type="button" onClick={undoLastChoice}>방금 선택 취소</button>
        </div>
      </ScreenLayout>
    );
  }

  if (state.phase === 'champion') {
    const champion = findCandidate(state.championId ?? '');
    const defeatedCandidates = state.history
      .filter((match) => match.winnerId === champion.id)
      .map((match) => findCandidate(match.leftId === champion.id ? match.rightId : match.leftId));

    return (
      <ScreenLayout className="world-cup-screen world-cup-champion">
        <div className="world-cup-champion__crown" aria-hidden="true">★</div>
        <p className="eyebrow">음식 최애 월드컵 우승</p>
        <h1>{champion.name}</h1>
        <div className="world-cup-champion__image">
          <img src={champion.image} alt={champion.name} />
        </div>
        <p>{state.tournamentSize}강에서 마지막까지 살아남은 오늘의 최애예요.</p>

        <section className="world-cup-champion__path" aria-labelledby="winner-path-title">
          <h2 id="winner-path-title">우승까지 만난 음식</h2>
          <div>
            {defeatedCandidates.map((candidate) => (
              <span key={candidate.id}>{candidate.name}</span>
            ))}
          </div>
        </section>

        <div className="world-cup-champion__actions">
          <PrimaryButton onClick={() => startNewTournament(state.tournamentSize)}>
            {state.tournamentSize}강 다시 하기
          </PrimaryButton>
          <button type="button" onClick={resetToSetup}>다른 라운드 고르기</button>
          <button type="button" onClick={onBackHome}>놀이터 홈으로</button>
        </div>
      </ScreenLayout>
    );
  }

  const [leftId, rightId] = getCurrentMatch(state);
  const leftCandidate = findCandidate(leftId);
  const rightCandidate = findCandidate(rightId);
  const roundSize = state.roundCandidateIds.length;
  const roundMatchCount = roundSize / 2;
  const totalMatchCount = getTotalMatchCount(state.tournamentSize);

  return (
    <ScreenLayout className="world-cup-screen world-cup-match">
      <button className="test-home-button" type="button" onClick={onBackHome}>
        <span aria-hidden="true">←</span> 홈
      </button>

      <header className="world-cup-match__progress">
        <div>
          <strong>{getRoundLabel(roundSize)}</strong>
          <span>{state.matchIndex + 1} / {roundMatchCount}</span>
        </div>
        <ProgressBar
          current={state.history.length}
          total={totalMatchCount}
          label="음식 월드컵 전체 진행률"
        />
        <small>전체 {state.history.length} / {totalMatchCount}</small>
      </header>

      <section className="world-cup-match__question" aria-labelledby="world-cup-match-title">
        <p className="eyebrow">오늘 더 끌리는 쪽은?</p>
        <h1 id="world-cup-match-title">하나만 고른다면</h1>
      </section>

      <div className="world-cup-duel" role="group" aria-label="음식 후보 대결">
        {[leftCandidate, rightCandidate].map((candidate, index) => (
          <div className="world-cup-duel__side" key={candidate.id}>
            <button
              type="button"
              aria-label={`${candidate.name} 선택`}
              onClick={() => setActiveSession((session) => session ? {
                version: 1,
                current: chooseWinner(session.current, candidate.id),
                previous: session.current,
              } : session)}
            >
              <img src={candidate.image} alt="" draggable="false" />
              <strong>{candidate.name}</strong>
            </button>
            {index === 0 ? <span className="world-cup-duel__vs" aria-hidden="true">VS</span> : null}
          </div>
        ))}
      </div>

      <footer className="world-cup-match__footer">
        <button
          className="world-cup-undo"
          type="button"
          disabled={activeSession.previous === null}
          onClick={undoLastChoice}
        >
          ↶ 방금 선택 취소
        </button>
      </footer>
    </ScreenLayout>
  );
}
