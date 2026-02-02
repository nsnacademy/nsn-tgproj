import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    margin: 0;
  }

  body {
    background: var(--tg-bg, #fff);
    color: #000;
  }

  .safe-screen {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);

    padding-top: max(env(safe-area-inset-top), var(--tg-safe-top));
    padding-bottom: max(env(safe-area-inset-bottom), var(--tg-safe-bottom));
  }
`;