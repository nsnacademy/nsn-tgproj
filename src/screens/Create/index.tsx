import {
  SafeArea,
  TopBar,
  SearchField,
  SearchIcon,
  SearchText,
  ActionButton,
  BottomNav,
  NavItem,
} from './styles';

/* SVG (dev + prod) */
import homeIcon from '../../assets/icons/home.svg';
import searchIcon from '../../assets/icons/search.svg';
import plusIcon from '../../assets/icons/plus.svg';
import profileIcon from '../../assets/icons/profile.svg';

type CreateProps = {
  onNavigate: (screen: 'home' | 'create') => void;
};

export function Create({ onNavigate }: CreateProps) {
  return (
    <SafeArea>
      {/* TOP SEARCH */}
      <TopBar>
        <SearchField>
          <SearchIcon src={searchIcon} alt="search" />
          <SearchText>Поиск вызовов</SearchText>
        </SearchField>

        <ActionButton>
          <img src={plusIcon} alt="create" />
        </ActionButton>
      </TopBar>

      {/* BOTTOM NAV */}
      <BottomNav>
        <NavItem onClick={() => onNavigate('home')}>
          <img src={homeIcon} alt="home" />
        </NavItem>

        <NavItem $active>
          <img src={plusIcon} alt="create" />
        </NavItem>

        <NavItem>
          <img src={searchIcon} alt="search" />
        </NavItem>

        <NavItem>
          <img src={profileIcon} alt="profile" />
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}