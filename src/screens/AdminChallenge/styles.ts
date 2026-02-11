import styled from 'styled-components';

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding: 20px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

export const BackButton = styled.button`
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 10px;
`;

export const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
`;

export const DaySwitcher = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 20px;
`;

export const NavButton = styled.button<{ disabled?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: rgba(255,255,255,0.1);
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

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ReportCard = styled.div`
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255,255,255,0.08);
`;

export const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const UserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.2);
`;

export const Username = styled.div`
  font-size: 14px;
`;

export const StatusBadge = styled.div<{ $status: string }>`
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 8px;
  background: ${({ $status }) =>
    $status === 'approved'
      ? 'rgba(76,175,80,0.2)'
      : $status === 'pending'
      ? 'rgba(255,193,7,0.2)'
      : 'rgba(255,80,80,0.2)'};
`;

export const ReportBody = styled.div`
  margin-top: 12px;
`;

export const Label = styled.div`
  font-size: 11px;
  opacity: 0.6;
  margin-bottom: 4px;
`;

export const Value = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;

export const ApproveButton = styled.button`
  flex: 1;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: #4caf50;
  color: #000;
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
