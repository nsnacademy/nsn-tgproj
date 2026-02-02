export {};

declare global {
  interface TelegramWebAppUser {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
  }

  interface TelegramWebApp {
    ready(): void;
    expand(): void;
    close(): void;

    disableVerticalSwipes?: () => void;
    requestFullscreen?: () => void;

    initDataUnsafe?: {
      user?: TelegramWebAppUser;
    };

    themeParams?: {
      bg_color?: string;
      text_color?: string;
      hint_color?: string;
      link_color?: string;
      button_color?: string;
      button_text_color?: string;
    };

    safeAreaInsets?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
