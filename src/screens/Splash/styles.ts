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
  gap: 5px; /* уменьшили с 40px до 5px */
`;

export const Title = styled.h1`
  font-size: 24px; /* уменьшили с 42px до 24px */
  font-weight: 500; /* сделали чуть тоньше */
  letter-spacing: 2px; /* увеличили межбуквенный интервал */
  background: linear-gradient(135deg, #fff 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.2); /* уменьшили свечение */
  text-align: center;
  line-height: 1.2;
  max-width: 280px; /* ограничили ширину для аккуратности */
`;

export const ProgressBar = styled.div`
  width: 160px; /* уменьшили с 200px до 160px */
  height: 2px; /* уменьшили с 4px до 2px */
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: linear-gradient(90deg, #fff 0%, #ffd700 100%);
  border-radius: 2px;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.4); /* уменьшили свечение */
`;