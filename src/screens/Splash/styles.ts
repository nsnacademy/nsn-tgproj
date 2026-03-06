import styled, { keyframes } from 'styled-components';

const fillAnimation = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
`;

export const ProgressFill = styled.div<{ $isVisible: boolean }>`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #fff 0%, #ffd700 100%);
  border-radius: 2px;
  animation: ${({ $isVisible }) => $isVisible ? fillAnimation : 'none'} 2.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
  position: absolute;
  left: 0;
  top: 0;
  width: 0%; /* начальное состояние */
`;

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
  gap: 5px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #fff 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
  text-align: center;
  line-height: 1.2;
  max-width: 280px;
`;

export const ProgressBar = styled.div`
  width: 160px;
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

