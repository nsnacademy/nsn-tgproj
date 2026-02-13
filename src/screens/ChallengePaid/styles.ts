import styled from 'styled-components';

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 33px 11px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #000;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const BackButton = styled.button`
  width: 21px;
  height: 21px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  svg {
    width: 13px;
    height: 13px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(-1px);
  }
`;

export const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 5px;
`;

export const Content = styled.div`
  padding: 11px;
  display: flex;
  flex-direction: column;
  gap: 11px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 67px;
  
  &::-webkit-scrollbar {
    width: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 13px;
  padding: 13px;
  border: 1px solid rgba(255, 215, 0, 0.15);
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
`;

export const Field = styled.div`
  margin-bottom: 13px;
`;

export const Label = styled.div`
  font-size: 8px;
  font-weight: 500;
  opacity: 0.6;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const Value = styled.div`
  font-size: 11px;
  line-height: 1.5;
  opacity: 0.9;
  word-break: break-word;
`;

export const PriceTag = styled.div`
  font-size: 21px;
  font-weight: 700;
  color: #FFD700;
  margin: 13px 0;
  padding: 13px 0;
  border-top: 1px dashed rgba(255, 215, 0, 0.3);
  border-bottom: 1px dashed rgba(255, 215, 0, 0.3);
  text-align: center;
  
  &::before {
    content: '💰';
    font-size: 16px;
    margin-right: 5px;
    opacity: 0.9;
  }
`;

export const ContactInfo = styled.div`
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 8px;
  padding: 11px;
  margin: 13px 0;
  
  ${Label} {
    color: #FFD700;
    opacity: 1;
    font-size: 8px;
  }
  
  ${Value} {
    font-size: 12px;
    font-weight: 600;
    color: #FFD700;
  }
`;

export const RuleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 11px;
`;

export const RuleIcon = styled.span`
  font-size: 16px;
`;

export const RuleText = styled.div`
  font-size: 9px;
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.4;
`;

export const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 11px 13px 20px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 215, 0, 0.15);
  z-index: 900;
`;

export const Button = styled.button`
  width: 100%;
  height: 35px;
  border-radius: 17px;
  border: none;
  background: #FFD700;
  color: #000;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 3px 11px rgba(255, 215, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
    background: #FFE55C;
    box-shadow: 0 5px 16px rgba(255, 215, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;