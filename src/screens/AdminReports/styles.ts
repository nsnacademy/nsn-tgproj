import styled from 'styled-components';

/* =========================
   LAYOUT
========================= */

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

export const FixedTop = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: #000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const Header = styled.div`
  padding: 50px 16px 12px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const BackButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(-2px);
  }
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
`;

export const Meta = styled.div`
  font-size: 12px;
  opacity: 0.6;
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

export const DaySwitcher = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

export const NavButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
`;

export const DayInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DayNumber = styled.div`
  font-size: 15px;
  font-weight: 600;
`;

export const DayDate = styled.div`
  font-size: 11px;
  opacity: 0.5;
  margin-top: 2px;
`;

export const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

export const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const StatItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

export const StatValue = styled.div<{ $active?: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(255, 255, 255, 0.4)')};
`;

export const StatLabel = styled.div`
  font-size: 10px;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
`;

/* =========================
   REPORT CARD
========================= */

export const ReportCard = styled.div<{ $status: 'pending' | 'approved' | 'rejected' }>`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid ${({ $status }) => {
    switch ($status) {
      case 'pending': return 'rgba(255, 193, 7, 0.2)';
      case 'approved': return 'rgba(76, 175, 80, 0.2)';
      case 'rejected': return 'rgba(244, 67, 54, 0.2)';
    }
  }};
`;

export const ReportHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const UserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StyledAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

export const UserText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Username = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

export const UserInfoRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const UserMeta = styled.div`
  font-size: 11px;
  opacity: 0.5;
`;

export const StatusBadge = styled.div<{ $status: 'pending' | 'approved' | 'rejected' }>`
  font-size: 20px;
`;

export const ReportBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Label = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const Value = styled.div`
  font-size: 15px;
  line-height: 1.5;
  color: #fff;
`;

export const Reason = styled.div`
  font-size: 13px;
  padding: 10px;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 8px;
  color: #ff6b6b;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

export const ApproveButton = styled.button`
  flex: 1;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(76, 175, 80, 0.3);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const RejectButton = styled.button`
  flex: 1;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: rgba(244, 67, 54, 0.1);
  color: #ff6b6b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(244, 67, 54, 0.2);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const CommentBox = styled.div`
  font-size: 13px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  white-space: pre-wrap;
`;

/* =========================
   MEDIA
========================= */

export const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 10px;
`;

export const MediaItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #111;
`;

export const MediaPreview = styled.div<{ $isLoading?: boolean; $error?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $error }) => $error ? 'rgba(244, 67, 54, 0.1)' : '#111'};
  color: ${({ $error }) => $error ? '#ff6b6b' : 'rgba(255,255,255,0.3)'};
  font-size: 24px;
`;

export const MediaCount = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  backdrop-filter: blur(5px);
`;

export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/* =========================
   FULLSCREEN
========================= */

export const FullscreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const FullscreenClose = styled.button`
  position: absolute;
  top: 50px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10000;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

export const FullscreenImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  object-fit: contain;
`;