export function initTelegramFullscreenHack() {
  const maybeWebApp = window.Telegram?.WebApp;
  if (!maybeWebApp) return;

  // ✅ ЯВНО говорим TS: дальше это TelegramWebApp
  const webApp = maybeWebApp;

  function tryExpand() {
    try {
      webApp.requestFullscreen?.();
      webApp.expand();
      webApp.disableVerticalSwipes?.();
    } catch {}
  }

  webApp.ready();

  tryExpand();
  setTimeout(tryExpand, 300);
  setTimeout(tryExpand, 1200);
}