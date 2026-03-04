import styled from 'styled-components';

/* =========================
   LAYOUT
========================= */

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
  position: relative;
  overflow: hidden;
`;

/* =========================
   FIXED HEADER
========================= */

export const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #000;
  padding: 60px 20px 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

export const HeaderTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 4px 0;
`;

export const HeaderSubtitle = styled.p`
  font-size: 14px;
  opacity: 0.6;
  margin: 0;
`;

export const ToggleContainer = styled.div`
  flex-shrink: 0;
`;

export const Toggle = styled.div<{ $active: boolean }>`
  width: 52px;
  height: 28px;
  border-radius: 34px;
  background: ${({ $active }) =>
    $active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const ToggleKnob = styled.div<{ $active: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#fff' : 'rgba(255, 255, 255, 0.5)')};
  position: absolute;
  top: 1px;
  left: ${({ $active }) => ($active ? '26px' : '2px')};
  transition: left 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

/* =========================
   SCROLL CONTENT
========================= */

export const ScrollContent = styled.div`
  flex: 1;
  margin-top: 210px; /* Высота фиксированного хедера (60px + 150px статистики) */
  margin-bottom: 20px;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
`;

/* =========================
   STATS CARD
========================= */

export const StatsCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  opacity: 0.95;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 11px;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* =========================
   CHALLENGE GRID
========================= */

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

export const ChallengeGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ChallengeCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const CardMeta = styled.div`
  font-size: 12px;
  opacity: 0.5;
`;

export const PendingBadge = styled.div`
  min-width: 28px;
  height: 28px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
`;

export const CardStats = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const CardStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CardStatValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  opacity: 0.95;
`;

export const CardStatLabel = styled.div`
  font-size: 10px;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* =========================
   CARD BADGES
========================= */

export const CardBadges = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const BadgeItem = styled.div<{ $type: 'report' | 'request' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 20px;
  background: ${({ $type }) => 
    $type === 'report' 
      ? 'rgba(64, 158, 255, 0.15)' 
      : 'rgba(255, 184, 0, 0.15)'};
  border: 1px solid ${({ $type }) => 
    $type === 'report' 
      ? 'rgba(64, 158, 255, 0.3)' 
      : 'rgba(255, 184, 0, 0.3)'};
`;

export const BadgeIcon = styled.span`
  font-size: 12px;
`;

export const BadgeText = styled.span`
  font-size: 11px;
  font-weight: 500;
  opacity: 0.9;
`;

/* =========================
   CARD ACTIONS
========================= */

export const CardActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  height: 40px;
  border-radius: 10px;
  border: ${({ variant }) => 
    variant === 'secondary' 
      ? '1px solid rgba(255, 255, 255, 0.2)' 
      : 'none'};
  background: ${({ variant }) => 
    variant === 'secondary' 
      ? 'transparent' 
      : 'rgba(255, 255, 255, 0.1)'};
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ variant }) => 
      variant === 'secondary' 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

/* =========================
   EMPTY STATE
========================= */

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.3);
`;

export const EmptyText = styled.div`
  font-size: 15px;
  opacity: 0.5;
  line-height: 1.5;
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 14px;
  opacity: 0.6;
`;

/* =========================
   BOTTOM NAV (импортируется из Home/styles)
========================= */
// BottomNav и NavItem импортируются из Home/styles