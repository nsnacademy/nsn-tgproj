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
  position: relative;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 14px;
  cursor: pointer;

  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  padding-bottom: 6px;

  border-bottom: ${({ $active }) =>
    $active ? '2px solid #fff' : '2px solid transparent'};
`;

/* ======================
   SCROLL AREA
====================== */
export const HeaderOffset = styled.div`
  height: 170px;
  flex-shrink: 0;
`;

export const HomeContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 20px 20px 120px;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

/* ======================
   EMPTY
====================== */
export const EmptyText = styled.div`
  margin-top: 60px;
  text-align: center;
  font-size: 14px;
  opacity: 0.6;
`;

/* ======================
   CARD
====================== */
export const Card = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 22px;
  padding: 18px 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
`;

export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

export const CardRank = styled.div`
  font-size: 12px;
  opacity: 0.6;
`;

/* ======================
   PROGRESS COMMON
====================== */
export const ProgressWrapper = styled.div`
  margin-top: 14px;
`;

/* ===== RESULT MODE (LINE) ===== */
export const ProgressBar = styled.div`
  height: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: #fff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
`;

export const ProgressText = styled.div`
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.65;
`;

/* ===== SIMPLE MODE (DAYS / DOTS) ===== */

export const DotsProgress = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
  overflow: hidden;
`;

export const DayDot = styled.div<{ $done?: boolean }>`
  width: 9px;
  height: 9px;
  border-radius: 50%;

  background: ${({ $done }) =>
    $done ? '#fff' : 'rgba(255,255,255,0.18)'};

  box-shadow: ${({ $done }) =>
    $done ? '0 0 4px rgba(255,255,255,0.7)' : 'none'};
`;

export const DotsLabel = styled.div`
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.6;
`;

/* ======================
   BUTTON
====================== */
export const PrimaryButton = styled.button`
  margin-top: 14px;
  padding: 10px 16px;

  border-radius: 12px;
  border: none;

  background: #fff;
  color: #000;
  font-weight: 500;
  cursor: pointer;
`;

/* ======================
   BOTTOM NAV
====================== */
export const BottomNav = styled.div<{ $hidden?: boolean }>`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 18px;

  height: 68px;
  background: #000;
  border-radius: 34px;

  display: flex;
  align-items: center;
  justify-content: space-around;

  z-index: 1000;
`;

export const NavItem = styled.div<{ $active?: boolean }>`
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  color: ${({ $active }) =>
    $active ? '#fff' : 'rgba(255,255,255,0.65)'};
`;
