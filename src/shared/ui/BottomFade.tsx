import styled from 'styled-components';

export const BottomFade = styled.div`
  position: fixed;
  left: 0;
  right: 0;

  /* ⬇️ НАЧИНАЕТСЯ ПРЯМО НАД NAV */
  bottom: 86px; /* 68px nav + 18px отступ */

  height: 64px;
  pointer-events: none;
  z-index: 900;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 40%,
    rgba(0, 0, 0, 0.25) 70%,
    rgba(0, 0, 0, 0) 100%
  );
`;
