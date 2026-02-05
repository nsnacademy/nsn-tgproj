import styled from 'styled-components';

/* === PAGE === */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  padding-top: 60px;
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
  height: 44px;
  background: #ffffff;
  border-radius: 22px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0 16px;
`;

/* === SEARCH ICON (LEFT) === */
export const SearchIcon = styled.img`
  width: 18px;
  height: 18px;
  opacity: 0.5;
`;

/* === SEARCH TEXT === */
export const SearchText = styled.div`
  font-size: 16px;
  color: #000;
  opacity: 0.5;
`;

/* === RIGHT ROUND BUTTON === */
export const ActionButton = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
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

  height: 64px;
  background: #000000ff;
  border-radius: 32px;

  display: flex;
  align-items: center;
  justify-content: space-around;
`;

/* === NAV ITEM === */
export const NavItem = styled.div<{ $active?: boolean }>`
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  img {
  width: 22px;
  height: 22px;

  /* делаем SVG белыми */
  filter: invert(1);

  opacity: ${({ $active }) => ($active ? 1 : 0.45)};
  transition: opacity 0.15s ease, transform 0.15s ease;
}


  &:active img {
    opacity: 0.25;
    transform: scale(0.9);
  }
`;