import styled from 'styled-components';

/* ======================
   PAGE
====================== */
export const SafeArea = styled.div`
  height: 100vh;
  background: #000;
  color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

/* ======================
   FIXED TOP
====================== */
export const FixedTop = styled.div`
  position: fixed;
  top: 30px;
  left: 0;
  right: 0;
  padding-top: 60px;
  background: linear-gradient(180deg, #000 80%, rgba(0,0,0,0.95) 100%);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const TopBar = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 20px 20px;
`;

export const TopOffset = styled.div`
  height: 140px;
  margin-top: 50px;
`;

/* ======================
   SCROLL
====================== */
export const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

/* ======================
   SEARCH
====================== */
export const SearchField = styled.div<{ $active?: boolean }>`
  flex: 1;
  height: 44px;
  background: ${({ $active }) => 
    $active ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 22px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  color: #fff;
  border: 1px solid ${({ $active }) => 
    $active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'};
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

export const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
`;

export const SearchInput = styled.input<{ $hasValue?: boolean }>`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  color: #fff;
  font-size: 15px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const ClearButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

export const ActionButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: #fff;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.95);
  }

  
`;

/* ======================
   LIST
====================== */
export const List = styled.div`
  padding: 0 20px 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;



export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 6px;
`;

export const CardMeta = styled.div`
  font-size: 13px;
  opacity: 0.6;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const CardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  font-size: 12px;
  opacity: 0.8;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const Status = styled.div`
  display: flex;
  align-items: center;
`;

export const StatusBadge = styled.div<{ $status: 'active' | 'soon' }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $status }) => 
    $status === 'active' 
      ? 'rgba(76, 175, 80, 0.15)' 
      : 'rgba(255, 193, 7, 0.15)'};
  color: ${({ $status }) => 
    $status === 'active' ? '#4CAF50' : '#FFC107'};
  border: 1px solid ${({ $status }) => 
    $status === 'active' 
      ? 'rgba(76, 175, 80, 0.3)' 
      : 'rgba(255, 193, 7, 0.3)'};
`;

export const MoreButton = styled.button`
  margin-top: 14px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
`;

/* ======================
   EMPTY STATE
====================== */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.5);
`;

export const EmptyText = styled.div`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.8;
  margin-bottom: 8px;
`;

export const EmptySubtext = styled.div`
  font-size: 14px;
  opacity: 0.5;
`;

/* ======================
   BOTTOM NAV (re-export)
====================== */
export { BottomNav, NavItem } from '../Home/styles';


/* ======================
   ENTRY TYPE STYLES
====================== */

export const Card = styled.div<{ $entryType?: 'free' | 'paid' | 'condition' }>`
  background: ${({ $entryType }) => {
    if ($entryType === 'paid') return 'rgba(255, 215, 0, 0.06)';
    if ($entryType === 'condition') return 'rgba(155, 89, 182, 0.06)';
    return 'rgba(255, 255, 255, 0.06)';
  }};
  border-radius: 20px;
  padding: 18px;
  border: 1px solid ${({ $entryType }) => {
    if ($entryType === 'paid') return 'rgba(255, 215, 0, 0.15)';
    if ($entryType === 'condition') return 'rgba(155, 89, 182, 0.15)';
    return 'rgba(255, 255, 255, 0.08)';
  }};
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ $entryType }) => {
      if ($entryType === 'paid') return 'rgba(255, 215, 0, 0.3)';
      if ($entryType === 'condition') return 'rgba(155, 89, 182, 0.3)';
      return 'rgba(255, 255, 255, 0.15)';
    }};
    background: ${({ $entryType }) => {
      if ($entryType === 'paid') return 'rgba(255, 215, 0, 0.1)';
      if ($entryType === 'condition') return 'rgba(155, 89, 182, 0.1)';
      return 'rgba(255, 255, 255, 0.08)';
    }};
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  }
`;

export const EntryBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: ${({ $color }) => `rgba(${parseInt($color.slice(1,3), 16)}, ${parseInt($color.slice(3,5), 16)}, ${parseInt($color.slice(5,7), 16)}, 0.15)`};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $color }) => `rgba(${parseInt($color.slice(1,3), 16)}, ${parseInt($color.slice(3,5), 16)}, ${parseInt($color.slice(5,7), 16)}, 0.3)`};
`;

export const PriceTag = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #FFD700;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 215, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: '💰';
    font-size: 14px;
    opacity: 0.8;
  }
`;

export const ConditionButton = styled.button<{ $entryType: 'paid' | 'condition' }>`
  margin-top: 14px;
  padding: 10px 16px;
  background: ${({ $entryType }) => 
    $entryType === 'paid' 
      ? 'rgba(255, 215, 0, 0.1)' 
      : 'rgba(155, 89, 182, 0.1)'};
  border: 1px solid ${({ $entryType }) => 
    $entryType === 'paid' 
      ? 'rgba(255, 215, 0, 0.2)' 
      : 'rgba(155, 89, 182, 0.2)'};
  border-radius: 12px;
  color: ${({ $entryType }) => 
    $entryType === 'paid' ? '#FFD700' : '#9B59B6'};
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: ${({ $entryType }) => 
      $entryType === 'paid' 
        ? 'rgba(255, 215, 0, 0.15)' 
        : 'rgba(155, 89, 182, 0.15)'};
    border-color: ${({ $entryType }) => 
      $entryType === 'paid' 
        ? 'rgba(255, 215, 0, 0.3)' 
        : 'rgba(155, 89, 182, 0.3)'};
  }
`;