import styled from 'styled-components';

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 50px 16px 12px;
  background: #000;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BackButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  color: #FFD700;
`;

export const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 215, 0, 0.1);
  backdrop-filter: blur(10px);
`;

export const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #FFD700;
`;

export const Field = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 6px;
  letter-spacing: 0.3px;
`;

export const Value = styled.div`
  font-size: 15px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-word;
`;

export const PriceTag = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #FFD700;
  margin: 16px 0;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  text-align: center;
  
  &::before {
    content: '💰';
    font-size: 20px;
    margin-right: 8px;
    opacity: 0.9;
  }
`;

export const ContactInfo = styled.div`
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  
  ${Label} {
    color: #FFD700;
    opacity: 0.8;
  }
  
  ${Value} {
    font-size: 16px;
    font-weight: 600;
    color: #FFD700;
  }
`;

export const RuleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 215, 0, 0.03);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  margin-top: 16px;
`;

export const RuleIcon = styled.span`
  font-size: 20px;
`;

export const RuleText = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 215, 0, 0.8);
  line-height: 1.4;
`;

export const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px 24px;
  background: linear-gradient(to top, #000, rgba(0, 0, 0, 0.95));
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  z-index: 900;
`;

export const RequestButton = styled.button<{ $isSent?: boolean }>`
  width: 100%;
  height: 48px;
  border-radius: 24px;
  border: none;
  background: ${({ $isSent }) => $isSent ? 'rgba(76, 175, 80, 0.1)' : '#FFD700'};
  color: ${({ $isSent }) => $isSent ? '#4CAF50' : '#000'};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
  border: ${({ $isSent }) => $isSent ? '1px solid rgba(76, 175, 80, 0.3)' : 'none'};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ $isSent }) => $isSent ? 'rgba(76, 175, 80, 0.15)' : '#FFE55C'};
    box-shadow: ${({ $isSent }) => $isSent ? 'none' : '0 4px 12px rgba(255, 215, 0, 0.3)'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

export const RequestHint = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
  line-height: 1.4;
`;