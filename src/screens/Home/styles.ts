import styled from 'styled-components';

/* === PAGE === */
export const SafeArea = styled.div`
  height: 100vh;
  overflow: hidden;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
`;

/* === FIXED HEADER WRAPPER === */
export const FixedHeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #000;
`;

/* === HEADER SPACER === */
export const HeaderSpacer = styled.div`
  height: env(safe-area-inset-top, 0px);
  background: #000;
`;

/* === BOTTOM NAV SPACER === */
/* Больше не нужен — скролл теперь ограничен правильно */
export const BottomNavSpacer = styled.div`
  display: none;
`;

/* === CONTENT === */
export const HomeContainer = styled.div`
  position: relative;
  height: calc(100vh - 140px - 100px);
  /* 140px — фиксированный header
     100px — bottom nav + safe area */

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  padding: 0 20px;
  margin-top: 140px;
`;

/* === HEADER === */
export const Header = styled.div`
  padding: 100px 20px 0 20px;
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

/* === TABS === */
export const Tabs = styled.div`
  display: flex;
  gap: 18px;
  padding: 15px 20px;
  background: #000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 14px;
  padding-bottom: 6px;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  border-bottom: ${({ $active }) =>
    $active ? '2px solid #fff' : '2px solid transparent'};
`;

/* === CENTER === */
export const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 20px;
`;

/* === EMPTY TEXT === */
export const EmptyText = styled.div`
  margin-top: 40px;
  font-size: 16px;
  line-height: 1.45;
  opacity: 0.85;
  text-align: center;
`;

/* =============================== */
/* === CARDS === */
/* =============================== */

export const Card = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.02)
  );
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
`;

/* === CARD STRUCTURE === */

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
  font-size: 13px;
  opacity: 0.6;
`;

/* === LABELS === */

export const CardLabel = styled.div`
  font-size: 11px;
  opacity: 0.45;
  margin-top: 10px;
`;

export const CardValue = styled.div`
  font-size: 14px;
  opacity: 0.85;
`;

/* === PROGRESS === */

export const ProgressWrapper = styled.div`
  margin-top: 14px;
`;

export const ProgressBar = styled.div`
  height: 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: #ffffff;
  border-radius: 10px;
`;

export const ProgressText = styled.div`
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.65;
`;

/* === BUTTON === */

export const PrimaryButton = styled.button`
  margin-top: 14px;
  align-self: flex-start;
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  background: #ffffff;
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

/* === BOTTOM NAV === */
export const BottomNav = styled.div`
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
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

/* === NAV ITEM === */
export const NavItem = styled.div<{ $active?: boolean }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  color: ${({ $active }) =>
    $active ? '#ffffff' : 'rgba(255,255,255,0.65)'};
  transition: color 0.2s ease;

  svg {
    width: 28px;
    height: 28px;
    transform: scale(${({ $active }) => ($active ? 1.3 : 1)});
    transform-origin: center;
    transition:
      transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity 0.15s ease;
  }

  &:active svg {
    transform: scale(0.9);
    opacity: 0.7;
  }
`;
