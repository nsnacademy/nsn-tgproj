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
  padding: 90px 20px 100px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Text = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  line-height: 1.5;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

export const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: linear-gradient(135deg, #6e45e2, #88d3ce);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const UserHandle = styled.div`
  font-size: 13px;
  color: rgba(255,255,255,0.4);
`;

export const IndexBadge = styled.div`
  background: rgba(255,215,0,0.1);
  border: 1px solid rgba(255,215,0,0.2);
  border-radius: 40px;
  padding: 12px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  font-size: 20px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 28px;
`;

export const StatItem = styled.div`
  background: rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 12px 4px;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 10px;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
`;

export const CalendarSection = styled.div`
  margin-bottom: 20px;
`;

export const MonthTitle = styled.div`
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  gap: 4px;
`;

export const DayDot = styled.div<{ $active: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${({ $active }) => 
    $active ? '#FFD700' : 'rgba(255,255,255,0.1)'
  };
  transition: background 0.2s ease;
`;

export const FriendLink = styled.div`
  padding: 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  text-align: center;
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  margin-top: 8px;
`;

export const Toggle = styled.div<{ $active: boolean; $disabled?: boolean }>`
  width: 46px;
  height: 26px;
  border-radius: 13px;
  background: ${({ $active }) => $active ? '#fff' : 'rgba(255,255,255,0.3)'};
  position: relative;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.4 : 1};
  transition: all 0.2s ease;
`;

export const ToggleKnob = styled.div<{ $active: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #000;
  position: absolute;
  top: 2px;
  left: ${({ $active }) => $active ? '22px' : '2px'};
  transition: all 0.2s ease;
`;