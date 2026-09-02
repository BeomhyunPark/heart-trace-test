// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { HomeScreen } from '../src/features/home/HomeScreen';

afterEach(cleanup);

describe('홈 방문자 수', () => {
  it('누적 익명 방문자 수를 홈 브랜드 영역에 표시한다', async () => {
    render(
      <HomeScreen
        featuredActivityId="heart-trace"
        onOpenUpdates={() => undefined}
        onSelectActivity={() => undefined}
      />,
    );

    expect(await screen.findByLabelText('누적 방문자 0명')).toBeTruthy();
  });
});
