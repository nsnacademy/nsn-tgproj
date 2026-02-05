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
  position: relative;
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

  transition:
    background 0.3s ease,
    border 0.3s ease,
    transform 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
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
  font-size: 16px;

  span {
    font-size: 14px;
    opacity: 0.6;
    margin-top: 2px;
  }
`;

/* === SLIDING INFO (FREE) === */
export const SlidingInfo = styled.div<{ $open?: boolean }>`
  overflow: hidden;

  max-height: ${({ $open }) => ($open ? '120px' : '0')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateY(${({ $open }) => ($open ? '0' : '-6px')});

  padding: ${({ $open }) => ($open ? '12px 16px 0' : '0 16px')};

  transition:
    max-height 0.35s ease,
    opacity 0.25s ease,
    transform 0.25s ease;
`;

/* === FLOATING INFO (PAID) === */
export const FloatingInfo = styled.div<{ $open?: boolean }>`
  margin-top: 12px;
  padding: 14px 16px;

  background: #111;
  border: 1px solid #333;
  border-radius: 14px;

  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateY(${({ $open }) => ($open ? '0' : '-6px')});
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};

  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
`;

/* === EXPLANATION === */
export const Explanation = styled.div`
  font-size: 13px;
  line-height: 1.45;
  opacity: 0.6;
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
    margin-top: 3px;
  }
`;

/* === FOOTER === */
export const Footer = styled.div`
  display: flex;
  gap: 12px;

  max-width: 420px;
  width: 100%;
  margin: 0 auto;
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
`;
