import {
  SafeArea,
  Container,
  Title,
  Text,
} from './styles';

import { BottomNav, NavItem } from '../Home/styles';

type Screen = 'home' | 'create' | 'profile' | 'admin';

type AdminProps = {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
};

export default function Admin({ screen, onNavigate }: AdminProps) {
  return (
    <SafeArea>
      <Container>
        <Title>Админ-панель</Title>
        <Text>
          Здесь будет модерация отчётов.
          <br />
          Пока — заглушка.
        </Text>
      </Container>

      <BottomNav>
        <NavItem
          $active={screen === 'home'}
          onClick={() => onNavigate('home')}
        >
          🏠
        </NavItem>

        <NavItem
          $active={screen === 'create'}
          onClick={() => onNavigate('create')}
        >
          ➕
        </NavItem>

        <NavItem $active={false}>📊</NavItem>

        <NavItem
          $active={screen === 'profile'}
          onClick={() => onNavigate('profile')}
        >
          👤
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}
