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

export const Container = styled.div`
  flex: 1;
  padding: 100px 20px 140px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 24px;
`;

export const BackButton = styled.button`
  position: absolute;
  left: 0;

  padding: 10px 14px;
  border-radius: 12px;
  border: none;

  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 14px;
  font-weight: 500;

  cursor: pointer;

  &:active {
    transform: scale(0.97);
  }
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
`;

/* =========================
   CONTENT
========================= */

export const Section = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.div`
  font-size: 14px;
  opacity: 0.8;
`;

export const Value = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 120px;
  padding: 8px 10px;
  border-radius: 10px;

  background: #000;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  outline: none;

  &:focus {
    border-color: #fff;
  }
`;

/* =========================
   BUTTONS
========================= */

export const PrimaryButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;

  font-weight: 600;
  font-size: 15px;

  background: #fff;
  color: #000;

  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.1s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

/* =========================
   TOGGLE
========================= */

export const Toggle = styled.div<{
  $active: boolean;
}>`
  width: 44px;
  height: 26px;
  border-radius: 13px;
  padding: 3px;
  display: flex;
  align-items: center;

  background: ${({ $active }) =>
    $active ? '#fff' : 'rgba(255,255,255,0.3)'};

  cursor: pointer;
  transition: background 0.2s ease;
`;

export const ToggleKnob = styled.div<{
  $active: boolean;
}>`
  width: 20px;
  height: 20px;
  border-radius: 50%;

  background: ${({ $active }) =>
    $active ? '#000' : '#fff'};

  transform: translateX(
    ${({ $active }) => ($active ? '18px' : '0')}
  );

  transition: transform 0.2s ease;
`;

/* =========================
   SECTION HEADER
========================= */

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

/* =========================
   USER MANAGEMENT
========================= */

export const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;

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

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Username = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
`;

export const UserRole = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
`;

export const RemoveButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 59, 48, 0.2);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const EmptyUsers = styled.div`
  padding: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
`;

/* =========================
   DANGER BUTTON
========================= */

export const DangerButton = styled(PrimaryButton)`
  background: #ff3b30;
  color: #fff;

  &:hover:not(:disabled) {
    background: #ff5a4a;
  }
`;

/* =========================
   REQUESTS SECTION
========================= */

export const RequestsSection = styled(Section)`
  border-left: 3px solid rgba(102, 126, 234, 0.5);
`;

export const RequestsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const RequestsTitle = styled(SectionTitle)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`;

export const RequestCount = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 600;
`;

export const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RequestCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

export const RequestUserInfo = styled.div`
  flex: 1;
`;

export const RequestUsername = styled.div`
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
`;

export const RequestDate = styled.div`
  font-size: 11px;
  opacity: 0.5;
  margin-top: 2px;
`;

export const RequestActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ApproveButton = styled.button<{ disabled?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const RejectButton = styled.button<{ disabled?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 68, 68, 0.2);
    border-color: rgba(255, 68, 68, 0.3);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const LimitReached = styled.div`
  padding: 12px 16px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  color: #FFC107;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const EmptyRequests = styled.div`
  text-align: center;
  padding: 32px 20px;
  opacity: 0.5;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RequestsToggle = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
`;

export const InfoMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  opacity: 0.6;
  font-size: 14px;
`;

// Добавить в конец файла styles.ts:

/* =========================
   REQUEST STYLES (ДОБАВИТЬ)
========================= */

export const RequestAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
`;

export const RequestMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const RequestBadge = styled.span`
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffd700;
  margin-left: 8px;
`;