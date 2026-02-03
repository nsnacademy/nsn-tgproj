import {
  SafeArea,
  HomeContainer,
  Header,
  StatusLabel,
  StatusTitle,
  Tabs,
  Tab,
  Content,
  EmptyText,
  FloatingNav,
  NavItem,
  NavIcon,
} from './styles';

export function Home() {
  return (
    <SafeArea>
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
            Создайте новый вызов или
            <br />
            присоединитесь к существующему
          </EmptyText>
        </Content>
      </HomeContainer>

      {/* FLOATING BOTTOM NAV */}
      <FloatingNav>
        <NavItem $active>
          <NavIcon>🏠</NavIcon>
        </NavItem>

        <NavItem>
          <NavIcon>⬛⬛</NavIcon>
        </NavItem>

        <NavItem>
          <NavIcon>＋</NavIcon>
        </NavItem>

        <NavItem>
          <NavIcon>👤</NavIcon>
        </NavItem>
      </FloatingNav>
    </SafeArea>
  );
}