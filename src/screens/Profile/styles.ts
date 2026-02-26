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
  padding: 60px 16px 20px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 20px;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 500;
  color: #fff;
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

export const UserName = styled.h2`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 2px;
`;

export const UserHandle = styled.div`
  font-size: 12px;
  color: #666;
`;

export const UserAvatar = styled.div`
  // не используется в этом дизайне
`;

export const Power = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  padding: 6px 0;
`;

export const PowerValue = styled.span`
  font-size: 22px;
  font-weight: 600;
`;

export const PowerStatus = styled.span`
  font-size: 14px;
  color: #ffd700;
`;

export const PowerInfo = styled.button`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background: #222;
  color: #666;
  border: none;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
`;

export const PowerToday = styled.span`
  font-size: 12px;
  color: #666;
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
  border-radius: 12px;
  padding: 20px;
  max-width: 260px;
  width: 100%;
  z-index: 1001;
`;

export const PopupClose = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  color: #666;
  font-size: 16px;
  cursor: pointer;
`;

export const PopupTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #ffd700;
`;

export const PopupText = styled.p`
  font-size: 13px;
  color: #999;
  line-height: 1.5;
  margin-bottom: 8px;
`;

export const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
  margin-bottom: 20px;
`;

export const StatBlock = styled.div`
  text-align: center;
  flex: 1;
`;

export const StatValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 2px;
`;

export const StatLabel = styled.div`
  font-size: 9px;
  color: #666;
  text-transform: uppercase;
`;

export const Calendar = styled.div`
  margin-bottom: 20px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 11px;
  color: #666;
`;

export const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 2px;
  
  span {
    font-size: 8px;
    text-align: center;
    color: #444;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
`;

export const DayCell = styled.div<{ $type?: string }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  background: ${({ $type }) => 
    $type === 'streak' ? '#ffd700' :
    $type === 'active' ? '#ffd700' : '#0a0a0a'
  };
  color: ${({ $type }) => $type ? '#000' : '#333'};
  font-weight: ${({ $type }) => $type === 'streak' ? '500' : '400'};
  border-radius: 1px;
`;

export const CalendarFooter = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  font-size: 9px;
  color: #666;
`;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const LegendDot = styled.div<{ $active?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 1px;
  background: ${({ $active }) => $active ? '#ffd700' : '#333'};
`;

export const StatsDetails = styled.div`
  background: #0a0a0a;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const StatsTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #999;
`;

export const StatsItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  padding: 4px 0;
  color: #666;
  
  span:last-child {
    color: #fff;
  }
`;

export const Progress = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #222;
`;

export const ProgressBar = styled.div`
  height: 2px;
  background: #222;
  border-radius: 1px;
  margin: 6px 0 2px;
`;

export const ProgressFill = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}%;
  height: 100%;
  background: #ffd700;
  border-radius: 1px;
`;

export const ProgressText = styled.div`
  font-size: 9px;
  color: #666;
  text-align: right;
`;

export const AdminNote = styled.div`
  font-size: 9px;
  color: #444;
  text-align: center;
  padding: 12px 0;
  border-top: 1px solid #222;
`;

export const BottomNav = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 12px 16px;
  border-top: 1px solid #222;
`;

export const NavItem = styled.div<{ $active: boolean }>`
  color: ${({ $active }) => $active ? '#fff' : '#333'};
  cursor: pointer;
  
  svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
  }
`;