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

// Новые стили
export const UserName = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const UserHandle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
`;

export const UserBio = styled.div`
  font-size: 15px;
  margin: 8px 0;
`;

export const UserStack = styled.div`
  font-size: 14px;
  color: #ffd700;
  margin: 4px 0;
`;

export const UserStats = styled.div`
  font-size: 13px;
  color: #999;
  margin: 4px 0 16px;
`;

export const SectionDivider = styled.div`
  height: 1px;
  background: #222;
  margin: 24px 0;
`;

export const SectionTitle = styled.div`
  font-size: 13px;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
`;

export const IndexBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
`;

export const IndexValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #ffd700;
`;

export const IndexPercent = styled.span`
  font-size: 14px;
  color: #666;
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 16px 0;
`;

export const StatItem = styled.div`
  text-align: center;
  padding: 12px;
  background: #0a0a0a;
  border-radius: 12px;
`;

export const StatNumber = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
`;

export const ActivityBar = styled.div`
  width: 100%;
  height: 4px;
  background: #222;
  border-radius: 2px;
  margin: 16px 0 8px;
  overflow: hidden;
`;

export const ActivityFill = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}%;
  height: 100%;
  background: #ffd700;
  border-radius: 2px;
`;

export const ActivityLabel = styled.div`
  font-size: 12px;
  color: #999;
  margin: 4px 0;
`;

export const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin: 12px 0;
`;

export const WeekDay = styled.div`
  font-size: 8px;
  text-align: center;
  color: #444;
  text-transform: uppercase;
  margin-bottom: 2px;
`;

export const DayCell = styled.div<{ $active: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  background: ${({ $active }) => $active ? '#ffd700' : '#1a1a1a'};
  border-radius: 2px;
`;

export const ContactSection = styled.div`
  background: #0a0a0a;
  border-radius: 16px;
  padding: 16px;
  margin: 16px 0;
`;

export const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #222;

  &:last-child {
    border-bottom: none;
  }
`;

export const ContactLabel = styled.span`
  font-size: 13px;
  color: #666;
`;

export const ContactValue = styled.span`
  font-size: 13px;
  color: #fff;
`;

export const EditButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  background: #222;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #333;
  }
`;

export const StatusSelector = styled.div`
  display: flex;
  gap: 8px;
  margin: 16px 0;
`;

export const StatusBadge = styled.div<{ $active?: boolean }>`
  padding: 8px 16px;
  background: ${({ $active }) => $active ? '#ffd700' : '#222'};
  color: ${({ $active }) => $active ? '#000' : '#666'};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
`;

export const InviteButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #ffd700;
  border: none;
  border-radius: 30px;
  color: #000;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin: 16px 0;

  &:hover {
    background: #ffed4a;
  }
`;

export const EditForm = styled.div`
  margin: 20px 0;
`;

export const EditRow = styled.div`
  margin-bottom: 16px;
`;

export const EditLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

export const EditInput = styled.input`
  width: 100%;
  padding: 12px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

export const EditTextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

export const SaveButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #ffd700;
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #222;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
`;