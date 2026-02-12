// src/screens/InviteSettings/index.tsx
import {
  SafeArea,
  Container,
  Title,
} from './styles';

type InviteSettingsProps = {
  challengeId: string;
  onBack: () => void;
};

export default function InviteSettings({
  challengeId,
  onBack,
}: InviteSettingsProps) {
  return (
    <SafeArea>
      <Container>
        <Title>Invite Settings</Title>

        <p style={{ opacity: 0.6, fontSize: 14 }}>
          Challenge ID: {challengeId}
        </p>

        <button
          onClick={onBack}
          style={{
            marginTop: 20,
            padding: 12,
            borderRadius: 12,
          }}
        >
          Назад
        </button>
      </Container>
    </SafeArea>
  );
}
