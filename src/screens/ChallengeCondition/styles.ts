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
  color: #9B59B6;
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
  border: 1px solid rgba(155, 89, 182, 0.1);
  backdrop-filter: blur(10px);
`;

export const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #9B59B6;
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

export const ConditionBox = styled.div`
  background: rgba(155, 89, 182, 0.05);
  border: 1px solid rgba(155, 89, 182, 0.15);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  
  ${Label} {
    color: #9B59B6;
    opacity: 0.8;
  }
  
  ${Value} {
    font-size: 16px;
    font-weight: 500;
    color: #9B59B6;
    line-height: 1.6;
  }
`;

export const ContactInfo = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(155, 89, 182, 0.15);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  
  ${Label} {
    color: #9B59B6;
    opacity: 0.8;
  }
  
  ${Value} {
    font-size: 16px;
    font-weight: 600;
    color: #9B59B6;
  }
`;

export const LimitBadge = styled.div`
  display: inline-block;
  padding: 6px 14px;
  background: rgba(155, 89, 182, 0.08);
  border: 1px solid rgba(155, 89, 182, 0.2);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #9B59B6;
  margin: 8px 0;
`;

export const RuleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: rgba(155, 89, 182, 0.03);
  border: 1px solid rgba(155, 89, 182, 0.1);
  border-radius: 12px;
  margin-top: 16px;
`;

export const RuleIcon = styled.span`
  font-size: 20px;
`;

export const RuleText = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: rgba(155, 89, 182, 0.8);
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
  border-top: 1px solid rgba(155, 89, 182, 0.1);
  z-index: 900;
`;

export const RequestButton = styled.button<{ $isSent?: boolean }>`
  width: 100%;
  height: 48px;
  border-radius: 24px;
  border: none;
  background: ${({ $isSent }) => $isSent ? 'rgba(76, 175, 80, 0.1)' : 'transparent'};
  color: ${({ $isSent }) => $isSent ? '#4CAF50' : '#9B59B6'};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
  border: 1px solid ${({ $isSent }) => $isSent ? 'rgba(76, 175, 80, 0.3)' : '#9B59B6'};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ $isSent }) => $isSent ? 'rgba(76, 175, 80, 0.15)' : 'rgba(155, 89, 182, 0.1)'};
    border-color: ${({ $isSent }) => $isSent ? 'rgba(76, 175, 80, 0.4)' : '#AE6DC9'};
    color: ${({ $isSent }) => $isSent ? '#4CAF50' : '#AE6DC9'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const RequestHint = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
  line-height: 1.4;
`;