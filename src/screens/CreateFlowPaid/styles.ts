import styled from 'styled-components';

/* ======================
   BASE
====================== */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
  position: relative;
  overflow: hidden;
`;

/* ======================
   HEADER
====================== */
export const Header = styled.div`
  padding: 100px 26px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #000;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;



export const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
`;

export const HeaderSubtitle = styled.div`
  font-size: 12px;
  opacity: 0.6;
  line-height: 1.4;
`;

/* ======================
   CONTENT
====================== */
export const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

/* ======================
   OPTION CARDS
====================== */
export const OptionCard = styled.div<{ $active?: boolean; $disabled?: boolean }>`
  background: ${({ $active, $disabled }) => 
    $disabled 
      ? 'rgba(255, 255, 255, 0.02)'
      : $active 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 0.04)'};
  border-radius: 14px;
  padding: 16px;
  border: 1px solid ${({ $active, $disabled }) => 
    $disabled
      ? 'rgba(255, 255, 255, 0.05)'
      : $active 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(255, 255, 255, 0.05)'};
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  gap: 12px;
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  position: relative;
  overflow: hidden;

  ${({ $disabled }) => !$disabled && `
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.2);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${({ $active }) => $active && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        transparent,
        rgba(255, 255, 255, 0.05),
        transparent
      );
      pointer-events: none;
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color || '#fff'};
  flex-shrink: 0;
`;

export const OptionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const OptionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  opacity: 0.95;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const OptionBadge = styled.span<{ $color?: string }>`
  font-size: 10px;
  padding: 3px 6px;
  border-radius: 6px;
  background: ${({ $color }) => 
    $color 
      ? `rgba(${parseInt($color.slice(1,3), 16)}, ${parseInt($color.slice(3,5), 16)}, ${parseInt($color.slice(5,7), 16)}, 0.15)`
      : 'rgba(255, 255, 255, 0.08)'};
  border: 1px solid ${({ $color }) => 
    $color 
      ? `rgba(${parseInt($color.slice(1,3), 16)}, ${parseInt($color.slice(3,5), 16)}, ${parseInt($color.slice(5,7), 16)}, 0.3)`
      : 'rgba(255, 255, 255, 0.1)'};
  display: inline-flex;
  align-items: center;
  gap: 3px;
`;

export const OptionDescription = styled.div`
  font-size: 12px;
  opacity: 0.7;
  line-height: 1.4;
`;

/* ======================
   FOOTER
====================== */
export const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px 18px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 900;
`;

export const FooterRow = styled.div`
  display: flex;
  gap: 10px;
`;

export const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  flex: 1;
  height: 44px;
  border-radius: 12px;
  border: ${({ variant }) => 
    variant === 'secondary' 
      ? '1px solid rgba(255, 255, 255, 0.2)' 
      : 'none'};
  background: ${({ variant }) => 
    variant === 'primary' 
      ? '#fff' 
      : 'transparent'};
  color: ${({ variant }) => 
    variant === 'primary' ? '#000' : '#fff'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ variant }) => 
    variant === 'primary' 
      ? '0 4px 16px rgba(0, 0, 0, 0.3)' 
      : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ variant }) => 
      variant === 'primary' 
        ? 'rgba(255, 255, 255, 0.95)' 
        : 'rgba(255, 255, 255, 0.1)'};
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
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
  gap: 6px;
`;

/* ======================
   PROGRESS BAR
====================== */
export const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  gap: 8px;
`;

export const ProgressStep = styled.div<{ $active?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const StepIndicator = styled.div<{ $active?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: ${({ $active }) => 
    $active 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${({ $active }) => 
    $active 
      ? 'rgba(255, 255, 255, 0.3)' 
      : 'rgba(255, 255, 255, 0.1)'};
`;

export const StepNumber = styled.span``;

export const StepLabel = styled.span`
  font-size: 10px;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ======================
   FORM SECTIONS
====================== */
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FormTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
`;

export const FormDescription = styled.div`
  font-size: 12px;
  opacity: 0.6;
  margin-bottom: 8px;
`;

export const InputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InputLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  opacity: 0.8;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input<{ $hasValue?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${({ $hasValue }) => 
    $hasValue ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const CurrencySelect = styled.select`
  position: absolute;
  right: 8px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  
  &:focus {
    outline: none;
  }
  
  option {
    background: #000;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

export const ContactInput = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0 12px;
  
  &:focus-within {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }
  
  input {
    border: none;
    background: transparent;
    padding: 12px 0;
    
    &:focus {
      background: transparent;
    }
  }
`;

export const InfoBox = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  margin: 8px 0;
`;

export const InfoIcon = styled.span`
  font-size: 16px;
`;

export const InfoText = styled.div`
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.4;
`;

export const RuleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 16px;
`;

export const RuleIcon = styled.span`
  font-size: 20px;
`;

export const RuleText = styled.div`
  font-size: 13px;
  font-weight: 500;
  opacity: 0.9;
`;

/* ======================
   HEADER - FIXED
====================== */
export const FixedHeader = styled.div`
  padding: 50px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

/* ======================
   SCROLL CONTENT
====================== */
export const ScrollContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  margin-top: 150px; /* Высота фиксированного хедера */
  margin-bottom: 80px; /* Высота футера */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  /* Скрываем скроллбар для Chrome/Safari */
  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
  
  /* Скрываем скроллбар для Firefox */
  scrollbar-width: none;
`;