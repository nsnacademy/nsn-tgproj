import styled from 'styled-components';

/* PAGE */
export const SafeArea = styled.div`
  height: 100vh;
  background: #000;
  color: #fff;
  overflow: hidden;
`;

/* FIXED TOP */
export const FixedTop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-top: 90px;
  background: #000;
  z-index: 1000;
`;

export const TopBar = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 20px 16px;
`;

export const TopOffset = styled.div`
  height: 140px;
`;

/* SCROLL */
export const ScrollContainer = styled.div`
  height: calc(100vh - 140px - 120px);
  overflow-y: auto;
`;

/* SEARCH */
export const SearchField = styled.div<{ $active?: boolean }>`
  flex: 1;
  height: 36px;
  background: #fff;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  color: #000;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
`;

export const ClearButton = styled.div`
  cursor: pointer;
`;

export const ActionButton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* LIST */
export const List = styled.div`
  padding: 0 20px 140px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Card = styled.div`
  background: #0b0b0b;
  border-radius: 18px;
  padding: 14px 16px;
  border: 1px solid #222;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CardTitle = styled.div`
  font-weight: 600;
`;

export const CardMeta = styled.div`
  font-size: 13px;
  opacity: 0.6;
`;

export const CardRow = styled.div`
  margin-top: 6px;
  opacity: 0.85;
`;

export const Status = styled.div`
  font-size: 13px;
  opacity: 0.6;
`;

export const MoreButton = styled.button`
  margin-top: 10px;
  background: none;
  border: none;
  color: #6aa9ff;
  padding: 0;
`;
