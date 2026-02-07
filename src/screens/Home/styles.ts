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
  padding: 100px 20px 140px;
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
  margin-bottom: 20px;
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 14px;
  padding-bottom: 6px;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  border-bottom: ${({ $active }) =>
    $active ? '2px solid #fff' : '2px solid transparent'};
`;

/* === CENTER LIST === */
export const CenterWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  display: flex;
  flex-direction: column;
  gap: 16px;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

/* === EMPTY === */
export const EmptyText = styled.div`
  margin-top: 40px;
  font-size: 16px;
  line-height: 1.45;
  opacity: 0.85;
  text-align: center;
`;

/* === CARD === */
export const Card = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.06),
    rgba(255,255,255,0.02)
  );

  border-radius: 22px;
  padding: 18px 20px;
  height: 190px;

  display: flex;
  flex-direction: column;

  border: 1px solid rgba(255,255,255,0.06);

  transform-origin: center;
  will-change: transform, opacity;

  transition:
    transform 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease;
`;


export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.div`
  font-size: 17px;
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
  background: rgba(255,255,255,0.15);
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
  margin-top: auto;
  align-self: flex-start;

  padding: 10px 16px;
  border-radius: 12px;
  border: none;

  background: #ffffff;
  color: #000;

  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

/* === NAV === */
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

export const NavItem = styled.div<{ $active?: boolean }>`
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  color: ${({ $active }) =>
    $active ? '#fff' : 'rgba(255,255,255,0.65)'};

  svg {
    width: 28px;
    height: 28px;
  }
`;
