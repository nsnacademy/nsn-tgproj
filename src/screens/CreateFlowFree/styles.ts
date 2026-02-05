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
  margin-bottom: 24px;
`;

/* === TITLE === */
export const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
`;

/* === FORM === */
export const Form = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* === FIELD === */
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

/* === LABEL === */
export const Label = styled.div`
  font-size: 13px;
  opacity: 0.6;
`;

/* === INPUT === */
export const Input = styled.input`
  height: 44px;
  padding: 0 14px;

  border-radius: 12px;
  background: #0b0b0b;
  border: 1px solid #222;

  color: #fff;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: #444;
  }
`;

/* === TEXTAREA === */
export const Textarea = styled.textarea`
  padding: 12px 14px;
  resize: none;

  border-radius: 12px;
  background: #0b0b0b;
  border: 1px solid #222;

  color: #fff;
  font-size: 15px;
  line-height: 1.4;

  &:focus {
    outline: none;
    border-color: #444;
  }
`;

/* === FOOTER === */
export const Footer = styled.div`
  display: flex;
  gap: 12px;
`;

/* === BUTTONS === */
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
  border: none;

  font-weight: 500;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;
