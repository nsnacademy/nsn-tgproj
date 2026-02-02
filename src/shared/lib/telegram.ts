export function initTelegramFullscreenHack() {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) return;

  const tryExpand = () => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    try {
      tg.requestFullscreen?.();
      tg.expand();
      tg.disableVerticalSwipes?.();
    } catch {
      // ничего, Telegram иногда кидает ошибки
    }
  };

  webApp.ready();

  tryExpand();
  setTimeout(tryExpand, 300);
  setTimeout(tryExpand, 1200);
}

export function applyTelegramLayoutVars() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  const top = tg.safeAreaInsets?.top ?? 0;
  const bottom = tg.safeAreaInsets?.bottom ?? 0;


  document.documentElement.style.setProperty('--tg-safe-top', `${top}px`);
  document.documentElement.style.setProperty('--tg-safe-bottom', `${bottom}px`);

  if (tg.themeParams?.bg_color) {
    document.documentElement.style.setProperty('--tg-bg', tg.themeParams.bg_color);
  }
}
