import styled from 'styled-components';

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding: 16px;
  padding-bottom: 100px;
`;

export const Header = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 6px;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  opacity: 0.7;
`;

export const Card = styled.div<{ active?: boolean }>`
  border: 1px solid ${({ active }) => (active ? '#fff' : '#333')};
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 14px;
  cursor: pointer;
  transition: border 0.15s ease;

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
    opacity: 0.85;
  }
`;

export const Footer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  padding: 16px;
  border-top: 1px solid #222;
`;

export const NextButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  background: #fff;
  color: #000;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;
