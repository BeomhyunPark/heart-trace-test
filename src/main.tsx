import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';
import './styles/tokens.css';
import './styles/globals.css';
import './styles/shared.css';
import './features/home/styles/home-base.css';
import './features/heart-trace/styles/flow.css';
import './features/heart-trace/styles/result.css';
import './features/heart-trace/styles/motion.css';
import './styles/responsive.css';
import './features/home/styles/home.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('앱을 마운트할 #root 요소를 찾을 수 없습니다.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js');
  });
}
