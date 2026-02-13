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
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #000;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
  margin-bottom: 6px;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(-2px);
  }
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 8px;
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
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(155, 89, 182, 0.15);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

export const Field = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  opacity: 0.6;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Value = styled.div`
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.9;
  word-break: break-word;
`;

export const ConditionBox = styled.div`
  background: rgba(155, 89, 182, 0.1);
  border: 1px solid rgba(155, 89, 182, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  
  ${Label} {
    color: #9B59B6;
    opacity: 1;
    font-size: 14px;
    margin-bottom: 12px;
  }
  
  ${Value} {
    font-size: 18px;
    font-weight: 600;
    color: #9B59B6;
    line-height: 1.6;
  }
`;

export const ContactInfo = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(155, 89, 182, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin: 20px 0;
  
  ${Label} {
    color: #9B59B6;
    opacity: 1;
  }
  
  ${Value} {
    font-size: 18px;
    font-weight: 600;
    color: #9B59B6;
  }
`;

export const LimitBadge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  background: rgba(155, 89, 182, 0.15);
  border: 1px solid rgba(155, 89, 182, 0.3);
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  color: #9B59B6;
  margin: 10px 0;
`;

export const RuleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 16px;
`;

export const RuleIcon = styled.span`
  font-size: 24px;
`;

export const RuleText = styled.div`
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.4;
`;

export const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px 30px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(155, 89, 182, 0.15);
  z-index: 900;
`;

export const Button = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 26px;
  border: none;
  background: #9B59B6;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(155, 89, 182, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    background: #AE6DC9;
    box-shadow: 0 8px 24px rgba(155, 89, 182, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const RequestButton = styled.button<{ $isSent?: boolean }>`
  width: 100%;
  height: 35px;
  border-radius: 17px;
  border: none;
  background: ${({ $isSent }) => $isSent ? '#4CAF50' : '#9B59B6'};
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ $isSent }) => $isSent 
    ? '0 3px 11px rgba(76, 175, 80, 0.3)' 
    : '0 3px 11px rgba(155, 89, 182, 0.3)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ $isSent }) => $isSent ? '#66BB6A' : '#AE6DC9'};
    box-shadow: ${({ $isSent }) => $isSent 
      ? '0 5px 16px rgba(76, 175, 80, 0.4)' 
      : '0 5px 16px rgba(155, 89, 182, 0.4)'};
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
  font-size: 8px;
  opacity: 0.5;
  text-align: center;
  line-height: 1.4;
`;