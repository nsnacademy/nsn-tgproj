import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import {
  SafeArea,
  Header,
  BackButton,
  Title,
  Content,
  Card,
  Field,
  Label,
  Value,
  ConditionBox,
  ContactInfo,
  RuleBox,
  RuleIcon,
  RuleText,
  LimitBadge,
  Button,
  Footer,
} from './styles';

type Props = {
  challengeId: string;
  onBack: () => void;
  onNavigateHome: () => void;
};

type ChallengeData = {
  title: string;
  description: string;
  entry_condition: string;
  contact_info: string;
  max_participants: number | null;
  creator_username: string;
};

export default function ChallengeCondition({ challengeId, onBack, onNavigateHome }: Props) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  async function loadChallenge() {
    const { data, error } = await supabase
      .from('challenges_with_creator')
      .select(`
        title,
        description,
        entry_condition,
        contact_info,
        max_participants,
        creator_username
      `)
      .eq('id', challengeId)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setChallenge(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <SafeArea>
        <Header>
          <BackButton onClick={onBack}>←</BackButton>
          <Title>Загрузка...</Title>
        </Header>
      </SafeArea>
    );
  }

  if (!challenge) {
    return (
      <SafeArea>
        <Header>
          <BackButton onClick={onBack}>←</BackButton>
          <Title>Вызов не найден</Title>
        </Header>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <Header>
        <BackButton onClick={onBack}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </BackButton>
        <Title>Условия входа</Title>
      </Header>

      <Content>
        <Card>
          <Title>{challenge.title}</Title>
          <Field>
            <Label>Описание</Label>
            <Value>{challenge.description}</Value>
          </Field>

          <ConditionBox>
            <Label>Условие для вступления</Label>
            <Value>{challenge.entry_condition}</Value>
          </ConditionBox>

          {challenge.max_participants && (
            <LimitBadge>
              Максимум участников: {challenge.max_participants}
            </LimitBadge>
          )}

          <ContactInfo>
            <Label>Контакт для связи</Label>
            <Value>@{challenge.contact_info.replace('@', '')}</Value>
          </ContactInfo>

          <RuleBox>
            <RuleIcon>🔒</RuleIcon>
            <RuleText>
              После выполнения условия автор вручную решит, допустить вас или нет
            </RuleText>
          </RuleBox>
        </Card>
      </Content>

      <Footer>
        <Button onClick={onNavigateHome}>
          Вернуться на главную
        </Button>
      </Footer>
    </SafeArea>
  );
}