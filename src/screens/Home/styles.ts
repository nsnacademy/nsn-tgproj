import styled from 'styled-components';

/* SAFE AREA */
export const SafeArea = styled.div`
  min-height: 100vh;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
`;

/* ОСНОВНОЙ КОНТЕНТ */
export const HomeContainer = styled.div`
  min-height: 100vh;
  padding: 70px 16px 140px; /* ⬅️ место под floating nav */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  max-width: 720px;
  margin: 0 auto;
`;

/* HEADER */
export const Header = styled.div`
  margin-bottom: 20px;
`;

export const StatusLabel = styled.div`
  font-size: 14px;
  color: #8e8e93;
  margin-bottom: 8px;
`;

export const StatusTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #000;
`;

/* TABS */
export const Tabs = styled.div`
  display: flex;
  gap: clamp(24px, 6vw, 32px);
  margin-bottom: 32px;
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? '#000' : '#8e8e93')};
`;

/* CONTENT */
export const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const EmptyText = styled.div`
  font-size: 15px;
  color: #8e8e93;
  text-align: center;
  line-height: 1.4;
  max-width: 280px;
`;

/* FLOATING NAV (КАК НА СКРИНЕ) */
export const FloatingNav = styled.div`
  position: fixed;
  left: 50%;
  bottom: calc(15px + env(safe-area-inset-bottom));
  transform: translateX(-50%);

  width: calc(100% - 20px);
  max-width: 420px;
  height: 72px;

  background: #fbfbfb;
  border-radius: 36px;

  display: flex;
  justify-content: space-around;
  align-items: center;

  
`;

/* NAV ITEMS */
export const NavItem = styled.div<{ $active?: boolean }>`
  width: 44px;
  height: 44px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 22px;
  color: ${({ $active }) => ($active ? '#000' : '#8e8e93')};
`;

/* ICON */
export const NavIcon = styled.div`
  font-size: 22px;
  line-height: 1;
`;