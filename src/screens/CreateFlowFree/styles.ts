import styled, { css } from 'styled-components';

/* ======================
   VARIABLES
====================== */
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

/* ======================
   MIXINS
====================== */
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

/* ======================
   MAIN STYLES
====================== */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: ${colors.black};
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

/* ======================
   FIXED HEADER
====================== */
export const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${colors.black};
  padding: 60px 24px 20px;
  z-index: 100;
  border-bottom: 1px solid ${colors.borderGray};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

export const HeaderSubtitle = styled.div`
  font-size: 14px;
  opacity: 0.6;
`;

/* ======================
   SCROLL CONTENT
====================== */
export const ScrollContent = styled.div`
  flex: 1;
  margin-top: 110px;
  margin-bottom: 80px;
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.gray};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.lightGray};
    border-radius: 2px;
  }
`;

/* ======================
   FORM SECTIONS
====================== */
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const FormDescription = styled.div`
  font-size: 13px;
  opacity: 0.6;
  line-height: 1.5;
`;

export const Hint = styled.div`
  font-size: 12px;
  opacity: 0.5;
  line-height: 1.4;
  margin-top: 4px;
`;

/* ======================
   INPUT FIELDS
====================== */
export const InputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InputLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  opacity: 0.8;
  margin-left: 4px;
`;

export const Input = styled.input<{ $hasValue?: boolean }>`
  width: 100%;
  padding: 14px 16px;
  background: ${colors.gray};
  border: 1px solid ${({ $hasValue }) => ($hasValue ? colors.lightGray : colors.borderGray)};
  border-radius: 14px;
  color: ${colors.white};
  font-size: 15px;
  transition: ${transitions.default};

  &:focus {
    outline: none;
    border-color: ${colors.lightGray};
    background: ${colors.darkGray};
  }

  &::placeholder {
    color: ${colors.textGray};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  background: ${colors.gray};
  border: 1px solid ${colors.borderGray};
  border-radius: 14px;
  color: ${colors.white};
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: ${transitions.default};

  &:focus {
    outline: none;
    border-color: ${colors.lightGray};
    background: ${colors.darkGray};
  }

  &::placeholder {
    color: ${colors.textGray};
  }
`;

/* ======================
   OPTION CARDS
====================== */
export const OptionCard = styled.div<{ $active?: boolean; $disabled?: boolean }>`
  background: ${({ $active }) => ($active ? colors.darkGray : colors.gray)};
  border: 1px solid ${({ $active }) => ($active ? colors.lightGray : colors.borderGray)};
  border-radius: 16px;
  padding: 16px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  transition: ${transitions.default};
  display: flex;
  gap: 14px;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  ${({ $disabled }) => !$disabled && `
    &:hover {
      transform: translateY(-2px);
      background: ${colors.darkGray};
      border-color: ${colors.lightGray};
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
    }

    &:active {
      transform: translateY(0);
    }
  `}
`;

export const OptionIcon = styled.div<{ $color?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $color }) => 
    $color 
      ? `rgba(${parseInt($color.slice(1,3), 16)}, ${parseInt($color.slice(3,5), 16)}, ${parseInt($color.slice(5,7), 16)}, 0.15)`
      : 'rgba(255, 255, 255, 0.08)'};
  border: 1px solid ${({ $color }) => 
    $color 
      ? `rgba(${parseInt($color.slice(1,3), 16)}, ${parseInt($color.slice(3,5), 16)}, ${parseInt($color.slice(5,7), 16)}, 0.3)`
      : 'rgba(255, 255, 255, 0.1)'};
  ${flexCenter};
  color: ${({ $color }) => $color || colors.white};
  flex-shrink: 0;
`;

export const OptionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const OptionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
`;

export const OptionDescription = styled.div`
  font-size: 13px;
  opacity: 0.6;
  line-height: 1.4;
`;

/* ======================
   CHECKBOX ROW
====================== */
export const CheckboxRow = styled.div<{ $checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: ${({ $checked }) => ($checked ? colors.darkGray : colors.gray)};
  border: 1px solid ${({ $checked }) => ($checked ? colors.lightGray : colors.borderGray)};
  border-radius: 14px;
  cursor: pointer;
  transition: ${transitions.default};

  &:hover {
    background: ${colors.darkGray};
    border-color: ${colors.lightGray};
  }

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${colors.gold};
  }

  span {
    font-size: 15px;
    color: ${({ $checked }) => ($checked ? colors.gold : colors.white)};
    font-weight: ${({ $checked }) => ($checked ? 500 : 400)};
  }
`;

/* ======================
   INFO BOX
====================== */
export const InfoBox = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: ${colors.gray};
  border: 1px solid ${colors.borderGray};
  border-radius: 16px;
`;

export const InfoIcon = styled.span`
  font-size: 20px;
`;

export const InfoText = styled.div`
  font-size: 13px;
  opacity: 0.8;
  line-height: 1.5;
  flex: 1;
`;

/* ======================
   REWARDS
====================== */
export const RewardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  
  span {
    min-width: 70px;
    font-size: 14px;
    opacity: 0.8;
  }
`;

export const AddButton = styled.button`
  background: transparent;
  border: 1px dashed ${colors.borderGray};
  border-radius: 14px;
  padding: 14px;
  color: ${colors.white};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
  transition: ${transitions.default};
  
  &:hover {
    border-color: ${colors.lightGray};
    background: ${colors.gray};
  }
`;

/* ======================
   SUMMARY
====================== */
export const SummaryBox = styled.div`
  background: ${colors.gray};
  border: 1px solid ${colors.borderGray};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  
  span {
    opacity: 0.6;
  }
  
  b {
    font-weight: 600;
    color: ${colors.gold};
  }
`;

/* ======================
   FOOTER
====================== */
export const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 24px 24px;
  background: ${colors.black};
  border-top: 1px solid ${colors.borderGray};
  z-index: 100;
`;

export const FooterRow = styled.div`
  display: flex;
  gap: 12px;
  max-width: 420px;
  margin: 0 auto;
`;

export const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  ${buttonBase}
  flex: 1;
  border: ${({ variant }) => 
    variant === 'secondary' 
      ? `1px solid ${colors.borderGray}` 
      : 'none'};
  background: ${({ variant }) => 
    variant === 'primary' 
      ? colors.white 
      : 'transparent'};
  color: ${({ variant }) => 
    variant === 'primary' ? colors.black : colors.white};
  font-weight: ${({ variant }) => 
    variant === 'primary' ? '600' : '400'};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: ${({ variant }) => 
      variant === 'primary' 
        ? 'rgba(255, 255, 255, 0.95)' 
        : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${({ variant }) => 
      variant === 'secondary' ? colors.lightGray : 'none'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const ButtonText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;