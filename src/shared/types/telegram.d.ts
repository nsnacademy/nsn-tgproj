export {};

declare global {
  interface TelegramWebApp {
    ready(): void;
    expand(): void;

    // 🔹 FULLSCREEN (из официального API)
    requestFullscreen?: () => void;
    exitFullscreen?: () => void;

    // 🔹 жесты
    disableVerticalSwipes?: () => void;

    // 🔹 тема
    themeParams: {
      bg_color?: string;
      text_color?: string;
      hint_color?: string;
      link_color?: string;
      button_color?: string;
      button_text_color?: string;
    };

    // 🔹 пользователь
    initDataUnsafe?: {
      user?: {
        id: number;
        username?: string;
        first_name?: string;
        last_name?: string;
      };
    };
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}