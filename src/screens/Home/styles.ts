import styled from 'styled-components';

/* ======================
   COLORS — ТОЧНО КАК В HTML
====================== */
const colors = {
  bg: '#0b0f1c',
  bgCard: 'linear-gradient(180deg, #1b2437, #1a2234)',
  bgElement: '#3a4254',
  bgDivider: '#394050',
  accentGradient: 'linear-gradient(90deg, #7a6bff, #b48cff)',
  success: '#1dbf73',
  warning: '#f5b300',
  text: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.9)',
  reportBg: '#3a4254',
};

/* ======================
   PAGE
====================== */
export const SafeArea = styled.div`
  height: 100vh;
  background: ${colors.bg};
  color: ${colors.text};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/* ======================
   FIXED HEADER
====================== */
export const FixedHeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${colors.bg};
  z-index: 1000;
`;

export const HeaderSpacer = styled.div`
  height: env(safe-area-inset-top, 0px);
`;

export const Header = styled.div`
  padding: 95px 20px 0;
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

/* ======================
   INFO BUTTON
====================== */
export const InfoButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

/* ======================
   TABS
====================== */
export const Tabs = styled.div`
  display: flex;
  gap: 18px;
  padding: 7px 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 14px;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  padding-bottom: 6px;
  transition: all 0.2s ease;
  border-bottom: ${({ $active }) =>
    $active ? '2px solid #fff' : '2px solid transparent'};

  &:hover {
    opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  }
`;

/* ======================
   SCROLL
====================== */
export const HeaderOffset = styled.div`
  height: 170px;
`;

export const HomeContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 60px 20px 120px;
`;

export const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const EmptyText = styled.div`
  margin-top: 60px;
  text-align: center;
  font-size: 14px;
  opacity: 0.6;
  padding: 0 20px;
`;

/* ======================
   CARD — ТОЧНАЯ КОПИЯ ИЗ HTML
====================== */
export const Card = styled.div`
  width: 100%;
  padding: 28px;
  border-radius: 26px;
  background: ${colors.bgCard};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  color: ${colors.text};
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Participants = styled.div`
  background: ${colors.bgElement};
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${colors.bgElement};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 22px;
`;

export const Progress = styled.div`
  height: 100%;
  background: ${colors.accentGradient};
  border-radius: 10px;
  transition: width 0.3s ease;
`;

export const DayRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  margin-bottom: 18px;
`;

export const Day = styled.div`
  font-weight: 500;
`;

export const Percent = styled.div`
  opacity: 0.9;
`;

export const Divider = styled.div`
  height: 1px;
  background: ${colors.bgDivider};
  margin: 18px 0;
`;

export const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

export const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  flex: 1;
`;

export const Icon = styled.span`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 16px;
  flex-shrink: 0;

  &.done {
    background: ${colors.success};
    color: white;
  }

  &.review {
    background: ${colors.warning};
    color: white;
  }
`;

export const StatText = styled.span`
  font-size: 18px;
  font-weight: 500;
`;

export const Report = styled.div`
  background: ${colors.reportBg};
  padding: 16px 20px;
  border-radius: 18px;
  font-size: 18px;
  opacity: 0.95;
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* ======================
   BOTTOM NAV — ИЗ ПРЕДЫДУЩЕГО КОДА
====================== */
export const BottomNav = styled.div`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 18px;
  height: 68px;
  background: rgba(0,0,0,0.9);
  border-radius: 34px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
`;

export const NavItem = styled.div<{ $active?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active }) => $active ? 'rgba(255,255,255,0.15)' : 'transparent'};
  color: ${({ $active }) => $active ? '#fff' : 'rgba(255,255,255,0.65)'};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${({ $active }) => $active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'};
  }
`;

/* ======================
   MODAL — ИЗ ПРЕДЫДУЩЕГО КОДА
====================== */
export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`;

export const ModalContent = styled.div`
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 24px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 24px;
  position: relative;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #111;
  }
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 2px;
  }
`;

export const ModalClose = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1a1a1a;
  border: 1px solid #333;
  color: #fff;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    border-color: #666;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  padding-right: 32px;
`;

export const ModalDescription = styled.p`
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.5;
  margin-bottom: 24px;
`;

export const ModalSection = styled.div`
  margin-bottom: 24px;
`;

export const ModalSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const ModalSectionIcon = styled.span`
  font-size: 20px;
  opacity: 0.9;
`;

export const ModalSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.9;
`;

export const ModalSectionText = styled.p`
  font-size: 13px;
  opacity: 0.7;
  line-height: 1.5;
  margin-left: 28px;
`;

export const ModalList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0 28px;
`;

export const ModalListItem = styled.li`
  font-size: 13px;
  opacity: 0.7;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "—";
    color: #666;
    font-size: 14px;
  }
`;

export const ModalFooter = styled.div`
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #333;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.8;
`;