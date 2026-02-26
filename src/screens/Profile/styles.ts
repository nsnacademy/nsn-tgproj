import styled from 'styled-components';

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
  flex: 1;
  padding: 60px 0 100px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  margin-bottom: 8px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const AdminToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

export const ProfileImage = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 24px;
  background: linear-gradient(135deg, #6e45e2, #88d3ce);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 28px;
  color: white;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(110, 69, 226, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ProfileName = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

export const ProfileUsername = styled.div`
  font-size: 14px;
  color: rgba(255,255,255,0.5);
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 24px 20px;
`;

export const StatCard = styled.div`
  background: rgba(255,255,255,0.03);
  border-radius: 20px;
  padding: 16px 12px;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
`;

export const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  background: linear-gradient(135deg, #fff, rgba(255,255,255,0.7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const StatLabel = styled.div`
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const MenuSection = styled.div`
  padding: 24px 20px;
`;

export const MenuTitle = styled.div`
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 12px;
  padding-left: 8px;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255,255,255,0.02);
  border-radius: 16px;
  margin-bottom: 8px;
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
  }
`;

export const MenuItemIcon = styled.div`
  font-size: 20px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
`;

export const MenuItemLabel = styled.div`
  flex: 1;
  font-size: 15px;
  font-weight: 500;
`;

export const MenuItemBadge = styled.div`
  background: rgba(110, 69, 226, 0.2);
  color: #6e45e2;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

export const MenuItemArrow = styled.div`
  color: rgba(255,255,255,0.3);
  font-size: 20px;
  margin-left: 8px;
`;

export const LogoutButton = styled.div`
  margin: 32px 20px;
  padding: 16px;
  background: rgba(255,59,48,0.1);
  border: 1px solid rgba(255,59,48,0.2);
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255,59,48,0.15);
    border-color: rgba(255,59,48,0.3);
  }
`;

export const LogoutText = styled.div`
  color: #ff3b30;
  font-size: 15px;
  font-weight: 600;
`;

/* TOGGLE — НЕ ТРОГАЕМ */
export const Toggle = styled.div<{
  $active: boolean;
  $disabled?: boolean;
}>`
  width: 46px;
  height: 26px;
  border-radius: 13px;
  background: ${({ $active }) =>
    $active ? '#fff' : 'rgba(255,255,255,0.3)'};
  position: relative;
  cursor: ${({ $disabled }) =>
    $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) =>
    $disabled ? 0.4 : 1};
  transition: all 0.2s ease;
`;

export const ToggleKnob = styled.div<{ $active: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #000;
  position: absolute;
  top: 2px;
  left: ${({ $active }) => ($active ? '22px' : '2px')};
  transition: all 0.2s ease;
`;