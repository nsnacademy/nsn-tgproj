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



export const RequestHint = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
  line-height: 1.4;
`;
// Добавьте эти стили в файл styles.ts для экранов ChallengePaid и ChallengeCondition

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 16px 0;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 11px;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
`;

export const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 16px 0;
`;

export const CreatorBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  opacity: 0.7;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  width: fit-content;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
`;

export const MetaIcon = styled.span`
  font-size: 18px;
`;

export const MetaText = styled.span`
  font-size: 14px;
  opacity: 0.8;
`;

export const WarningBox = styled.div`
  padding: 12px 16px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  color: #FFC107;
  font-size: 13px;
  font-weight: 500;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PrizePreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
`;

export const PrizeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
`;

export const PrizePlace = styled.span`
  font-size: 16px;
  min-width: 40px;
`;

export const PrizeTitle = styled.span`
  font-size: 14px;
  opacity: 0.9;
`;

// Обновите RequestButton
export const RequestButton = styled.button<{ $isSent?: boolean; $disabled?: boolean }>`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  font-size: 15px;
  background: ${({ $isSent, $disabled }) => 
    $disabled ? 'rgba(255, 255, 255, 0.1)' :
    $isSent ? 'rgba(76, 175, 80, 0.2)' : '#fff'};
  color: ${({ $isSent, $disabled }) => 
    $disabled ? 'rgba(255, 255, 255, 0.5)' :
    $isSent ? '#4CAF50' : '#000'};
  border: ${({ $isSent, $disabled }) => 
    $disabled ? '1px solid rgba(255, 255, 255, 0.1)' :
    $isSent ? '1px solid rgba(76, 175, 80, 0.3)' : 'none'};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ $isSent }) => 
      $isSent ? 'rgba(76, 175, 80, 0.25)' : 'rgba(255, 255, 255, 0.95)'};
  }
`;