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
  max_participants?: number | null;
  has_rating?: boolean;
  rules?: string | null;
};

export default function ChallengePaid({ challengeId, onBack }: Props) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 [PAID] Загрузка данных для challengeId:', challengeId);
    loadChallenge();
  }, [challengeId]);

  async function loadChallenge() {
    try {
      console.log('📥 [PAID] Запрос к challenges_with_creator...');
      
      // Загружаем данные вызова
      const { data, error } = await supabase
        .from('challenges_with_creator')
        .select(`
          title,
          description,
          rules,
          entry_price,
          entry_currency,
          contact_info,
          payment_method,
          payment_description,
          creator_username,
          duration_days,
          max_participants,
          has_rating
        `)
        .eq('id', challengeId)
        .single();

      if (error) {
        console.error('❌ [PAID] Ошибка загрузки:', error);
        setError(error.message);
        setLoading(false);
        return;
      }

      console.log('✅ [PAID] Данные вызова получены:', data);
      setChallenge(data);

      // Загружаем количество участников
      console.log('👥 [PAID] Запрос количества участников...');
      const { count, error: countError } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId);

      if (countError) {
        console.error('❌ [PAID] Ошибка подсчета участников:', countError);
      } else {
        console.log('✅ [PAID] Участников:', count);
        setParticipantsCount(count ?? 0);
      }
    } catch (err) {
      console.error('💥 [PAID] Непредвиденная ошибка:', err);
      setError('Произошла ошибка при загрузке');
    } finally {
      setLoading(false);
      console.log('🏁 [PAID] Загрузка завершена');
    }
  }

  const handleSendRequest = async () => {
    console.log('📤 [PAID] Отправка запроса на вступление');
    
    if (requestSent) {
      console.log('⚠️ [PAID] Запрос уже отправлен');
      return;
    }

    setRequestSent(true);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      console.error('❌ [PAID] Нет данных пользователя Telegram');
      setRequestSent(false);
      return;
    }
    console.log('👤 [PAID] Пользователь Telegram:', tgUser);

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .single();

    if (userError || !user) {
      console.error('❌ [PAID] Пользователь не найден в БД:', userError);
      setRequestSent(false);
      return;
    }
    console.log('✅ [PAID] Найден пользователь в БД:', user);

    const { error: insertError } = await supabase
      .from('entry_requests')
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        status: 'pending',
      });

    if (insertError) {
      if (insertError.code !== '23505') {
        console.error('❌ [PAID] Ошибка создания заявки:', insertError);
        setRequestSent(false);
        return;
      } else {
        console.log('ℹ️ [PAID] Заявка уже существует (дубликат)');
      }
    } else {
      console.log('✅ [PAID] Заявка успешно создана');
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'transfer': return 'Перевод';
      case 'agreement': return 'Договорённость';
      case 'link': return 'Ссылка';
      default: return method;
    }
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

  if (error || !challenge) {
    return (
      <SafeArea>
        <Header>
          <HeaderRow>
            <BackButton onClick={onBack}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </BackButton>
            <Title>Ошибка</Title>
          </HeaderRow>
        </Header>
        <Content>
          <Card>
            <Value>{error || 'Вызов не найден'}</Value>
          </Card>
        </Content>
      </SafeArea>
    );
  }

  const limitReached = challenge.max_participants 
    ? participantsCount >= challenge.max_participants 
    : false;

  console.log('🎨 [PAID] Рендер с данными:', {
    title: challenge.title,
    participantsCount,
    limitReached
  });

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
            @{challenge.creator_username}
          </CreatorBadge>

          <Field>
            <Label>Описание</Label>
            <Value>{challenge.description}</Value>
          </Field>

          {challenge.rules && (
            <Field>
              <Label>Правила</Label>
              <Value style={{ whiteSpace: 'pre-wrap' }}>{challenge.rules}</Value>
            </Field>
          )}

          <Divider />

          {/* Условия входа - минималистично */}
          <PriceTag>
            {challenge.entry_price} {challenge.entry_currency.toUpperCase()}
          </PriceTag>

          <Field>
            <Label>Способ оплаты</Label>
            <Value>{getPaymentMethodLabel(challenge.payment_method)}</Value>
          </Field>

          {challenge.payment_description && (
            <Field>
              <Label>Комментарий</Label>
              <Value>{challenge.payment_description}</Value>
            </Field>
          )}

          <ContactInfo>
            <Label>Контакт</Label>
            <Value>@{challenge.contact_info.replace('@', '')}</Value>
          </ContactInfo>

          <Divider />

          {/* Информация в сетке */}
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Длительность</InfoLabel>
              <InfoValue>{challenge.duration_days} дней</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Участники</InfoLabel>
              <InfoValue>
                {participantsCount}
                {challenge.max_participants && ` / ${challenge.max_participants}`}
              </InfoValue>
            </InfoItem>
          </InfoGrid>

          {challenge.has_rating && (
            <MetaRow>
              <MetaText>Есть рейтинг и награды</MetaText>
            </MetaRow>
          )}

          {limitReached && (
            <WarningBox>
              ⚠️ Лимит участников достигнут
            </WarningBox>
          )}

          <RuleBox>
            <RuleIcon>💰</RuleIcon>
            <RuleText>
              Оплатите и отправьте запрос автору
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
            ? 'Мест нет' 
            : requestSent 
              ? 'Запрос отправлен' 
              : 'Отправить запрос'}
        </RequestButton>
        <RequestHint>
          {limitReached 
            ? 'Лимит участников исчерпан' 
            : requestSent
              ? 'Ожидайте подтверждения автора'
              : 'Автор проверит оплату и подтвердит участие'}
        </RequestHint>
      </Footer>
    </SafeArea>
  );
}