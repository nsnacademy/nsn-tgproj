export const tg = window.Telegram?.WebApp;

export function initTelegramFullscreenHack() {
  if (!tg) return;

  function tryExpand() {
    try {
      tg.requestFullscreen?.();
      tg.expand();
      tg.disableVerticalSwipes?.();
    } catch {}
  }

  tg.ready();

  tryExpand();
  setTimeout(tryExpand, 300);
  setTimeout(tryExpand, 1200);
}