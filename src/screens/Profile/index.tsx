import {
  SafeArea,
  Container,
  Title,
  Text,
} from './styles';

export default function Profile() {
  return (
    <SafeArea>
      <Container>
        <Title>Профиль</Title>
        <Text>
          Здесь будет профиль пользователя и админ-панель.
          <br />
          <br />
          Пока это базовый экран-заглушка.
        </Text>
      </Container>
    </SafeArea>
  );
}
