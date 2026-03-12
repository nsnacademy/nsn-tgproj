import styled from 'styled-components';

/* ======================
   PAGE
====================== */
export const SafeArea = styled.div`
  height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/* ======================
   FIXED HEADER
====================== */
export const FixedHeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #000;
  z-index: 1000;
`;

export const HeaderSpacer = styled.div`
  height: env(safe-area-inset-top, 0px);
`;

export const Header = styled.div`
  padding: 95px 20px 0;
`;

export const StatusLabel = styled.div`
  font-size: 14px;
  opacity: 0.6;
`;

export const StatusTitle = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin-top: 4px;
`;

/* ======================
   TABS
====================== */
export const Tabs = styled.div`
  display: flex;
  gap: 18px;
  padding: 7px 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 14px;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  padding-bottom: 6px;
  position: relative;
  transition: all 0.2s ease;
  border-bottom: ${({ $active }) =>
    $active ? '2px solid #fff' : '2px solid transparent'};

  &:hover {
    opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  }
`;

/* ======================
   SCROLL
====================== */
export const HeaderOffset = styled.div`
  height: 170px;
`;

export const HomeContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 60px 20px 120px;
`;

export const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const EmptyText = styled.div`
  margin-top: 60px;
  text-align: center;
  font-size: 14px;
  opacity: 0.6;
  padding: 0 20px;
`;

/* ======================
   CARD - УМЕНЬШЕННАЯ В 3 РАЗА
====================== */
export const Card = styled.div`
  background: linear-gradient(180deg, #1b2437, #1a2234);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: #fff;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.5);
  }
`;

export const CardHeader = styled.div`
  margin-bottom: 12px;
`;

export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* ======================
   PARTICIPANTS BADGE - УМЕНЬШЕН
====================== */
export const ParticipantsBadge = styled.div`
  background: #3a4254;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`;

/* ======================
   DAY & PERCENT ROW - УМЕНЬШЕН
====================== */
export const DayPercentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
  font-size: 14px;
`;

export const DayLabel = styled.span`
  color: #b0b8c5;
  font-weight: 500;
  font-size: 13px;
`;

export const DayValue = styled.span`
  font-weight: 700;
  color: #fff;
  font-size: 14px;
`;

export const PercentValue = styled.span`
  font-weight: 700;
  color: #c4b5fd;
  font-size: 16px;
`;

/* ======================
   PROGRESS BAR - УМЕНЬШЕН
====================== */
export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #3a4254;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 14px;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #a78bfa, #c4b5fd);
  box-shadow: 0 0 6px rgba(167,139,250,0.6);
  border-radius: 8px;
  transition: width 0.3s ease;
`;

/* ======================
   DIVIDER - УМЕНЬШЕН
====================== */
export const Divider = styled.div`
  height: 1px;
  background: #394050;
  margin: 12px 0;
`;

/* ======================
   STATS ROW - УМЕНЬШЕН
====================== */
export const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
`;

export const StatIcon = styled.div<{ $color: string }>`
  width: 22px;
  height: 22px;
  background: ${({ $color }) => $color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
  color: #fff;
`;

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatMain = styled.span`
  font-size: 14px;
  color: #fff;
`;

export const StatSub = styled.span`
  font-size: 11px;
  color: #9aa3b5;
  margin-top: 1px;
`;

/* ======================
   REPORT BLOCK - УМЕНЬШЕН
====================== */
export const ReportBlock = styled.div`
  background: #2a3346;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #4c3f6b;
  box-shadow: 0 4px 10px rgba(128, 90, 213, 0.2);
  margin-bottom: 12px;
  opacity: 0.95;
`;

export const ReportIcon = styled.span`
  font-size: 18px;
`;

export const ReportText = styled.span`
  font-weight: 500;
  color: #e5e7eb;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 13px;
`;

export const ReportBadge = styled.span`
  background: #3f4a5e;
  padding: 3px 8px;
  border-radius: 24px;
  font-size: 11px;
  margin-left: 6px;
  border: 1px solid #5f6b80;
  display: inline-flex;
  align-items: center;
  gap: 3px;
`;

/* ======================
   BUTTON - УМЕНЬШЕН
====================== */
export const PrimaryButton = styled.button<{ $variant?: 'primary' | 'outline' }>`
  margin-top: 6px;
  padding: 12px 18px;
  width: 100%;
  border-radius: 40px;
  border: ${({ $variant }) => 
    $variant === 'outline' 
      ? '1.5px solid rgba(255,255,255,0.3)' 
      : 'none'};
  background: ${({ $variant }) => 
    $variant === 'outline' 
      ? 'transparent' 
      : '#fff'};
  color: ${({ $variant }) => 
    $variant === 'outline' 
      ? '#fff' 
      : '#0b0d10'};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $variant }) => 
      $variant === 'outline' 
        ? 'rgba(255,255,255,0.1)' 
        : '#e0e7ff'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ======================
   BADGES
====================== */
export const StatusBadge = styled.div<{ $place: number }>`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 8px;
  background: ${({ $place }) => {
    switch($place) {
      case 1: return 'linear-gradient(135deg, #FFD700, #FFA500)';
      case 2: return 'linear-gradient(135deg, #C0C0C0, #A0A0A0)';
      case 3: return 'linear-gradient(135deg, #CD7F32, #A0522D)';
      default: return 'rgba(255,255,255,0.1)';
    }
  }};
  color: ${({ $place }) => $place <= 3 ? '#000' : '#fff'};
  min-width: 24px;
  text-align: center;
`;

export const ChallengeTypeBadge = styled.div`
  font-size: 10px;
  opacity: 0.7;
  background: rgba(255,255,255,0.1);
  padding: 3px 8px;
  border-radius: 10px;
  display: inline-block;
  margin-top: 4px;
`;

/* ======================
   BOTTOM NAV
====================== */
export const BottomNav = styled.div`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 18px;
  height: 68px;
  background: rgba(0,0,0,0.9);
  border-radius: 34px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
`;

export const NavItem = styled.div<{ $active?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active }) =>
    $active ? 'rgba(255,255,255,0.15)' : 'transparent'};
  color: ${({ $active }) =>
    $active ? '#fff' : 'rgba(255,255,255,0.65)'};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'};
  }
`;

/* ======================
   INFO BUTTON & MODAL
====================== */
export const InfoButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`;

export const ModalContent = styled.div`
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 24px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 24px;
  position: relative;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #111;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 2px;
  }
`;

export const ModalClose = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1a1a1a;
  border: 1px solid #333;
  color: #fff;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    border-color: #666;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  padding-right: 32px;
`;

export const ModalDescription = styled.p`
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.5;
  margin-bottom: 24px;
`;

export const ModalSection = styled.div`
  margin-bottom: 24px;
`;

export const ModalSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const ModalSectionIcon = styled.span`
  font-size: 20px;
  opacity: 0.9;
`;

export const ModalSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.9;
`;

export const ModalSectionText = styled.p`
  font-size: 13px;
  opacity: 0.7;
  line-height: 1.5;
  margin-left: 28px;
`;

export const ModalList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0 28px;
`;

export const ModalListItem = styled.li`
  font-size: 13px;
  opacity: 0.7;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "—";
    color: #666;
    font-size: 14px;
  }
`;

export const ModalFooter = styled.div`
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #333;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.8;
`;

/* ======================
   SKELETON LOADING
====================== */
export const SkeletonCard = styled.div`
  background: #0a0a0a;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #222;
`;

export const SkeletonLine = styled.div<{ width?: string; height?: number }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || 16}px;
  background: #222;
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    animation: shimmer 1.5s infinite;
    transform: translateX(-100%);
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;

export const SkeletonBadge = styled.div<{ width?: number; height?: number }>`
  width: ${({ width }) => width || 40}px;
  height: ${({ height }) => height || 24}px;
  background: #222;
  border-radius: 20px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    animation: shimmer 1.5s infinite;
    transform: translateX(-100%);
  }
`;

export const SkeletonStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 16px 0;
`;

export const SkeletonProgress = styled.div`
  margin: 16px 0;
`;