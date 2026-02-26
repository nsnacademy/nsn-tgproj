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


export const CalendarSection = styled.div`
  margin: 20px 0;
`;

export const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
  span {
    font-size: 10px;
    text-align: center;
    color: rgba(255,255,255,0.3);
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
  align-items: center;
  justify-content: center;
`;

export const DayDot = styled.div<{ $intensity: 'low' | 'medium' | 'high' }>`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: ${({ $intensity }) => 
    $intensity === 'high' ? '#4caf50' :
    $intensity === 'medium' ? '#ffc107' : '#ff9800'
  };
`;

export const IndexBadge = styled.div`
  background: rgba(255,215,0,0.1);
  border: 1px solid rgba(255,215,0,0.2);
  border-radius: 30px;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatusBadge = styled.span<{ $index: number }>`
  font-size: 16px;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${({ $index }) => 
    $index >= 100 ? 'rgba(255,69,0,0.2)' :
    $index >= 50 ? 'rgba(76,175,80,0.2)' :
    $index >= 20 ? 'rgba(33,150,243,0.2)' : 'rgba(158,158,158,0.2)'
  };
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 16px;
`;

export const StatItem = styled.div`
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 10px 4px;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

export const StatLabel = styled.div`
  font-size: 10px;
  color: rgba(255,255,255,0.4);
`;

export const FriendLink = styled.div`
  padding: 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 14px;
  text-align: center;
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
`;

// Добавь это в конец файла styles.ts

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

export const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const UserHandle = styled.div`
  font-size: 13px;
  color: rgba(255,255,255,0.5);
`;