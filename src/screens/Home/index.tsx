import {
  HomeContainer,
  Header,
  StatusLabel,
  StatusTitle,
  Tabs,
  Tab,
  Content,
  EmptyText,
} from './styles';

export function Home() {
  return (
    <HomeContainer>
      <Header>
        <StatusLabel>Состояние</StatusLabel>
        <StatusTitle>Нет активных вызовов</StatusTitle>
      </Header>

      <Tabs>
        <Tab $active>Активные вызовы</Tab>
        <Tab>Завершённые вызовы</Tab>
      </Tabs>

      <Content>
        <EmptyText>
          Создайте новый вызов или присоединитесь к существующему
        </EmptyText>
      </Content>
    </HomeContainer>
  );
}