import styled from 'styled-components';

export const SplashContainer = styled.div`
  min-height: 100vh;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 8px;
`;
