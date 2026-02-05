import styled from 'styled-components';

/* === PAGE === */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

/* === CONTENT === */
export const HomeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 95px 20px 140px;
`;

/* === HEADER === */
export const Header = styled.div`
  margin-bottom: 24px;
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
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 14px;
  padding-bottom: 6px;
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  border-bottom: ${({ $active }) =>
    $active ? '2px solid #fff' : '2px solid transparent'};
`;

/* === CENTER === */
export const CenterWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

/* === EMPTY TEXT === */
export const EmptyText = styled.div`
  font-size: 16px;
  line-height: 1.45;
  opacity: 0.85;
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

  /* цвет для SVG */
  color: ${({ $active }) =>
    $active ? '#ffffff' : 'rgba(255,255,255,0.65)'};

  transition: color 0.2s ease;

  /* INLINE SVG */
  svg {
    width: 28px;
    height: 28px;

    /* 👇 ACTIVE SCALE — ЧУТЬ БОЛЬШЕ */
    transform: scale(${({ $active }) => ($active ? 1.08 : 1)});

    transition:
      transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity 0.15s ease;
  }

  /* TAP — мягкий iOS */
  &:active svg {
    transform: scale(0.92);
    opacity: 0.7;
  }
`;
