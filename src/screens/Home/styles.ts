import styled, { keyframes } from 'styled-components';

// Анимации из HTML примера
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* === PAGE === */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

/* === STATUS BAR === */
export const StatusBar = styled.div`
  padding: 8px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  font-size: 14px;
  opacity: 0.9;
`;

export const Time = styled.div`
  font-weight: 600;
`;

export const StatusIcons = styled.div`
  display: flex;
  gap: 6px;
`;

/* === CONTENT === */
export const HomeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px 140px;
`;

/* === HEADER === */
export const Header = styled.div`
  padding: 12px 0 20px;
`;

export const StatusLabel = styled.div`
  font-size: 14px;
  opacity: 0.6;
`;

export const StatusTitle = styled.div`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

/* === TABS === */
export const Tabs = styled.div`
  display: flex;
  gap: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
`;

export const Tab = styled.div<{ $active?: boolean }>`
  padding: 0 0 12px;
  font-size: 15px;
  font-weight: 500;
  color: ${({ $active }) => $active ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'};
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #fff;
    opacity: ${({ $active }) => $active ? 1 : 0};
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

/* === CENTER === */
export const CenterWrapper = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

export const List = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 160px 0 120px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

/* === FADES (эффекты затемнения) === */
export const FadeTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, #000, transparent);
  pointer-events: none;
  z-index: 10;
`;

export const FadeBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to top, #000, transparent);
  pointer-events: none;
  z-index: 10;
`;

/* === EMPTY TEXT === */
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
    rgba(255,255,255,0.08),
    rgba(255,255,255,0.02)
  );
  border-radius: 24px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transform-origin: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: calc(100% - 40px);
  margin: 12px auto;

  &:hover::before {
    opacity: 0.2;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

export const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

/* === CARD HEADER === */
export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  flex: 1;
`;

export const CardRank = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
`;

/* === CARD DETAILS === */
export const Details = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 20px;
`;

export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DetailLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

export const DetailValue = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
`;

/* === PROGRESS === */
export const ProgressWrapper = styled.div`
  margin-top: 8px;
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const ProgressLabel = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
`;

export const ProgressPercentage = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

export const ProgressBar = styled.div`
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
  position: relative;
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: 3px;
  position: relative;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

/* === PARTICIPANTS === */
export const Participants = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

export const Avatars = styled.div`
  display: flex;
`;

export const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid #000;
  margin-left: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: #000;

  &:first-child {
    margin-left: 0;
  }
`;

export const ParticipantsCount = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
`;

/* === BUTTON === */
export const PrimaryButton = styled.button`
  margin-top: 16px;
  align-self: flex-start;
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  background: #ffffff;
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }

  &:active {
    background: rgba(255, 255, 255, 0.8);
    transform: translateY(0);
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