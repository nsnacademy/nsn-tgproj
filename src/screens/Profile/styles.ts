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
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
`;

export const Text = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  line-height: 1.5;
  margin-top: 8px;
`;

export const Section = styled.div`
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 16px;
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ToggleLabel = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

export const Toggle = styled.div<{
  $active: boolean;
  $disabled?: boolean;
}>`
  width: 46px;
  height: 26px;
  border-radius: 13px;
  background: ${({ $active }) =>
    $active ? '#fff' : 'rgba(255,255,255,0.3)'};

  position: relative;
  cursor: ${({ $disabled }) =>
    $disabled ? 'not-allowed' : 'pointer'};

  opacity: ${({ $disabled }) =>
    $disabled ? 0.4 : 1};

  transition: all 0.2s ease;
`;


export const ToggleKnob = styled.div<{ $active: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #000;
  position: absolute;
  top: 2px;
  left: ${({ $active }) => ($active ? '22px' : '2px')};
  transition: all 0.2s ease;
`;


// Добавь это к существующим стилям

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

export const UserAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserName = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const UserHandle = styled.div`
  font-size: 14px;
  color: rgba(255,255,255,0.5);
`;

export const IndexBadge = styled.div`
  background: linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%);
  border: 1px solid rgba(255,215,0,0.3);
  border-radius: 20px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 20px;
  background: ${({ $status }) => 
    $status.includes('🔥') ? 'rgba(255, 69, 0, 0.2)' :
    $status.includes('📈') ? 'rgba(76, 175, 80, 0.2)' :
    $status.includes('🌱') ? 'rgba(33, 150, 243, 0.2)' :
    'rgba(158, 158, 158, 0.2)'
  };
  color: ${({ $status }) => 
    $status.includes('🔥') ? '#ff4500' :
    $status.includes('📈') ? '#4caf50' :
    $status.includes('🌱') ? '#2196f3' :
    '#9e9e9e'
  };
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 32px;
`;

export const StatItem = styled.div`
  background: rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 12px 8px;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.05);
`;

export const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const CalendarSection = styled.div`
  margin-bottom: 24px;
`;

export const CalendarTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
  color: rgba(255,255,255,0.8);
`;

export const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
  
  span {
    font-size: 11px;
    text-align: center;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
  }
`;

export const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

export const DayCell = styled.div`
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const DayNumber = styled.span<{ $isToday?: boolean }>`
  font-size: 13px;
  font-weight: ${({ $isToday }) => ($isToday ? '700' : '400')};
  color: ${({ $isToday }) => ($isToday ? '#fff' : 'rgba(255,255,255,0.5)')};
  margin-bottom: 2px;
`;

export const DayDot = styled.div<{ $intensity: 'low' | 'medium' | 'high' }>`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: ${({ $intensity }) => 
    $intensity === 'high' ? '#4caf50' :
    $intensity === 'medium' ? '#ffc107' :
    '#ff9800'
  };
`;

export const FriendLink = styled.div`
  padding: 16px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;

  &:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
  }
`;