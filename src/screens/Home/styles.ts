import styled from 'styled-components';

export const HomeContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  /* 🔹 основной внутренний отступ */
  padding: 16px;

  box-sizing: border-box;
`;

export const Header = styled.div`
  margin-bottom: 24px;
`;

export const StatusLabel = styled.div`
  font-size: 14px;
  color: #8e8e93;
  margin-bottom: 8px;
`;

export const StatusTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #000;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
`;

export const Tab = styled.div<{ $active?: boolean }>`
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  color: ${({ $active }) => ($active ? '#000' : '#8e8e93')};
  cursor: pointer;
`;

export const Content = styled.div`
  flex: 1;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  /* 🔹 вместо 96px — адаптивный отступ */
  padding-top: 24px;
`;

export const EmptyText = styled.div`
  font-size: 16px;
  color: #8e8e93;
  text-align: center;
  line-height: 1.4;
`;