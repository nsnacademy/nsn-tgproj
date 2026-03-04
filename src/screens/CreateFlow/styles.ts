import styled, { css } from 'styled-components';

// === VARIABLES ===
const colors = {
  black: '#000',
  white: '#fff',
  gold: '#FFD700',
  darkGray: '#121212',
  gray: '#111',
  lightGray: '#333',
  borderGray: '#222',
  textGray: '#555',
  warning: '#FFA500',
} as const;

const transitions = {
  default: 'all 0.2s ease',
  opacity: 'opacity 0.2s ease',
  transform: 'transform 0.2s ease',
} as const;

// === MIXINS ===
const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const buttonBase = css`
  height: 52px;
  border-radius: 16px;
  font-size: 15px;
  cursor: pointer;
  transition: ${transitions.default};
`;

// === MAIN STYLES ===
export const SafeArea = styled.div`
  min-height: 100vh;
  background: ${colors.black};
  color: ${colors.white};
  padding: 50px 24px;
  display: flex;
  flex-direction: column;
`;

export const Center = styled.div`
  flex: 1;
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const OptionWrap = styled.div`
  position: relative;
`;

export const Option = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: ${({ $active }) => ($active ? colors.darkGray : '#0b0b0b')};
  border: 1px solid ${({ $active }) => ($active ? colors.lightGray : colors.borderGray)};
  cursor: pointer;
  transition: ${transitions.default};

  &:active {
    transform: scale(0.98);
  }
`;

export const Radio = styled.div<{ $checked?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ $checked }) => ($checked ? colors.white : colors.textGray)};
  ${flexCenter};

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${colors.white};
    opacity: ${({ $checked }) => ($checked ? 1 : 0)};
    transition: ${transitions.opacity};
  }
`;

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

// === OPTIMIZED INFO WRAPPER ===
export const InfoWrapper = styled.div<{ $isVisible?: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isVisible }) => ($isVisible ? '1fr' : '0fr')};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: 
    grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    ${transitions.opacity};
  margin-top: ${({ $isVisible }) => ($isVisible ? '12px' : '0')};
`;

export const InfoContent = styled.div`
  min-height: 0;
  overflow: hidden;
  padding: 16px 18px;
  background: ${colors.gray};
  border: 1px solid ${colors.lightGray};
  border-radius: 16px;
  line-height: 1.5;
`;

// === EXPLANATION WITH VARIANTS ===
export const Explanation = styled.div<{
  $bold?: boolean;
  $large?: boolean;
  $warning?: boolean;
  $opacity?: string;
}>`
  font-size: ${({ $large }) => ($large ? '16px' : '13px')};
  line-height: 1.45;
  opacity: ${({ $opacity }) => $opacity || 0.6};
  font-weight: ${({ $bold }) => ($bold ? 500 : 400)};
  color: ${({ $warning }) => ($warning ? colors.warning : 'inherit')};

  &.ml-8 {
    margin-left: 8px;
  }

  &.opacity-08 {
    opacity: 0.8;
  }

  &.warning {
    color: ${colors.warning};
  }
`;

// === CONSENT ===
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
  transition: ${transitions.default};

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${colors.gold};
  }

  span {
    color: ${({ $checked }) => ($checked ? colors.gold : colors.white)};
    font-weight: ${({ $checked }) => ($checked ? 500 : 400)};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

// === FOOTER ===
export const Footer = styled.div`
  display: flex;
  gap: 12px;
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
`;

// === BUTTONS ===
export const BackButton = styled.button`
  ${buttonBase}
  flex: 1;
  background: transparent;
  color: ${colors.white};
  border: 1px solid ${colors.lightGray};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const NextButton = styled.button<{ disabled?: boolean }>`
  ${buttonBase}
  flex: 1;
  background: ${colors.white};
  color: ${colors.black};
  border: none;
  font-weight: 600;
  opacity: ${({ disabled }) => (disabled ? 0.45 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  &:hover {
    background: ${({ disabled }) => (disabled ? colors.white : '#f0f0f0')};
  }
`;