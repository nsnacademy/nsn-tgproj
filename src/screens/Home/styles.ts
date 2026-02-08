import styled from 'styled-components';

/* === PAGE === */
export const SafeArea = styled.div`
  height: 100vh;
  overflow: hidden;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
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

/* === CONTENT === */
export const HomeContainer = styled.div`
  margin-top: 205px;
  height: calc(100vh - 205px - 100px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 20px;
`;

export const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;
`;

export const EmptyText = styled.div`
  margin-top: 40px;
  text-align: center;
  opacity: 0.8;
`;

/* === CARD (FOCUSED MAGIC) === */
export const Card = styled.div<{ $focused?: boolean }>`
  background: linear-gradient(
    180deg,
    rgba(255,255,255, ${({ $focused }) => ($focused ? 0.12 : 0.06)}),
    rgba(255,255,255,0.02)
  );

  border-radius: 20px;
  padding: 18px 20px;

  transform: scale(${({ $focused }) => ($focused ? 1.05 : 0.96)});
  opacity: ${({ $focused }) => ($focused ? 1 : 0.55)};

  box-shadow: ${({ $focused }) =>
    $focused
      ? '0 20px 60px rgba(0,0,0,0.6)'
      : '0 6px 16px rgba(0,0,0,0.25)'};

  transition:
    transform 0.35s cubic-bezier(0.2,0.8,0.2,1),
    opacity 0.25s ease,
    box-shadow 0.35s cubic-bezier(0.2,0.8,0.2,1);
`;

export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
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
`;

export const ProgressWrapper = styled.div`
  margin-top: 14px;
`;

export const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
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

export const PrimaryButton = styled.button`
  margin-top: 14px;
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  background: #fff;
  color: #000;
`;

/* === BOTTOM NAV === */
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
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
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
    $active ? '#fff' : 'rgba(255,255,255,0.65)'};

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
