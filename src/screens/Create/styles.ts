import styled from 'styled-components';

/* === PAGE === */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;

  padding-top: 100px;
  padding-bottom: 110px; /* ⬅ место под BottomNav */

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;


/* === TOP BAR === */
export const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
`;

/* === SEARCH FIELD === */
export const SearchField = styled.div<{ $active?: boolean }>`
  flex: 1;
  height: 36px;
  background: #fff;
  border-radius: 18px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0 12px;
  color: #000;

  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;

  box-shadow: ${({ $active }) =>
    $active ? '0 4px 14px rgba(0,0,0,0.25)' : 'none'};

  transform: ${({ $active }) =>
    $active ? 'scale(1.03)' : 'scale(1)'};

  svg:first-child {
    opacity: 0.5;
  }
`;

/* === INPUT === */
export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;

  font-size: 15px;
  color: #000;

  &::placeholder {
    color: rgba(0,0,0,0.5);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  &:focus::placeholder {
    opacity: 0;
    transform: translateX(4px);
  }
`;

/* === CLEAR BUTTON === */
export const ClearButton = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  color: rgba(0,0,0,0.5);

  transition: opacity 0.15s ease, transform 0.15s ease;

  &:active {
    transform: scale(0.85);
    opacity: 0.6;
  }
`;

/* === ACTION BUTTON === */
export const ActionButton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #000;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }

  &:active {
    transform: scale(0.9);
  }
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


/* === LIST === */
export const List = styled.div`
  padding: 0 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/* === CARD === */
export const Card = styled.div`
  background: #0b0b0b;
  border-radius: 18px;
  padding: 14px 16px;
  border: 1px solid #222;
`;

/* === HEADER === */
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

/* === TITLE === */
export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

/* === META === */
export const CardMeta = styled.div`
  font-size: 13px;
  opacity: 0.6;
  margin-top: 2px;
`;

/* === ROW === */
export const CardRow = styled.div`
  font-size: 14px;
  margin-top: 6px;
  opacity: 0.85;
`;

/* === STATUS === */
export const Status = styled.div`
  font-size: 13px;
  opacity: 0.6;
`;

/* === MORE === */
export const MoreButton = styled.button`
  margin-top: 10px;
  background: none;
  border: none;
  color: #6aa9ff;
  cursor: pointer;
  padding: 0;
`;
