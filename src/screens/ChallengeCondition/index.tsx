import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import {
  SafeArea,
  Header,
  HeaderRow,
  BackButton,
  Title,
  Content,
  Card,
  CardTitle,
  Field,
  Label,
  Value,
  ConditionBox,
  ContactInfo,
  RuleBox,
  RuleIcon,
  RuleText,
  LimitBadge,
  RequestButton,
  RequestHint,
  Footer,
} from './styles';

type Props = {
  challengeId: string;
  onBack: () => void;
};

type ChallengeData = {
  title: string;
  description: string;
  entry_condition: string;
  contact_info: string;
  max_participants: number | null;
  creator_username: string;
};

export default function ChallengeCondition({ challengeId, onBack }: Props) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

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

  const handleSendRequest = async () => {
    if (requestSent) return;

    setRequestSent(true);

    // 1️⃣ получаем Telegram user
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      setRequestSent(false);
      return;
    }

    // 2️⃣ находим user.id в нашей таблице users
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .single();

    if (userError || !user) {
      console.error('[CONDITION REQUEST] user not found', userError);
      setRequestSent(false);
      return;
    }

    // 3️⃣ создаём заявку
    const { error: insertError } = await supabase
      .from('entry_requests')
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        status: 'pending',
      });

    if (insertError) {
      // если заявка уже есть — это ОК
      if (insertError.code !== '23505') {
        console.error('[CONDITION REQUEST] insert error', insertError);
        setRequestSent(false);
        return;
      }
    }

    // 4️⃣ успех — оставляем requestSent = true
  };

  if (loading) {
    return (
      <SafeArea>
        <Header>
          <HeaderRow>
            <BackButton onClick={onBack}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </BackButton>
            <Title>Загрузка...</Title>
          </HeaderRow>
        </Header>
      </SafeArea>
    );
  }

  if (!challenge) {
    return (
      <SafeArea>
        <Header>
          <HeaderRow>
            <BackButton onClick={onBack}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </BackButton>
            <Title>Вызов не найден</Title>
          </HeaderRow>
        </Header>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <Header>
        <HeaderRow>
          <BackButton onClick={onBack}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
          <Title>Условия входа</Title>
        </HeaderRow>
      </Header>

      <Content>
        <Card>
          <CardTitle>{challenge.title}</CardTitle>
          
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
              После выполнения условия нажмите кнопку ниже, чтобы отправить запрос автору
            </RuleText>
          </RuleBox>
        </Card>
      </Content>

      <Footer>
        <RequestButton 
          onClick={handleSendRequest}
          disabled={requestSent}
          $isSent={requestSent}
        >
          {requestSent ? '✓ Запрос отправлен' : '🔑 Отправить запрос на вступление'}
        </RequestButton>
        <RequestHint>
          Автор проверит выполнение условия и подтвердит ваше участие
        </RequestHint>
      </Footer>
    </SafeArea>
  );
}