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
  padding: 60px 16px 80px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
`;

export const Text = styled.p`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  line-height: 1.4;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

export const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserName = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 2px;
`;

export const UserHandle = styled.div`
  font-size: 12px;
  color: #666;
`;

export const IndexBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 8px 0;
  border-bottom: 1px solid #222;
`;

export const IndexValue = styled.span`
  font-size: 26px;
  font-weight: 600;
`;

export const IndexIcon = styled.span`
  font-size: 18px;
  color: #ffd700;
`;

export const InfoButton = styled.button`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background: #222;
  color: #666;
  border: none;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: auto;
`;

export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  z-index: 1000;
`;

export const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #111;
  border: 1px solid #333;
  border-radius: 16px;
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
  font-size: 16px;
  cursor: pointer;
`;

export const PopupTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffd700;
`;

export const PopupText = styled.div`
  font-size: 13px;
  color: #999;
  line-height: 1.5;
  margin-bottom: 4px;
`;

export const PopupExample = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: #1a1a1a;
  border-radius: 8px;
  font-size: 12px;
  color: #fff;
  border-left: 2px solid #ffd700;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  font-size: 14px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 28px;
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 2px;
`;

export const StatLabel = styled.div`
  font-size: 9px;
  color: #666;
  text-transform: uppercase;
`;

export const CalendarSection = styled.div`
  margin-bottom: 20px;
`;

export const MonthTitle = styled.div`
  font-size: 11px;
  color: #666;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

export const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 4px;
  
  span {
    font-size: 8px;
    text-align: center;
    color: #444;
    text-transform: uppercase;
  }
`;

export const DotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

export const DayDot = styled.div<{ $active: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 1px;
  background: ${({ $active }) => $active ? '#ffd700' : '#1a1a1a'};
  transition: background 0.2s ease;
`;

export const Toggle = styled.div<{ $active: boolean; $disabled?: boolean }>`
  width: 36px;
  height: 18px;
  border-radius: 9px;
  background: ${({ $active }) => $active ? '#fff' : '#222'};
  position: relative;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.4 : 1};
  transition: all 0.2s ease;
`;

export const ToggleKnob = styled.div<{ $active: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background: #000;
  position: absolute;
  top: 2px;
  left: ${({ $active }) => $active ? '20px' : '2px'};
  transition: all 0.2s ease;
`;