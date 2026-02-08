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

/* === FIXED HEADER === */
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
  padding: 100px 20px 0;
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
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 14px;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  border-bottom: ${({ $active }) =>
    $active ? '2px solid #fff' : '2px solid transparent'};
`;

/* ===============================
   SCROLL CONTAINER (NO FADE)
=============================== */
export const HomeContainer = styled.div`
  position: relative;

  margin-top: 115px;
  height: calc(115vh - 305px - 100px);

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  padding: 90px 30px 70px;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

/* === LIST === */
export const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

/* === EMPTY === */
export const EmptyText = styled.div`
  margin-top: 40px;
  text-align: center;
  opacity: 0.7;
`;

/* ===============================
   CARD (NO GRADIENT)
=============================== */
export const Card = styled.div<{ $focused?: boolean }>`
  background: rgba(255,255,255,0.04);

  border-radius: 22px;
  padding: 18px 20px;

  transform-origin: center;
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.28s ease,
    box-shadow 0.28s ease;

  transform: ${({ $focused }) =>
    $focused ? 'scale(1.06)' : 'scale(0.92)'};

  opacity: ${({ $focused }) => ($focused ? 1 : 0.45)};

  box-shadow: ${({ $focused }) =>
    $focused ? '0 24px 60px rgba(0,0,0,0.65)' : 'none'};
`;

/* === CARD CONTENT === */
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
  background: rgba(255,255,255,0.15);
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: #fff;
`;

export const ProgressText = styled.div`
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.65;
`;

/* === BUTTON === */
export const PrimaryButton = styled.button`
  margin-top: 14px;
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  background: #fff;
  color: #000;
  font-weight: 500;
`;

/* ===============================
   BOTTOM NAV
=============================== */
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

  transition:
    transform 0.25s ease,
    opacity 0.2s ease;

  transform: ${({ $hidden }) =>
    $hidden ? 'translateY(120%)' : 'translateY(0)'};

  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
`;

export const NavItem = styled.div<{ $active?: boolean }>`
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  user-select: none;

  color: ${({ $active }) =>
    $active ? '#fff' : 'rgba(255,255,255,0.65)'};

  svg {
    width: 28px;
    height: 28px;
    transform: scale(${({ $active }) => ($active ? 1.3 : 1)});
    transition: transform 0.2s ease;
  }
`;
