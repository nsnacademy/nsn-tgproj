import styled from 'styled-components';

/* === PAGE === */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding: 50px 24px;
  display: flex;
  flex-direction: column;
`;

/* === CENTER === */
export const Center = styled.div`
  flex: 1;
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

/* === TITLE === */
export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

/* === OPTIONS === */
export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* === OPTION WRAP === */
export const OptionWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* === OPTION === */
export const Option = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: ${({ $active }) => ($active ? '#121212' : '#0b0b0b')};
  border: 1px solid ${({ $active }) => ($active ? '#333' : '#222')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

/* === FIXED RADIO === */
export const Radio = styled.div<{ $checked?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ $checked }) => ($checked ? '#fff' : '#555')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  margin: 0;
`;

export const RadioInner = styled.div<{ $checked?: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  opacity: ${({ $checked }) => ($checked ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

/* === LABEL === */
export const Label = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  flex: 1;

  span {
    font-size: 14px;
    opacity: 0.6;
    margin-top: 2px;
  }
`;

/* === INFO BLOCK (NO ANIMATION) === */
export const InfoBlock = styled.div`
  padding: 16px 18px;
  background: #111;
  border: 1px solid #333;
  border-radius: 16px;
  line-height: 1.5;
  margin-top: 4px;
`;

/* === EXPLANATION === */
export const Explanation = styled.div`
  font-size: 13px;
  line-height: 1.45;
  opacity: 0.6;
`;

/* === CONSENT === */
export const Consent = styled.div<{ $checked?: boolean }>`
  margin-top: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  background: ${({ $checked }) => ($checked ? 'rgba(255, 215, 0, 0.1)' : 'transparent')};
  transition: background 0.2s ease;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #FFD700;
    margin: 0;
  }

  span {
    color: ${({ $checked }) => ($checked ? '#FFD700' : '#fff')};
    font-weight: ${({ $checked }) => ($checked ? 500 : 400)};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

/* === FOOTER === */
export const Footer = styled.div`
  display: flex;
  gap: 12px;
  max-width: 420px;
  width: 100%;
  margin: 20px auto 0;
`;

/* === BUTTONS === */
export const BackButton = styled.button`
  flex: 1;
  height: 52px;
  border-radius: 16px;
  background: transparent;
  color: #fff;
  border: 1px solid #333;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const NextButton = styled.button<{ disabled?: boolean }>`
  flex: 1;
  height: 52px;
  border-radius: 16px;
  background: #fff;
  color: #000;
  border: none;
  font-size: 15px;
  font-weight: 600;
  opacity: ${({ disabled }) => (disabled ? 0.45 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: opacity 0.2s ease;

  &:hover {
    background: ${({ disabled }) => (disabled ? '#fff' : '#f0f0f0')};
  }
`;