import styled, { keyframes } from 'styled-components';

/* ======================
   ANIMATIONS
====================== */
const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

/* ======================
   BASE
====================== */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  position: relative;
  overflow: hidden;
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 14px;
  opacity: 0.6;
`;

/* ======================
   HEADER
====================== */
export const Header = styled.div`
  padding: 100px 20px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #000;
  position: sticky;
  top: 15;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(-2px);
  }
`;

export const HeaderTitle = styled.div`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

export const RatingBadge = styled.div<{ $highlight?: boolean }>`
  padding: 6px 10px;
  border-radius: 999px;

  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;

  background: ${({ $highlight }) =>
    $highlight
      ? 'rgba(255, 215, 0, 0.15)'
      : 'rgba(255, 255, 255, 0.08)'};

  color: ${({ $highlight }) =>
    $highlight ? '#FFD700' : 'rgba(255,255,255,0.75)'};

  border: ${({ $highlight }) =>
    $highlight ? '1px solid rgba(255,215,0,0.4)' : 'none'};
`;


/* ======================
   CONTENT
====================== */
export const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* ======================
   PROGRESS CARD
====================== */
export const ProgressCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

export const ProgressInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

export const StatValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  opacity: 0.95;
`;

export const StatLabel = styled.div`
  font-size: 11px;
  opacity: 0.5;
  margin-top: 4px;
  
  letter-spacing: 0.5px;
`;

export const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ProgressBarWrapper = styled.div`
  position: relative;
`;

export const ProgressBar = styled.div`
  height: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease, background 0.3s ease;
`;

export const ProgressPercentage = styled.div`
  top: -24px;
  right: 0;
  font-size: 13px;
  font-weight: 600;
  opacity: 0.9;
`;

export const ProgressText = styled.div`
  font-size: 14px;
  opacity: 0.8;
  font-weight: 500;
`;

export const TodayStatus = styled.div`
  margin-top: 8px;
`;

export const StatusBadge = styled.div<{
  $status: 'none' | 'pending' | 'approved' | 'rejected';
}>`
  display: inline-block;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 12px;

  background: ${({ $status }) => {
    switch ($status) {
      case 'approved':
        return 'rgba(76, 175, 80, 0.15)';
      case 'pending':
        return 'rgba(255, 193, 7, 0.15)';
      case 'rejected':
        return 'rgba(255, 80, 80, 0.15)';
      default:
        return 'rgba(255, 255, 255, 0.08)';
    }
  }};

  color: ${({ $status }) => {
    switch ($status) {
      case 'approved':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'rejected':
        return '#ff6b6b';
      default:
        return 'rgba(255, 255, 255, 0.7)';
    }
  }};

  border: 1px solid ${({ $status }) => {
    switch ($status) {
      case 'approved':
        return 'rgba(76, 175, 80, 0.3)';
      case 'pending':
        return 'rgba(255, 193, 7, 0.3)';
      case 'rejected':
        return 'rgba(255, 80, 80, 0.35)';
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  }};
`;


/* ======================
   SECTIONS
====================== */
export const Section = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const SectionHeader = styled.div`
  margin-bottom: 16px;
`;

export const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
  margin-bottom: 4px;
`;

export const SectionSubtitle = styled.div`
  font-size: 12px;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ======================
   RULES
====================== */
export const ChallengeRules = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const RulesContent = styled.div`
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.8;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border-left: 3px solid rgba(255, 255, 255, 0.2);
`;

export const ConditionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ConditionItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  opacity: 0.7;
  padding: 8px 0;

  span {
    font-size: 14px;
    opacity: 0.8;
  }
`;

/* ======================
   PARTICIPANTS
====================== */
export const ParticipantsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ParticipantAvatars = styled.div`
  display: flex;
  align-items: center;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 2px solid #000;
`;

export const ParticipantCount = styled.div`
  font-size: 13px;
  opacity: 0.6;
`;

/* ======================
   RATING
====================== */
export const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RatingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const RatingTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
  margin-bottom: 4px;
`;

export const RatingSubtitle = styled.div`
  font-size: 12px;
  opacity: 0.6;
`;

export const RatingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RatingItem = styled.div<{ $highlight?: boolean; $clickable?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: ${({ $highlight }) => 
    $highlight 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'transparent'};
  border: 1px solid ${({ $highlight }) => 
    $highlight 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(255, 255, 255, 0.05)'};
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${({ $clickable }) => 
      $clickable 
        ? 'rgba(255, 255, 255, 0.12)' 
        : 'inherit'};
    transform: ${({ $clickable }) => 
      $clickable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${({ $clickable }) => 
      $clickable 
        ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
        : 'none'};
  }

  &:active {
    transform: ${({ $clickable }) => 
      $clickable ? 'translateY(0)' : 'none'};
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: ${({ $clickable }) => $clickable ? 1 : 0};
  }
`;

export const RatingPlace = styled.div`
  min-width: 40px;
`;

export const PlaceBadge = styled.div<{ $place: number }>`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  background: ${({ $place }) => {
    switch($place) {
      case 1: return 'linear-gradient(135deg, #FFD700, #FFA500)';
      case 2: return 'linear-gradient(135deg, #C0C0C0, #A0A0A0)';
      case 3: return 'linear-gradient(135deg, #CD7F32, #A0522D)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${({ $place }) => $place <= 3 ? '#000' : 'rgba(255, 255, 255, 0.8)'};
`;

export const RatingUser = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
`;

export const RatingValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
  min-width: 60px;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

/* ======================
   PRIZE OVERLAY
====================== */
export const PrizeOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: ${({ $show }) => ($show ? fadeIn : fadeOut)} 0.3s ease forwards;
  padding: 20px;
`;

export const PrizeCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: ${slideUp} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  overflow: hidden;
`;

export const PrizeHeader = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const PrizeTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  opacity: 0.95;
`;

export const PrizeClose = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: rotate(90deg);
  }
`;

export const PrizeContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const PrizeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const PrizeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  text-align: center;
`;

export const PrizePlace = styled.div`
  display: flex;
  justify-content: center;
`;

export const PrizePlaceBadge = styled.div<{ $place: number }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: ${({ $place }) => {
    switch($place) {
      case 1: return 'rgba(255, 215, 0, 0.15)';
      case 2: return 'rgba(192, 192, 192, 0.15)';
      case 3: return 'rgba(205, 127, 50, 0.15)';
      default: return 'rgba(255, 255, 255, 0.08)';
    }
  }};
  color: ${({ $place }) => {
    switch($place) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return 'rgba(255, 255, 255, 0.8)';
    }
  }};
  border: 1px solid ${({ $place }) => {
    switch($place) {
      case 1: return 'rgba(255, 215, 0, 0.3)';
      case 2: return 'rgba(192, 192, 192, 0.3)';
      case 3: return 'rgba(205, 127, 50, 0.3)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
`;

export const PrizeUser = styled.div`
  font-size: 20px;
  font-weight: 600;
  opacity: 0.95;
`;

export const PrizeName = styled.div`
  font-size: 24px;
  font-weight: 700;
  opacity: 0.95;
  line-height: 1.3;
`;

export const PrizeDescription = styled.div`
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.5;
  padding: 0 10px;
`;

export const PrizeStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const PrizeStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

export const PrizeStatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  opacity: 0.95;
  margin-bottom: 4px;
`;

export const PrizeStatLabel = styled.div`
  font-size: 11px;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ======================
   ACTION BLOCK
====================== */
export const ActionBlock = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px 24px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 900;
`;

export const PrimaryButton = styled.button<{ $variant?: 'simple' | 'result' }>`
  width: 100%;
  height: 56px;
  border-radius: 16px;
  border: none;
  background: ${({ $variant }) => 
    $variant === 'result' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : '#fff'};
  color: ${({ $variant }) => 
    $variant === 'result' ? '#fff' : '#000'};
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
    background: ${({ $variant }) => 
      $variant === 'result' 
        ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4191 100%)'
        : 'rgba(255, 255, 255, 0.95)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const DisabledButton = styled(PrimaryButton)`
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);

  &:hover {
    transform: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 120px;
`;
