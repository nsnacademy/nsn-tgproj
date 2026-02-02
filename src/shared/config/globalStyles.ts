import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;

    background: var(--tg-bg, #ffffff);
    color: var(--tg-text, #111);

    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
  }

  #root {
    width: 100%;
    height: 100%;

    /* ✅ ВАЖНО: safe-area ТУТ */
    padding-top: env(safe-area-inset-top);
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);

    display: flex;
    flex-direction: column;
  }
`;