import styled from 'styled-components';

/* === PAGE === */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

/* === HEADER === */
export const Header = styled.div`
  margin-bottom: 16px;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
`;

/* === SECTION === */
export const SectionTitle = styled.div`
  font-size: 14px;
  opacity: 0.6;
  margin-top: 8px;
`;

export const Hint = styled.div`
  font-size: 12px;
  opacity: 0.55;
  line-height: 1.4;
`;

/* === FORM === */
export const Form = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* === FIELDS === */
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.div`
  font-size: 13px;
  opacity: 0.6;
`;

export const Input = styled.input`
  height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  background: #0b0b0b;
  border: 1px solid #222;
  color: #fff;
`;

export const SmallInput = styled(Input)`
  width: 80px;
`;

export const Textarea = styled.textarea`
  padding: 12px 14px;
  border-radius: 12px;
  background: #0b0b0b;
  border: 1px solid #222;
  color: #fff;
  resize: none;
`;

/* === ROWS === */
export const CheckboxRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #0b0b0b;
  border: 1px solid #222;
  cursor: pointer;
`;

export const RadioRow = styled.div<{ active?: boolean }>`
  padding: 12px 14px;
  border-radius: 12px;
  background: ${({ active }) => (active ? '#fff' : '#0b0b0b')};
  color: ${({ active }) => (active ? '#000' : '#fff')};
  border: 1px solid ${({ active }) => (active ? '#fff' : '#222')};
  cursor: pointer;
  transition: all 0.2s ease;
`;

/* === INLINE === */
export const InlineGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

/* === REWARDS === */
export const RewardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  span {
    width: 60px;
    opacity: 0.7;
  }
`;

export const AddButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  opacity: 0.6;
  cursor: pointer;
`;

/* === FOOTER === */
export const Footer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

export const BackButton = styled.button`
  flex: 1;
  height: 48px;
  border-radius: 14px;
  background: transparent;
  color: #fff;
  border: 1px solid #333;
`;

export const NextButton = styled.button<{ disabled?: boolean }>`
  flex: 1;
  height: 48px;
  border-radius: 14px;
  background: #fff;
  color: #000;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;
