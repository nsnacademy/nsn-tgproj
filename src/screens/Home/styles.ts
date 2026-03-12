import styled from 'styled-components';

/* ======================
   PAGE
====================== */
export const SafeArea = styled.div`
  height: 100vh;
  background: radial-gradient(circle at 70% 30%, #1e1b4b 0%, #0b0d10 70%);
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
  background: rgba(11,13,16,0.8);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #1f2937;
  z-index: 1000;
`;

export const HeaderSpacer = styled.div`
  height: env(safe-area-inset-top, 0px);
`;

export const Header = styled.div`
  padding: 80px 16px 0;
`;

export const StatusLabel = styled.div`
  font-size: 12px;
  opacity: 0.6;
  color: #9ca3af;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

export const StatusTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(145deg, #ffffff 0%, #b0b8ff 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 4px;
`;

/* ======================
   TABS
====================== */
export const Tabs = styled.div`
  display: flex;
  gap: 16px;
  padding: 6px 16px 12px;
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#fff' : '#9ca3af')};
  padding-bottom: 4px;
  border-bottom: ${({ $active }) =>
    $active ? '2px solid #a78bfa' : '2px solid transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

/* ======================
   SCROLL
====================== */
export const HeaderOffset = styled.div`
  height: 140px;
`;

export const HomeContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 40px 16px 100px;
  scrollbar-width: thin;
  scrollbar-color: #374151 transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #374151;
    border-radius: 4px;
  }
`;

export const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const EmptyText = styled.div`
  margin-top: 60px;
  text-align: center;
  font-size: 14px;
  color: #9ca3af;
  padding: 0 20px;
`;

/* ======================
   CARD - УЛЬТРА КОМПАКТНАЯ
====================== */
export const Card = styled.div`
  background: #1a1d24;
  border: 1px solid #2d313a;
  border-radius: 24px;
  padding: 14px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.5);
  transition: all 0.2s ease;

  &:hover {
    border-color: #6d28d9;
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.6);
  }
`;

export const CardHeader = styled.div`
  margin-bottom: 10px;
`;

export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.01em;
`;

export const ParticipantsBadge = styled.div`
  background: #2d3748;
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 500;
  color: #d1d5db;
  border: 1px solid #4b5563;
  white-space: nowrap;
`;

export const DayPercentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
`;

export const DayLabel = styled.span`
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
`;

export const DayValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin-left: 2px;
`;

export const PercentValue = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #a78bfa;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #2d3748;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #a78bfa, #c4b5fd);
  box-shadow: 0 0 6px rgba(167,139,250,0.5);
  border-radius: 6px;
  transition: width 0.3s ease;
`;

export const Divider = styled.div`
  height: 1px;
  background: #2d3748;
  margin: 10px 0;
`;

export const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
`;

export const StatIcon = styled.div<{ $variant: 'success' | 'warning' }>`
  width: 20px;
  height: 20px;
  background: ${({ $variant }) => $variant === 'success' ? '#10b981' : '#f59e0b'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #fff;
  flex-shrink: 0;
`;

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatMain = styled.span`
  font-size: 13px;
  color: #fff;
  font-weight: 500;
`;

export const StatSub = styled.span`
  font-size: 10px;
  color: #9ca3af;
  margin-top: 1px;
`;

export const ReportBlock = styled.div`
  background: #2d3748;
  border: 1px solid #4b5563;
  border-radius: 14px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

export const ReportIcon = styled.span`
  font-size: 16px;
  opacity: 0.8;
`;

export const ReportText = styled.span`
  font-size: 12px;
  color: #e5e7eb;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-weight: 500;
`;

export const ReportBadge = styled.span`
  background: #4b5563;
  padding: 2px 8px;
  border-radius: 30px;
  font-size: 10px;
  color: #fff;
  border: 1px solid #6b7280;
  margin-left: 4px;
`;

export const PrimaryButton = styled.button<{ $variant?: 'primary' | 'outline' }>`
  padding: 10px 16px;
  width: 100%;
  border-radius: 40px;
  border: ${({ $variant }) => 
    $variant === 'outline' 
      ? '1.5px solid #4b5563' 
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
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $variant }) => 
      $variant === 'outline' 
        ? 'rgba(255,255,255,0.05)' 
        : '#e0e7ff'};
    border-color: ${({ $variant }) => 
      $variant === 'outline' ? '#a5b4fc' : 'none'};
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
   BOTTOM NAV
====================== */
export const BottomNav = styled.div`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  height: 64px;
  background: rgba(11,13,16,0.9);
  backdrop-filter: blur(20px);
  border: 1px solid #2d3748;
  border-radius: 32px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
`;

export const NavItem = styled.div<{ $active?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active }) =>
    $active ? 'rgba(167,139,250,0.15)' : 'transparent'};
  color: ${({ $active }) =>
    $active ? '#a78bfa' : '#9ca3af'};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.05);
    color: #fff;
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

/* ======================
   BADGES
====================== */
export const StatusBadge = styled.div<{ $place: number }>`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
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
  min-width: 22px;
  text-align: center;
`;

export const ChallengeTypeBadge = styled.div`
  font-size: 9px;
  opacity: 0.7;
  background: rgba(255,255,255,0.1);
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
  margin-top: 4px;
`;

/* ======================
   INFO BUTTON & MODAL
====================== */
export const InfoButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: 1px solid #374151;
  color: #d1d5db;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #2d3748;
    border-color: #6d28d9;
    color: #fff;
  }
`;

export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
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
  background: #1a1d24;
  border: 1px solid #2d3748;
  border-radius: 24px;
  width: 90%;
  max-width: 380px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
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
  top: 14px;
  right: 14px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2d3748;
  border: 1px solid #4b5563;
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #374151;
    border-color: #6d28d9;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
  padding-right: 28px;
  background: linear-gradient(145deg, #ffffff, #b0b8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const ModalDescription = styled.p`
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.5;
  margin-bottom: 20px;
`;

export const ModalSection = styled.div`
  margin-bottom: 20px;
`;

export const ModalSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const ModalSectionIcon = styled.span`
  font-size: 18px;
  color: #a78bfa;
`;

export const ModalSectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #fff;
`;

export const ModalSectionText = styled.p`
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.5;
  margin-left: 26px;
`;

export const ModalList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 6px 0 0 26px;
`;

export const ModalListItem = styled.li`
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: "—";
    color: #4b5563;
    font-size: 12px;
  }
`;

export const ModalFooter = styled.div`
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid #2d3748;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #d1d5db;
`;

/* ======================
   SKELETON LOADING
====================== */
export const SkeletonCard = styled.div`
  background: #1a1d24;
  border-radius: 24px;
  padding: 14px;
  margin-bottom: 14px;
  border: 1px solid #2d313a;
`;

export const SkeletonLine = styled.div<{ width?: string; height?: number }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || 14}px;
  background: #2d3748;
  border-radius: 6px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
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
  width: ${({ width }) => width || 36}px;
  height: ${({ height }) => height || 20}px;
  background: #2d3748;
  border-radius: 16px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    animation: shimmer 1.5s infinite;
    transform: translateX(-100%);
  }
`;

export const SkeletonStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 12px 0;
`;

export const SkeletonProgress = styled.div`
  margin: 12px 0;
`;