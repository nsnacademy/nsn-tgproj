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


// ===== USER CARD =====
export const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 16px 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.03);
`;

export const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.2);
`;

export const UserInfo = styled.div`
  flex: 1;
`;

export const UserName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const UserHandle = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
`;

// ===== STATS GRID =====
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 18px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(5px);
`;

export const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFD700;
`;

export const StatContent = styled.div`
  flex: 1;
`;

export const StatNumber = styled.div`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 2px;
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  margin-bottom: 2px;
`;

export const StatTrend = styled.div`
  font-size: 10px;
  color: rgba(76, 175, 80, 0.8);
  font-weight: 500;
`;

// ===== ACTIVITY SECTION =====
export const ActivitySection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.03);
`;

export const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ActivityTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

export const ActivityBadge = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const ActivityCalendar = styled.div`
  display: grid;
  grid-template-columns: repeat(30, 1fr);
  gap: 3px;
  margin-bottom: 16px;
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 16px;
`;

export const DayCell = styled.div<{ $level: number }>`
  aspect-ratio: 1;
  border-radius: 4px;
  background: ${({ $level }) => {
    switch ($level) {
      case 0: return 'rgba(255, 255, 255, 0.05)';
      case 1: return 'rgba(255, 215, 0, 0.2)';
      case 2: return 'rgba(255, 215, 0, 0.4)';
      case 3: return 'rgba(255, 215, 0, 0.6)';
      case 4: return 'rgba(255, 215, 0, 0.9)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  }};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const LegendColor = styled.div<{ $level: number }>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${({ $level }) => {
    switch ($level) {
      case 0: return 'rgba(255, 255, 255, 0.1)';
      case 1: return 'rgba(255, 215, 0, 0.2)';
      case 2: return 'rgba(255, 215, 0, 0.4)';
      case 3: return 'rgba(255, 215, 0, 0.6)';
      case 4: return 'rgba(255, 215, 0, 0.9)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
`;

export const LegendText = styled.span`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
`;

// ===== RATING SECTION =====
export const RatingSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.03);
`;

export const RatingTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
`;

export const RatingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const RatingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RatingLabel = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`;

export const RatingValueWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const RatingNumber = styled.span`
  font-size: 16px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 30px;
`;

export const RatingTotal = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.3);
`;

export const RatingChange = styled.span<{ $positive: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ $positive }) => $positive ? '#4CAF50' : '#F44336'};
  background: ${({ $positive }) => 
    $positive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  padding: 4px 10px;
  border-radius: 30px;
`;

export const RatingDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 6px 0;
`;

export const RatingBadge = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  padding: 4px 12px;
  border-radius: 30px;
`;