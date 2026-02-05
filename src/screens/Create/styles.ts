import styled from 'styled-components';

/* === PAGE === */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding-top: 100px;
`;

/* === TOP BAR === */
export const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
`;

/* === SEARCH FIELD === */
export const SearchField = styled.div`
  flex: 1;
  height: 30px;
  background: #fff;
  border-radius: 22px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0 16px;

  color: #000;
`;

/* === SEARCH TEXT === */
export const SearchText = styled.div`
  font-size: 16px;
  opacity: 0.5;
`;

/* === ACTION BUTTON === */
export const ActionButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #000;
  cursor: pointer;

  svg {
    width: 22px;
    height: 22px;
  }

  &:active {
    transform: scale(0.92);
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
    width: 35px;
    height: 35px;

    transform: scale(${({ $active }) => ($active ? 1.08 : 1)});

    transition:
      transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity 0.15s ease;
  }

  &:active svg {
    transform: scale(0.92);
    opacity: 0.7;
  }
`;
