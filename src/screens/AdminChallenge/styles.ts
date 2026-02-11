import styled from 'styled-components';

export const SafeArea = styled.div`
  min-height: 100vh;
  padding: 20px;
  max-width: 420px;
  margin: 0 auto;
  background: #000;
  color: #fff;
`;

/* HEADER */
export const Header = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

export const BackButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

export const Meta = styled.div`
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.6;
  display: flex;
  gap: 12px;
`;

/* DAY SWITCHER */
export const DaySwitcher = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 12px 14px;
  margin-bottom: 20px;
`;

export const NavButton = styled.button<{ disabled?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

export const DayInfo = styled.div`
  text-align: center;
`;

export const DayNumber = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export const DayDate = styled.div`
  font-size: 12px;
  opacity: 0.6;
`;

/* CONTENT */
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* REPORT CARD */
export const ReportCard = styled.div<{ $status: string }>`
  background: ${({ $status }) =>
    $status === 'rejected'
      ? 'rgba(255,80,80,0.08)'
      : 'rgba(255,255,255,0.05)'};
  border: 1px solid
    ${({ $status }) =>
      $status === 'rejected'
        ? 'rgba(255,80,80,0.3)'
        : 'rgba(255,255,255,0.08)'};
  border-radius: 16px;
  padding: 16px;
`;

export const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const UserBlock = styled.div`
  display: flex;
  gap: 12px;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.2);
`;

export const UserText = styled.div``;

export const Username = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export const SubmittedAt = styled.div`
  font-size: 11px;
  opacity: 0.6;
`;

/* STATUS */
export const StatusBadge = styled.div<{ $status: string }>`
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === 'approved'
      ? 'rgba(76,175,80,0.15)'
      : $status === 'pending'
      ? 'rgba(255,193,7,0.15)'
      : 'rgba(255,80,80,0.15)'};
  color: ${({ $status }) =>
    $status === 'approved'
      ? '#4CAF50'
      : $status === 'pending'
      ? '#FFC107'
      : '#ff6b6b'};
`;

/* BODY */
export const ReportBody = styled.div`
  margin-top: 14px;
`;

export const Label = styled.div`
  font-size: 11px;
  opacity: 0.6;
  margin-bottom: 4px;
`;

export const Value = styled.div`
  font-size: 14px;
`;

export const Reason = styled.div`
  font-size: 14px;
  color: #ff6b6b;
`;

/* ACTIONS */
export const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

export const ApproveButton = styled.button`
  flex: 1;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: #4CAF50;
  color: #000;
  font-weight: 500;
`;

export const RejectButton = styled.button`
  flex: 1;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: rgba(255,255,255,0.1);
  color: #fff;
`;

export const EmptyState = styled.div`
  text-align: center;
  opacity: 0.5;
  margin-top: 40px;
`;

export const CommentBox = styled.div`
  margin-top: 8px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.9;
  white-space: pre-wrap;
`;

