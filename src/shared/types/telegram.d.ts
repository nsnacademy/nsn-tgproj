export {};

declare global {
  interface TelegramWebApp {
    ready(): void;

    // fullscreen / viewport
    expand(): void;
    requestFullscreen?: () => void;
    exitFullscreen?: () => void;

    // gestures
    disableVerticalSwipes?: () => void;

    // theme
    themeParams: {
      bg_color?: string;
      text_color?: string;
      hint_color?: string;
      link_color?: string;
      button_color?: string;
      button_text_color?: string;
    };

    // init data
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