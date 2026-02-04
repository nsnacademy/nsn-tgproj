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
  padding: 44px 20px 140px;
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

  height: 64px;
  background: #ffffff;
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
    opacity: ${({ $active }) => ($active ? 1 : 0.45)};
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  &:active img {
    opacity: 0.25;
    transform: scale(0.9);
  }
`;