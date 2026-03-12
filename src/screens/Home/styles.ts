import styled from 'styled-components';

// Цветовая палитра NSNDSC в точности как в HTML
const colors = {
  bg: '#0b0f1c',
  bgCard: 'linear-gradient(180deg, #1b2437, #1a2234)',
  bgElement: '#3a4254',
  accent: '#a78bfa',
  accentLight: '#c4b5fd',
  accentGradient: 'linear-gradient(90deg, #a78bfa, #c4b5fd)',
  success: '#1dbf73',
  warning: '#f5b300',
  text: '#ffffff',
  textSecondary: '#b0b8c5',
  textMuted: '#9aa3b5',
  border: '#394050',
  reportBg: '#2a3346',
  reportBorder: '#4c3f6b',
  badgeBg: '#3f4a5e',
  badgeBorder: '#5f6b80',
};

/* ======================
   PAGE
====================== */
export const SafeArea = styled.div`
  height: 100vh;
  background: ${colors.bg};
  color: ${colors.text};
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
  background: ${colors.bg};
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
  color: ${colors.textSecondary};
`;

export const StatusTitle = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin-top: 4px;
  color: ${colors.text};
`;

/* ======================
   INFO BUTTON
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
    border-color: ${colors.accent};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

/* ======================
   TABS
====================== */
export const Tabs = styled.div`
  display: flex;
  gap: 18px;
  padding: 7px 20px 16px;
  border-bottom: 1px solid ${colors.border};
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 14px;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  padding-bottom: 6px;
  transition: all 0.2s ease;
  border-bottom: ${({ $active }) =>
    $active ? `2px solid ${colors.accent}` : '2px solid transparent'};
  color: ${({ $active }) => ($active ? colors.text : colors.textSecondary)};

  &:hover {
    opacity: 1;
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
  color: ${colors.textSecondary};
`;

/* ======================
   CARD — ТОЧНАЯ КОПИЯ ИЗ HTML
====================== */
export const Card = styled.div`
  width: 100%;
  padding: 28px;
  border-radius: 26px;
  background: ${colors.bgCard};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  color: ${colors.text};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Participants = styled.div`
  background: ${colors.bgElement};
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const DayPercentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
  font-size: 18px;
`;

export const DayLabel = styled.span`
  color: ${colors.textSecondary};
  font-weight: 500;
`;

export const DayValue = styled.span`
  font-weight: 700;
  color: ${colors.text};
  margin-left: 4px;
`;

export const PercentValue = styled.span`
  font-weight: 700;
  color: ${colors.accentLight};
  font-size: 22px;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${colors.bgElement};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 22px;
`;

export const Progress = styled.div`
  height: 100%;
  background: ${colors.accentGradient};
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(167,139,250,0.6);
  transition: width 0.3s ease;
`;

export const Divider = styled.div`
  height: 1px;
  background: ${colors.border};
  margin: 18px 0;
`;

export const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

export const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 500;
  flex: 1;
`;

export const Icon = styled.span`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 16px;
  flex-shrink: 0;

  &.done {
    background: ${colors.success};
    color: white;
  }

  &.review {
    background: ${colors.warning};
    color: white;
  }
`;

export const StatDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatMain = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  font-weight: 500;
  color: ${colors.text};

  strong {
    font-weight: 700;
  }
`;

export const StatSub = styled.div`
  font-size: 13px;
  color: ${colors.textMuted};
  margin-left: 0px;
  margin-top: 2px;
`;

export const Report = styled.div`
  background: ${colors.reportBg};
  padding: 16px 20px;
  border-radius: 18px;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${colors.reportBorder};
  box-shadow: 0 4px 14px rgba(128, 90, 213, 0.25);
  margin: 8px 0 16px;
`;

export const ReportIcon = styled.span`
  font-size: 24px;
`;

export const ReportText = styled.span`
  font-weight: 500;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  strong {
    color: white;
    font-weight: 700;
  }
`;

export const PhotoBadge = styled.span`
  background: ${colors.badgeBg};
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 14px;
  border: 1px solid ${colors.badgeBorder};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

/* ======================
   BADGES
====================== */
export const StatusBadge = styled.div<{ $place: number }>`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 10px;
  background: ${({ $place }) => {
    switch($place) {
      case 1: return 'linear-gradient(135deg, #FFD700, #FFA500)';
      case 2: return 'linear-gradient(135deg, #C0C0C0, #A0A0A0)';
      case 3: return 'linear-gradient(135deg, #CD7F32, #A0522D)';
      default: return colors.bgElement;
    }
  }};
  color: ${({ $place }) => $place <= 3 ? '#000' : colors.text};
  min-width: 28px;
  text-align: center;
`;

/* ======================
   BUTTON
====================== */
export const PrimaryButton = styled.button<{ $variant?: 'primary' | 'outline' }>`
  margin-top: 16px;
  padding: 14px 20px;
  width: 100%;
  border-radius: 60px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: ${({ $variant }) => 
    $variant === 'outline' ? `1.5px solid ${colors.bgElement}` : 'none'};
  background: ${({ $variant }) => 
    $variant === 'outline' ? 'transparent' : colors.text};
  color: ${({ $variant }) => 
    $variant === 'outline' ? colors.text : colors.bg};

  &:hover {
    background: ${({ $variant }) => 
      $variant === 'outline' ? `${colors.bgElement}80` : '#e0e7ff'};
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
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
  background: rgba(11, 15, 28, 0.9);
  border-radius: 34px;
  backdrop-filter: blur(20px);
  border: 1px solid ${colors.border};
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
  background: ${({ $active }) => $active ? `${colors.accent}20` : 'transparent'};
  color: ${({ $active }) => $active ? colors.accent : colors.textSecondary};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${({ $active }) => $active ? `${colors.accent}30` : `${colors.bgElement}40`};
  }
`;

/* ======================
   MODAL
====================== */
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
  background: ${colors.bgCard};
  border: 1px solid ${colors.border};
  border-radius: 24px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 24px;
  position: relative;
  animation: slideUp 0.3s ease;
  color: ${colors.text};

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
  background: ${colors.bgElement};
  border: 1px solid ${colors.border};
  color: ${colors.text};
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4a5568;
    border-color: ${colors.accent};
  }
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  padding-right: 32px;
  background: linear-gradient(145deg, #ffffff, ${colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const ModalDescription = styled.p`
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.5;
  margin-bottom: 24px;
  color: ${colors.textSecondary};
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
  color: ${colors.accent};
`;

export const ModalSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text};
`;

export const ModalSectionText = styled.p`
  font-size: 13px;
  opacity: 0.7;
  line-height: 1.5;
  margin-left: 28px;
  color: ${colors.textSecondary};
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
  color: ${colors.textSecondary};

  &::before {
    content: "—";
    color: ${colors.accent};
    font-size: 14px;
  }
`;

export const ModalFooter = styled.div`
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${colors.border};
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: ${colors.text};
`;

// Скелетон-стили
export const SkeletonCard = styled.div`
  background: ${colors.bgCard};
  border-radius: 26px;
  padding: 28px;
  margin-bottom: 18px;
  border: 1px solid ${colors.border};
`;

export const SkeletonLine = styled.div<{ width?: string; height?: number }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || 16}px;
  background: ${colors.bgElement};
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
  background: ${colors.bgElement};
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

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
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