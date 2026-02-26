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
  padding: 70px 16px 80px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Text = styled.p`
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  line-height: 1.4;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

export const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: linear-gradient(135deg, #6e45e2, #88d3ce);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
`;

export const UserHandle = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.4);
`;

export const IndexBadge = styled.div`
  background: rgba(255,215,0,0.1);
  border: 1px solid rgba(255,215,0,0.2);
  border-radius: 30px;
  padding: 10px 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  font-size: 18px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 24px;
`;

export const StatItem = styled.div`
  background: rgba(255,255,255,0.03);
  border-radius: 14px;
  padding: 10px 4px;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
`;

export const StatLabel = styled.div`
  font-size: 9px;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
`;

export const CalendarSection = styled.div`
  margin-bottom: 16px;
`;

export const MonthTitle = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 10px;
  font-weight: 500;
`;

export const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 6px;
  
  span {
    font-size: 10px;
    text-align: center;
    color: rgba(255,255,255,0.3);
  }
`;

export const DotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

export const DayDot = styled.div<{ $active: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${({ $active }) => $active ? '#FFD700' : 'rgba(255,255,255,0.1)'};
  transition: background 0.2s ease;
`;

export const FriendLink = styled.div`
  padding: 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 14px;
  text-align: center;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  margin-top: 8px;
`;

export const Toggle = styled.div<{ $active: boolean; $disabled?: boolean }>`
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: ${({ $active }) => $active ? '#fff' : 'rgba(255,255,255,0.3)'};
  position: relative;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.4 : 1};
  transition: all 0.2s ease;
`;

export const ToggleKnob = styled.div<{ $active: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #000;
  position: absolute;
  top: 2px;
  left: ${({ $active }) => $active ? '20px' : '2px'};
  transition: all 0.2s ease;
`;