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
  padding: 90px 20px 140px;
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

export const PrimaryButton = styled.button`
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