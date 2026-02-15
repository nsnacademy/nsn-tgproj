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
  PriceTag,
  ContactInfo,
  RuleBox,
  RuleIcon,
  RuleText,
  RequestButton,
  RequestHint,
  Footer,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  Divider,
  CreatorBadge,
  MetaRow,
  MetaIcon,
  MetaText,
  WarningBox,
} from './styles';

type Props = {
  challengeId: string;
  onBack: () => void;
};

type ChallengeData = {
  title: string;
  description: string;
  entry_price: number;
  entry_currency: string;
  contact_info: string;
  payment_method: string;
  payment_description: string | null;
  creator_username: string;
  duration_days: number;
  participants_count?: number;
  max_participants?: number | null;
  created_at: string;
  has_rating?: boolean;
};

export default function ChallengePaid({ challengeId, onBack }: Props) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  async function loadChallenge() {
    // Загружаем данные вызова
    const { data, error } = await supabase
      .from('challenges_with_creator')
      .select(`
        title,
        description,
        entry_price,
        entry_currency,
        contact_info,
        payment_method,
        payment_description,
        creator_username,
        duration_days,
        max_participants,
        created_at,
        has_rating
      `)
      .eq('id', challengeId)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setChallenge(data);

    // Загружаем количество участников
    const { count } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId);

    setParticipantsCount(count ?? 0);
    setLoading(false);
  }

  const handleSendRequest = async () => {
    if (requestSent) return;

    setRequestSent(true);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      setRequestSent(false);
      return;
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .single();

    if (userError || !user) {
      console.error('[PAID REQUEST] user not found', userError);
      setRequestSent(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('entry_requests')
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        status: 'pending',
      });

    if (insertError) {
      if (insertError.code !== '23505') {
        console.error('[PAID REQUEST] insert error', insertError);
        setRequestSent(false);
        return;
      }
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'transfer': return 'Перевод';
      case 'agreement': return 'Договорённость';
      case 'link': return 'Ссылка на оплату';
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

  const limitReached = challenge.max_participants 
    ? participantsCount >= challenge.max_participants 
    : false;

  return (
    <SafeArea>
      <Header>
        <HeaderRow>
          <BackButton onClick={onBack}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
          <Title>Платный вызов</Title>
        </HeaderRow>
      </Header>

      <Content>
        <Card>
          <CardTitle>{challenge.title}</CardTitle>
          
          <CreatorBadge>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 4v4l2 2" />
            </svg>
            Автор: @{challenge.creator_username}
          </CreatorBadge>

          <Field>
            <Label>Описание</Label>
            <Value>{challenge.description}</Value>
          </Field>

          <Divider />

          {/* Основная информация в сетке */}
          <InfoGrid>
            <InfoItem>
              <InfoLabel>💰 Стоимость</InfoLabel>
              <InfoValue>
                {challenge.entry_price} {challenge.entry_currency.toUpperCase()}
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>📅 Длительность</InfoLabel>
              <InfoValue>{challenge.duration_days} дней</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>👥 Участники</InfoLabel>
              <InfoValue>
                {participantsCount}
                {challenge.max_participants && ` / ${challenge.max_participants}`}
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>📆 Создан</InfoLabel>
              <InfoValue>{formatDate(challenge.created_at)}</InfoValue>
            </InfoItem>
          </InfoGrid>

          {challenge.has_rating && (
            <MetaRow>
              <MetaIcon>🏆</MetaIcon>
              <MetaText>Есть рейтинг и награды</MetaText>
            </MetaRow>
          )}

          <Divider />

          <PriceTag>
            {challenge.entry_price} {challenge.entry_currency.toUpperCase()}
          </PriceTag>

          <Field>
            <Label>Способ оплаты</Label>
            <Value>{getPaymentMethodLabel(challenge.payment_method)}</Value>
          </Field>

          {challenge.payment_description && (
            <Field>
              <Label>Комментарий по оплате</Label>
              <Value>{challenge.payment_description}</Value>
            </Field>
          )}

          <ContactInfo>
            <Label>Контакт для связи</Label>
            <Value>@{challenge.contact_info.replace('@', '')}</Value>
          </ContactInfo>

          {limitReached && (
            <WarningBox>
              ⚠️ Достигнут лимит участников
            </WarningBox>
          )}

          <RuleBox>
            <RuleIcon>📋</RuleIcon>
            <RuleText>
              После оплаты нажмите кнопку ниже, чтобы отправить запрос автору
            </RuleText>
          </RuleBox>
        </Card>
      </Content>

      <Footer>
        <RequestButton 
          onClick={handleSendRequest}
          disabled={requestSent || limitReached}
          $isSent={requestSent}
          $disabled={limitReached}
        >
          {limitReached 
            ? '❌ Мест нет' 
            : requestSent 
              ? '✓ Запрос отправлен' 
              : '📨 Отправить запрос на вступление'}
        </RequestButton>
        <RequestHint>
          {limitReached 
            ? 'Лимит участников исчерпан' 
            : 'Автор проверит оплату и подтвердит ваше участие'}
        </RequestHint>
      </Footer>
    </SafeArea>
  );
}