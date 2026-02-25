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


export const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #fff;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

export const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const UserName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const UserHandle = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 24px;
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px 4px;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(30, 1fr);
  gap: 2px;
  margin-bottom: 8px;
`;

export const CalendarDay = styled.div<{ $level: number }>`
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${({ $level }) => {
    switch ($level) {
      case 0: return 'rgba(255, 255, 255, 0.1)';
      case 1: return 'rgba(76, 175, 80, 0.3)';
      case 2: return 'rgba(76, 175, 80, 0.5)';
      case 3: return 'rgba(76, 175, 80, 0.7)';
      case 4: return 'rgba(76, 175, 80, 1)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
    opacity: 0.9;
  }
`;

export const RatingCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RatingLabel = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

export const RatingChange = styled.span<{ $positive: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $positive }) => $positive ? '#4CAF50' : '#F44336'};
`;

export const RatingBadge = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

export const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
`;

// Экспортируем все существующие стили
export * from './styles';