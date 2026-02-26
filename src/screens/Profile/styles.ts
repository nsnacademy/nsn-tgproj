import styled from 'styled-components';

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
  flex: 1;
  padding: 90px 20px 140px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
`;

export const Text = styled.p`
  font-size: 14px;
  color: #666;
`;

export const Toggle = styled.div<{ $active: boolean; $disabled?: boolean }>`
  width: 46px;
  height: 26px;
  border-radius: 13px;
  background: ${({ $active }) => $active ? '#fff' : '#222'};
  position: relative;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.4 : 1};
  transition: 0.2s;
`;

export const ToggleKnob = styled.div<{ $active: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #000;
  position: absolute;
  top: 2px;
  left: ${({ $active }) => $active ? '22px' : '2px'};
  transition: 0.2s;
`;

export const UserName = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const UserHandle = styled.div`
  font-size: 14px;
  color: #666;
`;

export const ScoreCard = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
  padding: 16px;
  background: #0a0a0a;
  border-radius: 30px;
  border: 1px solid #222;
`;

export const ScoreValue = styled.span`
  font-size: 28px;
  font-weight: 700;
`;

export const ScoreBadge = styled.span`
  font-size: 20px;
`;

export const ScoreInfo = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: #222;
  color: #666;
  border: none;
  font-size: 12px;
  cursor: pointer;
`;

export const ScoreToday = styled.span`
  font-size: 13px;
  color: #666;
  margin-left: auto;
`;

export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  z-index: 1000;
`;

export const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #111;
  border: 1px solid #333;
  border-radius: 20px;
  padding: 24px;
  max-width: 280px;
  width: 90%;
  z-index: 1001;
`;

export const PopupClose = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  color: #666;
  font-size: 18px;
  cursor: pointer;
`;

export const PopupTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffd700;
`;

export const PopupText = styled.p`
  font-size: 14px;
  color: #999;
  line-height: 1.6;
  margin-bottom: 6px;
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 24px 0;
`;

export const StatBlock = styled.div`
  text-align: center;
  padding: 12px 4px;
  background: #0a0a0a;
  border-radius: 12px;
`;

export const StatNumber = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
`;

export const SimpleList = styled.div`
  background: #0a0a0a;
  border-radius: 16px;
  padding: 16px;
  margin: 20px 0;
`;

export const SimpleItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #222;
`;

export const SimpleLabel = styled.span`
  font-size: 14px;
  color: #999;
`;

export const SimpleValue = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #fff;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0 0;
  margin-top: 4px;
  
  ${SimpleLabel} {
    color: #ffd700;
    font-weight: 600;
  }
  
  ${SimpleValue} {
    color: #ffd700;
    font-weight: 700;
    font-size: 18px;
  }
`;

export const AdminNote = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #0a0a0a;
  border-radius: 12px;
  font-size: 13px;
  color: #666;
  text-align: center;
  border: 1px solid #222;
`;