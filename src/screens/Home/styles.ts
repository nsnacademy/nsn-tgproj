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
  padding: 90px 20px 0;
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
  padding: 14px 20px 16px;
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
  padding: 20px 20px 120px;
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
   CARD
====================== */
export const Card = styled.div`
  background: rgba(255,255,255,0.06);
  border-radius: 22px;
  padding: 18px 20px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.45);
  border: 1px solid rgba(255,255,255,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  }
`;

export const CardHeader = styled.div`
  margin-bottom: 12px;
`;

export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  flex: 1;
`;

/* ======================
   STATS
====================== */
export const CardStats = styled.div`
  display: flex;
  gap: 16px;
  margin: 14px 0;
  padding: 12px 0;
  border-top: 1px solid rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.08);
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

export const StatValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  opacity: 0.9;
`;

export const StatLabel = styled.div`
  font-size: 11px;
  opacity: 0.5;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ======================
   PROGRESS
====================== */
export const ProgressWrapper = styled.div`
  margin: 16px 0;
`;

export const ProgressHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProgressBar = styled.div`
  height: 8px;
  border-radius: 10px;
  background: rgba(255,255,255,0.12);
  overflow: hidden;
  margin: 4px 0;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.9) 100%);
  box-shadow: 0 0 8px rgba(255,255,255,0.4);
  border-radius: 10px;
  transition: width 0.3s ease;
`;

export const ProgressText = styled.div<{ $highlight?: boolean }>`
  font-size: 13px;
  opacity: ${({ $highlight }) => ($highlight ? 0.9 : 0.65)};
  font-weight: ${({ $highlight }) => ($highlight ? 600 : 400)};
`;

export const DaysInfo = styled.div`
  font-size: 12px;
  opacity: 0.5;
  margin-top: 4px;
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
      default: return 'rgba(255,255,255,0.1)';
    }
  }};
  color: ${({ $place }) => $place <= 3 ? '#000' : '#fff'};
  min-width: 28px;
  text-align: center;
`;

export const ChallengeTypeBadge = styled.div`
  font-size: 11px;
  opacity: 0.7;
  background: rgba(255,255,255,0.1);
  padding: 4px 10px;
  border-radius: 12px;
  display: inline-block;
  margin-top: 4px;
`;

/* ======================
   BUTTON
====================== */
export const PrimaryButton = styled.button<{ $variant?: 'primary' | 'outline' }>`
  margin-top: 14px;
  padding: 12px 20px;
  width: 100%;
  
  border-radius: 14px;
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
      : '#000'};
  
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $variant }) => 
      $variant === 'outline' 
        ? 'rgba(255,255,255,0.1)' 
        : 'rgba(255,255,255,0.9)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
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

