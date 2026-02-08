import styled from 'styled-components';

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;

export const FixedHeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #000;
  z-index: 10;
`;

export const HeaderSpacer = styled.div`
  height: env(safe-area-inset-top, 0px);
`;

export const HomeContainer = styled.div`
  margin-top: 140px;
  padding: 0 20px;
  overflow-y: auto;
  height: calc(100vh - 140px);
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

export const Tabs = styled.div`
  display: flex;
  gap: 18px;
  padding: 14px 20px;
`;

export const Tab = styled.div<{ $active?: boolean }>`
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  border-bottom: ${({ $active }) =>
    $active ? '2px solid #fff' : 'none'};
`;

export const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 160px 0;
`;

export const EmptyText = styled.div`
  text-align: center;
  opacity: 0.7;
`;

export const Card = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.06),
    rgba(255,255,255,0.02)
  );
  border-radius: 18px;
  padding: 16px 18px;
  transition:
    transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.25s ease,
    box-shadow 0.25s ease,
    border 0.25s ease;
  will-change: transform;
`;

export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CardTitle = styled.div`
  font-weight: 600;
`;

export const CardRank = styled.div`
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
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: #fff;
  border-radius: 10px;
`;

export const ProgressText = styled.div`
  font-size: 13px;
  opacity: 0.6;
`;

export const PrimaryButton = styled.button`
  margin-top: 14px;
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
`;

export const BottomNavSpacer = styled.div`
  height: 120px;
`;

export const BottomNav = styled.div`
  position: fixed;
  bottom: 18px;
  left: 16px;
  right: 16px;
  height: 68px;
  background: #000;
  border-radius: 34px;
  display: flex;
  justify-content: space-around;
`;

export const NavItem = styled.div<{ $active?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;
