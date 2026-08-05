import type { PropsWithChildren, ReactNode } from 'react';

import { AppBackground } from './AppBackground';

type ScreenLayoutProps = PropsWithChildren<{
  className?: string;
  footer?: ReactNode;
}>;

export function ScreenLayout({ children, className = '', footer }: ScreenLayoutProps) {
  return (
    <main className={`screen-layout ${className}`.trim()}>
      <AppBackground />
      <div className="screen-layout__content">{children}</div>
      {footer ? <footer className="screen-layout__footer">{footer}</footer> : null}
    </main>
  );
}
