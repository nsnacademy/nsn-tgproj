import styled from 'styled-components';

export const SafeArea = styled.div`
  height: 100vh;
  overflow: hidden;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

export const FixedHeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #000;
  z-index: 1000;
`;

export const HeaderSpacer = styled.div`
  height: env(safe-area-inset-top, 0px);
`;

export const HomeContainer = styled.div`
  margin-top: 205px;
  height: calc(100vh - 205px - 100px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 20px;
  
  /* Скрыть стандартный скроллбар */
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Header = styled.div`
  padding: 100px 20px 0;
  
  /* Эффект плавного появления/скрытия */
  mask-image: linear-gradient(
    to bottom,
    rgba(0,0,0,1) 70%,
    rgba(0,0,0,0) 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0,0,0,1) 70%,
    rgba(0,0,0,0) 100%
  );
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
`;

export const StatusLabel = styled.div`
  font-size: 14px;
  opacity: 0.6;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const StatusTitle = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin-top: 4px;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 18px;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  background: rgba(0,0,0,0.8);
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 14px;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  border-bottom: ${({ $active }) =>
    $active ? '2px solid #fff' : '2px solid transparent'};
  padding-bottom: 4px;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  transition: all 0.2s ease;
  
  &:hover {
    opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  }
`;

export const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 40px 0 80px;
  min-height: 100%;
  align-items: center;
`;

export const EmptyText = styled.div`
  margin-top: 40px;
  text-align: center;
  opacity: 0.7;
  font-size: 16px;
`;

export const Card = styled.div<{ $focused?: boolean }>`
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.06),
    rgba(255,255,255,0.02)
  );
  border-radius: 22px;
  padding: 20px;
  transition:
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.4s ease,
    box-shadow 0.4s ease,
    filter 0.4s ease,
    margin 0.4s ease;
  
  width: 100%;
  max-width: 320px;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  
  transform: ${({ $focused }) =>
    $focused ? 'scale(1.05) translateY(-2px)' : 'scale(0.92)'};
  
  opacity: ${({ $focused }) => ($focused ? 1 : 0.4)};
  
  box-shadow: ${({ $focused }) =>
    $focused 
      ? '0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)' 
      : '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'};
  
  filter: ${({ $focused }) =>
    $focused ? 'brightness(1.2)' : 'brightness(0.9)'};
  
  margin: ${({ $focused }) =>
    $focused ? '30px 0' : '15px 0'};
  
  position: relative;
  z-index: ${({ $focused }) => ($focused ? 2 : 1)};
  
  /* Создаем 3D эффект выпуклости */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 22px;
    background: linear-gradient(
      135deg,
      rgba(255,255,255,0.1) 0%,
      transparent 50%,
      rgba(0,0,0,0.3) 100%
    );
    opacity: ${({ $focused }) => ($focused ? 0.8 : 0.3)};
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
`;

export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const CardTitle = styled.div`
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.2px;
  line-height: 1.3;
`;

export const CardRank = styled.div`
  font-size: 13px;
  opacity: 0.6;
  background: rgba(255,255,255,0.1);
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: 500;
`;

export const CardLabel = styled.div`
  font-size: 11px;
  opacity: 0.45;
  margin-top: 12px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

export const CardValue = styled.div`
  font-size: 15px;
  opacity: 0.85;
  margin-top: 2px;
  font-weight: 500;
`;

export const ProgressWrapper = styled.div`
  margin-top: 18px;
`;

export const ProgressBar = styled.div`
  height: 8px;
  border-radius: 10px;
  background: rgba(255,255,255,0.15);
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
      transparent,
      rgba(255,255,255,0.1),
      transparent
    );
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #fff, #e0e0e0);
  border-radius: 10px;
  position: relative;
  z-index: 1;
  transition: width 0.6s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
      rgba(255,255,255,0.8),
      rgba(255,255,255,0.3)
    );
    border-radius: 10px;
  }
`;

export const ProgressText = styled.div`
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.65;
  display: flex;
  justify-content: space-between;
`;

export const PrimaryButton = styled.button`
  margin-top: 18px;
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  background: #fff;
  color: #000;
  font-weight: 600;
  font-size: 15px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f0f0;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

/* === BOTTOM NAV === */
export const BottomNav = styled.div<{ $hidden?: boolean }>`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 18px;
  height: 72px;
  background: rgba(0,0,0,0.95);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  z-index: 1000;
  
  transition:
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.4s ease;
  
  transform: ${({ $hidden }) =>
    $hidden ? 'translateY(120%)' : 'translateY(0)'};
  
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
`;

/* === NAV ITEM === */
export const NavItem = styled.div<{ $active?: boolean }>`
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  border-radius: 16px;
  background: ${({ $active }) =>
    $active ? 'rgba(255,255,255,0.15)' : 'transparent'};
  color: ${({ $active }) =>
    $active ? '#fff' : 'rgba(255,255,255,0.65)'};
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  
  svg {
    width: 24px;
    height: 24px;
    transform: scale(${({ $active }) => ($active ? 1.2 : 1)});
    transform-origin: center;
    transition:
      transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.15s ease;
  }
  
  &:hover {
    background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
  }
  
  &:active svg {
    transform: scale(0.9);
    opacity: 0.7;
  }
`;