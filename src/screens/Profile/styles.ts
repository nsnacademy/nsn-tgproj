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
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
`;

export const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserInfo = styled.div`
  flex: 1;
`;

export const UserName = styled.div`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const UserHandle = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`;

export const CreatorBadge = styled.span`
  background: rgba(255, 215, 0, 0.15);
  color: #FFD700;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 30px;
  font-weight: 500;
`;

// ===== STATS GRID =====
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 24px;
`;

export const StatItem = styled.div`
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

// ===== REQUESTS SECTION =====
export const RequestsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
`;

export const RequestsHeader = styled.div`
  margin-bottom: 16px;
`;

export const RequestsTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
`;

export const RequestsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;



// ===== ROLE SWITCHER =====
export const RoleSwitch = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  padding: 4px;
  margin-bottom: 24px;
`;

export const RoleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  background: ${({ $active }) => $active ? '#FFD700' : 'transparent'};
  color: ${({ $active }) => $active ? '#000' : '#fff'};
  border: none;
  padding: 10px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

// ===== SECTION HEADER =====
export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 12px;
`;

export const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

export const SectionBadge = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

// ===== PROGRESS BAR =====
export const ProgressBar = styled.div`
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}%;
  height: 100%;
  background: #FFD700;
`;

export const ProgressText = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  min-width: 40px;
`;

// ===== PARTICIPANT/CREATOR SECTIONS =====
export const ParticipantSection = styled.div``;
export const CreatorSection = styled.div``;

// ===== REQUESTS =====
export const RequestRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const RequestName = styled.span`
  font-size: 14px;
  color: #fff;
`;

export const RequestBadge = styled.span<{ $type: 'new' | 'waiting' }>`
  background: ${({ $type }) => 
    $type === 'new' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 152, 0, 0.15)'};
  color: ${({ $type }) => 
    $type === 'new' ? '#4CAF50' : '#FF9800'};
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 30px;
`;

export const ReportBadge = styled.span`
  background: rgba(33, 150, 243, 0.15);
  color: #2196F3;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 30px;
`;

// ===== RATING =====
export const RatingSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  margin-top: 20px;
`;

export const RatingTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
`;

export const RatingGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RatingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RatingLabel = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`;

export const RatingValue = styled.span<{ $secondary?: boolean }>`
  font-size: 14px;
  font-weight: ${({ $secondary }) => $secondary ? '400' : '600'};
  color: ${({ $secondary }) => $secondary ? 'rgba(255,255,255,0.5)' : '#fff'};
`;

export const RatingTrend = styled.span`
  font-size: 12px;
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  padding: 2px 6px;
  border-radius: 30px;
`;

export const RatingDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
`;

export const TrustBadge = styled.span`
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 30px;
`;