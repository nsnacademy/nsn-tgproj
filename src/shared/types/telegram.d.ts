export {};

declare global {
  interface TelegramWebApp {
    ready(): void;
    expand(): void;
    requestFullscreen?: () => void;
    exitFullscreen?: () => void;
    disableVerticalSwipes?: () => void;

    themeParams: {
      bg_color?: string;
      text_color?: string;
      hint_color?: string;
      link_color?: string;
      button_color?: string;
      button_text_color?: string;
    };

    initDataUnsafe?: {
      user?: {
        id: number;
        username?: string;
      };
    };
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}