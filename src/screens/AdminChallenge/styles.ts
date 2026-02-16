import styled from 'styled-components';

export const SafeArea = styled.div`
  min-height: 100vh;
  padding: 100px 20px;
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
  position: relative;
`;

export const BackButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  
  &:hover {
    background: rgba(255,255,255,0.15);
  }
  
  &:active {
    transform: scale(0.95);
  }
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
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  
  &:hover:not(:disabled) {
    background: rgba(255,255,255,0.15);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
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
  margin-bottom: 12px;
`;

export const Label = styled.div`
  font-size: 11px;
  opacity: 0.6;
  margin-bottom: 4px;
`;

export const Value = styled.div`
  font-size: 14px;
  margin-bottom: 12px;
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
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: #5cbf5c;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const RejectButton = styled.button`
  flex: 1;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: rgba(255,255,255,0.1);
  color: #fff;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: rgba(255,255,255,0.15);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  opacity: 0.5;
  margin-top: 40px;
`;

export const CommentBox = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.9;
  white-space: pre-wrap;
`;

export const FixedTop = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 420px;

  background: #000;
  z-index: 20;

  /* закрывает всё что под ним */
  padding-top: 100px;
  padding-bottom: 12px;
  padding-left: 20px;
  padding-right: 20px;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.9);
`;

export const ScrollContent = styled.div`
  margin-top: 160px; /* высота header + day switcher */
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* ======================
   НОВЫЕ СТИЛИ ДЛЯ УЛУЧШЕННОГО ИНТЕРФЕЙСА
====================== */

/* ВКЛАДКИ */
export const TabBar = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 0;
  padding: 4px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
`;

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#000' : '#fff')};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? '#fff' : 'rgba(255,255,255,0.1)')};
  }
`;

/* СТРОКА СТАТИСТИКИ */
export const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  margin-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.08);
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

export const StatValue = styled.div<{ $active?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  
  &:hover {
    opacity: 0.8;
  }
`;

export const StatLabel = styled.div`
  font-size: 10px;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ */
export const UserInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 2px;
  flex-wrap: wrap;
`;

export const UserMeta = styled.span`
  font-size: 11px;
  opacity: 0.5;
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* СЕТКА МЕДИА */
/* СЕТКА МЕДИА - увеличенный размер */
export const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 👈 2 колонки вместо 3 */
  gap: 12px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

export const MediaItem = styled.div`
  position: relative;
  aspect-ratio: 4/3; /* 👈 более широкий формат */
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  
  &:hover {
    border-color: rgba(255,255,255,0.3);
  }
`;

export const MediaPreview = styled.div<{ $imageUrl?: string; $isLoading?: boolean; $error?: boolean }>`
  width: 100%;
  height: 100%;
  background: ${({ $imageUrl, $isLoading, $error }) => 
    $error ? 'rgba(255,80,80,0.1)' :
    $isLoading ? 'rgba(255,255,255,0.05)' :
    $imageUrl ? `url(${$imageUrl})` : 'rgba(255,255,255,0.05)'};
  background-size: contain; /* 👈 contain вместо cover */
  background-position: center;
  background-repeat: no-repeat;
  cursor: ${({ $imageUrl }) => $imageUrl ? 'pointer' : 'default'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  font-size: 24px;
  transition: transform 0.2s ease;

  &:hover {
    transform: ${({ $imageUrl }) => $imageUrl ? 'scale(1.02)' : 'none'};
    background-color: ${({ $imageUrl }) => $imageUrl ? 'rgba(255,255,255,0.1)' : 'none'};
  }
`;

export const MediaCount = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.2);
  font-weight: 500;
`;

/* Стили для видео */
export const VideoPreview = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  background: #000;
`;

/* УЛУЧШЕННЫЙ АВАТАР */
export const StyledAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
`;

/* КОНТЕЙНЕР ДЛЯ МЕДИА В ПОЛНОЭКРАННОМ РЕЖИМЕ */
export const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const FullscreenClose = styled.button`
  position: absolute;
  top: 100px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  background: rgba(255,255,255,0.2);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10000;

  &:hover {
    background: rgba(255,255,255,0.3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const FullscreenImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  object-fit: contain;
`;

/* ИНДИКАТОР ЗАГРУЗКИ */
export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/* СЧЕТЧИК ФАЙЛОВ В ШАПКЕ */
export const MediaBadge = styled.span`
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  margin-left: 8px;
`;

/* КОНТЕЙНЕР ДЛЯ ТЕКСТА ПОЛЬЗОВАТЕЛЯ */
export const UserTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/* ИНФОРМАЦИЯ О МЕДИА */
export const MediaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: rgba(255,255,255,0.5);
`;


