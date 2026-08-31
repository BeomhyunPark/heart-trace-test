import { useEffect, useRef, useState } from 'react';

type InstallPlatform = 'android' | 'ios' | 'other';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

const INSTALL_PROMPT_READY_EVENT = 'ongi:install-prompt-ready';
let capturedInstallPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    capturedInstallPrompt = event as BeforeInstallPromptEvent;
    window.dispatchEvent(new Event(INSTALL_PROMPT_READY_EVENT));
  });
}

function getInstallPlatform(): InstallPlatform {
  const userAgent = navigator.userAgent;
  const isIPadDesktopMode = navigator.platform === 'MacIntel'
    && navigator.maxTouchPoints > 1;

  if (/iPad|iPhone|iPod/i.test(userAgent) || isIPadDesktopMode) {
    return 'ios';
  }

  if (/Android/i.test(userAgent)) {
    return 'android';
  }

  return 'other';
}

function isRunningStandalone(): boolean {
  return window.matchMedia?.('(display-mode: standalone)').matches
    || Boolean((navigator as NavigatorWithStandalone).standalone);
}

function isIosSafari(): boolean {
  return /Safari/i.test(navigator.userAgent)
    && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(navigator.userAgent);
}

export function InstallAppPrompt() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [platform, setPlatform] = useState<InstallPlatform>('other');
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(capturedInstallPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [usesIosSafari, setUsesIosSafari] = useState(true);

  useEffect(() => {
    setPlatform(getInstallPlatform());
    setIsInstalled(isRunningStandalone());
    setUsesIosSafari(isIosSafari());

    const handleInstallPromptReady = () => {
      setInstallPrompt(capturedInstallPrompt);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      capturedInstallPrompt = null;
      setInstallPrompt(null);
      setIsGuideOpen(false);
    };

    window.addEventListener(INSTALL_PROMPT_READY_EVENT, handleInstallPromptReady);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener(INSTALL_PROMPT_READY_EVENT, handleInstallPromptReady);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!isGuideOpen) {
      return;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsGuideOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGuideOpen]);

  const handleInstall = async () => {
    if (platform === 'android' && installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      capturedInstallPrompt = null;
      setInstallPrompt(null);

      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      return;
    }

    setIsGuideOpen(true);
  };

  const closeGuide = () => {
    setIsGuideOpen(false);
    triggerRef.current?.focus();
  };

  if (isInstalled || platform === 'other') {
    return null;
  }

  return (
    <section className="install-app" aria-labelledby="install-app-title">
      <span className="install-app__icon" aria-hidden="true">
        <img src="/favicon-192x192.png" alt="" />
      </span>
      <span className="install-app__copy">
        <strong id="install-app-title">온기를 홈 화면에</strong>
        <small>앱처럼 바로 열어보세요</small>
      </span>
      <button ref={triggerRef} type="button" onClick={handleInstall}>
        추가
      </button>

      {isGuideOpen ? (
        <div className="install-guide" role="presentation" onMouseDown={closeGuide}>
          <div
            className="install-guide__sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-guide-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button ref={closeButtonRef} className="install-guide__close" type="button" onClick={closeGuide} aria-label="닫기">
              ×
            </button>
            <img className="install-guide__icon" src="/apple-touch-icon.png" alt="" />
            <p className="install-guide__eyebrow">
              {platform === 'ios' ? 'IPHONE · IPAD' : 'ANDROID'}
            </p>
            <h2 id="install-guide-title">홈 화면에 온기를 추가해요</h2>

            {platform === 'ios' ? (
              <>
                {!usesIosSafari ? (
                  <p className="install-guide__notice">먼저 이 페이지를 Safari에서 열어주세요.</p>
                ) : null}
                <ol>
                  <li><i>1</i><span>브라우저의 <b>공유</b> 버튼을 눌러요.</span></li>
                  <li><i>2</i><span><b>홈 화면에 추가</b>를 선택해요.</span></li>
                  <li><i>3</i><span><b>웹 앱으로 열기</b>를 켜고 추가해요.</span></li>
                </ol>
              </>
            ) : (
              <ol>
                <li><i>1</i><span>브라우저 오른쪽 위의 <b>⋮ 메뉴</b>를 열어요.</span></li>
                <li><i>2</i><span><b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 선택해요.</span></li>
                <li><i>3</i><span>설치를 누르면 홈 화면에서 바로 열 수 있어요.</span></li>
              </ol>
            )}

            <button className="install-guide__done" type="button" onClick={closeGuide}>알겠어요</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
