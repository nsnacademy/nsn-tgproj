import styled from 'styled-components';

export const SplashContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* 🔹 безопасные отступы уже учтены глобально */
  padding: 16px;

  text-align: center;
`;

export const Title = styled.h1`
  font-size: 32px;
  margin: 0 0 8px;
  font-weight: 700;
`;