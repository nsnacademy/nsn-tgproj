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

/* ✅ ПРАВИЛЬНЫЙ ИМПОРТ SVG (работает в dev + prod) */
import homeIcon from '../../assets/icons/home.svg';
import searchIcon from '../../assets/icons/search.svg';
import plusIcon from '../../assets/icons/plus.svg';
import profileIcon from '../../assets/icons/profile.svg';

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
          <img src={homeIcon} alt="home" />
        </NavItem>

        <NavItem>
          <img src={searchIcon} alt="search" />
        </NavItem>

        <NavItem>
          <img src={plusIcon} alt="create" />
        </NavItem>

        <NavItem>
          <img src={profileIcon} alt="profile" />
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}