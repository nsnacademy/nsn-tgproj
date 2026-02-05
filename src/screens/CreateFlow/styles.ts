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

/* === CENTER === */
export const Center = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

/* === TITLE === */
export const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
`;

/* === OPTIONS === */
export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* === WRAP === */
export const OptionWrap = styled.div`
  position: relative;
`;

/* === OPTION === */
export const Option = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 14px 16px;
  border-radius: 16px;

  background: ${({ $active }) => ($active ? '#111' : '#0b0b0b')};
  border: 1px solid ${({ $active }) => ($active ? '#333' : '#222')};

  cursor: pointer;
  transition: background 0.25s ease, border 0.25s ease;
`;

/* === RADIO === */
export const Radio = styled.div<{ $checked?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ $checked }) => ($checked ? '#fff' : '#555')};

  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
    opacity: ${({ $checked }) => ($checked ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;

/* === LABEL === */
export const Label = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 15px;

  span {
    font-size: 13px;
    opacity: 0.6;
    margin-top: 2px;
  }
`;

/* === FLOATING INFO === */
export const FloatingInfo = styled.div<{ $open?: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;

  margin-top: 8px;
  padding: 14px 16px;

  background: #111;
  border: 1px solid #333;
  border-radius: 14px;

  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};

  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateY(${({ $open }) => ($open ? '0' : '-6px')});

  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
`;

/* === EXPLANATION === */
export const Explanation = styled.p`
  font-size: 13px;
  line-height: 1.45;
  opacity: 0.7;
`;

/* === CONSENT === */
export const Consent = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;

  font-size: 13px;
  line-height: 1.4;
  opacity: 0.9;
  cursor: pointer;

  input {
    margin-top: 2px;
  }
`;

/* === FOOTER === */
export const Footer = styled.div`
  display: flex;
  gap: 12px;
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
  border: none;
  font-weight: 500;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;
