export function getServiceWorkerUrl(baseUrl = document.baseURI): string {
  return new URL('sw.js', baseUrl).href;
}

export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(getServiceWorkerUrl());
  });
}
