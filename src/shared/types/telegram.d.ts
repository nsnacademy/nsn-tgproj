export {};

declare global {
  interface TelegramWebApp {
    ready(): void;
    expand(): void;
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