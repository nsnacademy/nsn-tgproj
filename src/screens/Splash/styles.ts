import styled from 'styled-components';

export const SplashContainer = styled.div`
  min-height: 100vh;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  background: #000;
  color: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
`;

export const Title = styled.h1`
  font-size: 42px;
  font-weight: 600;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #fff 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
`;

export const ProgressBar = styled.div`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: linear-gradient(90deg, #fff 0%, #ffd700 100%);
  border-radius: 4px;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;