import styled from 'styled-components';

export const HomeContainer = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  padding: 16px;
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
  align-items: center;
  justify-content: center;

  min-height: 0;
`;

export const EmptyText = styled.div`
  max-width: 260px;
  font-size: 16px;
  color: #8e8e93;
  text-align: center;
  line-height: 1.4;
`;