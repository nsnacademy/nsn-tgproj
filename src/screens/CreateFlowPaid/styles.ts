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
  padding-bottom: 100px;
  position: relative;
  overflow: hidden;
`;

/* ======================
   HEADER
====================== */
export const Header = styled.div`
  padding: 70px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #000;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(-2px);
  }
`;

export const HeaderTitle = styled.div`
  font-size: 22px;
  font-weight: 600;
  line-height: 1.3;
`;

export const HeaderSubtitle = styled.div`
  font-size: 14px;
  opacity: 0.6;
  line-height: 1.4;
`;

/* ======================
   CONTENT
====================== */
export const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  border-radius: 18px;
  padding: 20px;
  border: 1px solid ${({ $active, $disabled }) => 
    $disabled
      ? 'rgba(255, 255, 255, 0.05)'
      : $active 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(255, 255, 255, 0.05)'};
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  gap: 16px;
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  position: relative;
  overflow: hidden;

  ${({ $disabled }) => !$disabled && `
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
  width: 56px;
  height: 56px;
  border-radius: 16px;
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
  gap: 8px;
`;

export const OptionTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  opacity: 0.95;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const OptionBadge = styled.span<{ $color?: string }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
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
  gap: 4px;
`;

export const OptionDescription = styled.div`
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.5;
`;

/* ======================
   FOOTER
====================== */
export const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px 24px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 900;
`;

export const FooterRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  flex: 1;
  height: 56px;
  border-radius: 16px;
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
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ variant }) => 
    variant === 'primary' 
      ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
      : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: ${({ variant }) => 
      variant === 'primary' 
        ? 'rgba(255, 255, 255, 0.95)' 
        : 'rgba(255, 255, 255, 0.1)'};
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
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
  gap: 8px;
`;