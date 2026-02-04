import {
  SafeArea,
  HomeContainer,
  Header,
  StatusLabel,
  StatusTitle,
  Tabs,
  Tab,
  CenterWrapper,
  EmptyText,
  BottomNav,
  NavItem,
} from './styles';

export function Home() {
  return (
    <SafeArea>
      <HomeContainer>
        {/* HEADER */}
        <Header>
          <StatusLabel>Состояние</StatusLabel>
          <StatusTitle>Нет активных вызовов</StatusTitle>
        </Header>

        {/* TABS */}
        <Tabs>
          <Tab $active>Активные вызовы</Tab>
          <Tab>Завершенные вызовы</Tab>
        </Tabs>

        {/* CENTER TEXT */}
        <CenterWrapper>
          <EmptyText>
            Создайте новый вызов или
            <br />
            присоединитесь к существующему
          </EmptyText>
        </CenterWrapper>
      </HomeContainer>

      {/* BOTTOM NAV */}
      <BottomNav>
        <NavItem $active>
          <img src="/src/assets/icons/home.svg" />
        </NavItem>

        <NavItem>
          <img src="/src/assets/icons/search.svg" />
        </NavItem>

        <NavItem>
          <img src="/src/assets/icons/plus.svg" />
        </NavItem>

        <NavItem>
          <img src="/src/assets/icons/profile.svg" />
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}