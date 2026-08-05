import { useReducer } from 'react';

import { createInitialTestState, testReducer } from './testReducer';

export function App() {
  const [state] = useReducer(
    testReducer,
    undefined,
    createInitialTestState,
  );

  return (
    <main className="app-shell" data-phase={state.phase}>
      <h1>마음의 흔적 테스트</h1>
      <p>프로젝트 골격이 준비되었습니다.</p>
    </main>
  );
}
