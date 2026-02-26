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
  padding: 90px 20px 140px;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
`;

export const Text = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  line-height: 1.5;
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

// Новые простые стили
export const UserName = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const UserHandle = styled.div`
  font-size: 14px;
  color: #666;
`;

export const Power = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
  padding: 16px;
  background: rgba(255,215,0,0.1);
  border: 1px solid rgba(255,215,0,0.2);
  border-radius: 30px;
`;

export const PowerValue = styled.span`
  font-size: 28px;
  font-weight: 700;
`;

export const PowerStatus = styled.span`
  font-size: 20px;
`;

export const PowerInfo = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  color: #999;
  border: none;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const PowerToday = styled.span`
  font-size: 13px;
  color: #666;
  margin-left: auto;
`;

export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  z-index: 1000;
`;

export const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #111;
  border: 1px solid #333;
  border-radius: 20px;
  padding: 24px;
  max-width: 280px;
  width: 90%;
  z-index: 1001;
`;

export const PopupClose = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  color: #666;
  font-size: 18px;
  cursor: pointer;
`;

export const PopupTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffd700;
`;

export const PopupText = styled.p`
  font-size: 14px;
  color: #999;
  line-height: 1.6;
  margin-bottom: 8px;
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 24px 0;
`;

export const StatBlock = styled.div`
  text-align: center;
  padding: 12px 4px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
`;

export const StatValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
`;

export const ActivityStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 20px 0;
  padding: 16px;
  background: rgba(255,255,255,0.02);
  border-radius: 16px;
`;

export const ActivityStat = styled.div<{ $total?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: ${({ $total }) => $total ? 'none' : '1px solid #222'};
  font-weight: ${({ $total }) => $total ? '600' : '400'};
  color: ${({ $total }) => $total ? '#ffd700' : '#fff'};
`;

export const ActivityLabel = styled.span`
  font-size: 14px;
  color: #999;
`;

export const ActivityValue = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

export const AdminNote = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  font-size: 13px;
  color: #666;
  text-align: center;
  border: 1px solid #222;
`;