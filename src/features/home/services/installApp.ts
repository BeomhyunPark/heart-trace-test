export type InstallPlatform = 'android' | 'ios' | 'other';

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

type InstallEnvironment = {
  platform: InstallPlatform;
  isInstalled: boolean;
  usesIosSafari: boolean;
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

export function getInstallEnvironment(): InstallEnvironment {
  return {
    platform: getInstallPlatform(),
    isInstalled: isRunningStandalone(),
    usesIosSafari: isIosSafari(),
  };
}

export function getCapturedInstallPrompt(): BeforeInstallPromptEvent | null {
  return capturedInstallPrompt;
}

export function subscribeToInstallEvents(
  onPromptReady: (prompt: BeforeInstallPromptEvent | null) => void,
  onInstalled: () => void,
): () => void {
  const handleInstallPromptReady = () => {
    onPromptReady(capturedInstallPrompt);
  };
  const handleInstalled = () => {
    capturedInstallPrompt = null;
    onInstalled();
  };

  window.addEventListener(INSTALL_PROMPT_READY_EVENT, handleInstallPromptReady);
  window.addEventListener('appinstalled', handleInstalled);

  return () => {
    window.removeEventListener(INSTALL_PROMPT_READY_EVENT, handleInstallPromptReady);
    window.removeEventListener('appinstalled', handleInstalled);
  };
}

export async function promptToInstall(
  installPrompt: BeforeInstallPromptEvent,
): Promise<'accepted' | 'dismissed'> {
  await installPrompt.prompt();
  const choice = await installPrompt.userChoice;
  capturedInstallPrompt = null;
  return choice.outcome;
}
