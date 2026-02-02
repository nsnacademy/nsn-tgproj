export function initTelegramFullscreenHack() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  const webApp = tg as TelegramWebApp;

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