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
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  Divider,
  CreatorBadge,
  MetaRow,
  MetaText,
  WarningBox,
  PrizePreview,
  PrizeItem,
  PrizePlace,
  PrizeTitle,
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
  duration_days: number;
  has_rating?: boolean;
  rules?: string | null;
};

type Prize = {
  place: number;
  title: string;
  description: string | null;
};

export default function ChallengeCondition({ challengeId, onBack }: Props) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // 👇 Новые состояния для проверки участия
  const [isParticipant, setIsParticipant] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  useEffect(() => {
    console.log('🔍 [CONDITION] Загрузка данных для challengeId:', challengeId);
    loadChallenge();
  }, [challengeId]);

  async function loadChallenge() {
    try {
      console.log('📥 [CONDITION] Запрос к challenges_with_creator...');
      
      // Загружаем данные вызова
      const { data, error } = await supabase
        .from('challenges_with_creator')
        .select(`
          title,
          description,
          rules,
          entry_condition,
          contact_info,
          max_participants,
          creator_username,
          duration_days,
          has_rating
        `)
        .eq('id', challengeId)
        .single();

      if (error) {
        console.error('❌ [CONDITION] Ошибка загрузки:', error);
        setError(error.message);
        setLoading(false);
        return;
      }

      console.log('✅ [CONDITION] Данные вызова получены:', data);
      setChallenge(data);

      // Загружаем количество участников
      console.log('👥 [CONDITION] Запрос количества участников...');
      const { count, error: countError } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId);

      if (countError) {
        console.error('❌ [CONDITION] Ошибка подсчета участников:', countError);
      } else {
        console.log('✅ [CONDITION] Участников:', count);
        setParticipantsCount(count ?? 0);
      }

      // 👇 Проверяем, участвует ли текущий пользователь
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      if (tgUser) {
        console.log('👤 [CONDITION] Проверка участия для пользователя:', tgUser.id);
        
        // Получаем user.id из таблицы users
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('telegram_id', tgUser.id)
          .single();

        if (user) {
          // Проверяем, есть ли пользователь в participants
          const { data: participant } = await supabase
            .from('participants')
            .select('id')
            .eq('user_id', user.id)
            .eq('challenge_id', challengeId)
            .maybeSingle();

          if (participant) {
            console.log('✅ [CONDITION] Пользователь уже участвует в вызове');
            setIsParticipant(true);
          }

          // Проверяем, есть ли у пользователя pending заявка
          const { data: pendingRequest } = await supabase
            .from('entry_requests')
            .select('id')
            .eq('user_id', user.id)
            .eq('challenge_id', challengeId)
            .eq('status', 'pending')
            .maybeSingle();

          if (pendingRequest) {
            console.log('⏳ [CONDITION] У пользователя есть активная заявка');
            setHasPendingRequest(true);
            setRequestSent(true);
          }
        }
      }

      // Загружаем награды, если есть рейтинг
      if (data.has_rating) {
        console.log('🏆 [CONDITION] Загрузка наград...');
        const { data: prizesData, error: prizesError } = await supabase
          .from('challenge_prizes')
          .select('place, title, description')
          .eq('challenge_id', challengeId)
          .order('place', { ascending: true });

        if (prizesError) {
          console.error('❌ [CONDITION] Ошибка загрузки наград:', prizesError);
        } else {
          console.log('✅ [CONDITION] Награды загружены:', prizesData?.length || 0);
          console.log('📋 [CONDITION] Список наград:', prizesData);
          setPrizes(prizesData || []);
        }
      } else {
        console.log('ℹ️ [CONDITION] У вызова нет рейтинга');
      }
    } catch (err) {
      console.error('💥 [CONDITION] Непредвиденная ошибка:', err);
      setError('Произошла ошибка при загрузке');
    } finally {
      setLoading(false);
      console.log('🏁 [CONDITION] Загрузка завершена');
    }
  }

  const handleSendRequest = async () => {
    console.log('📤 [CONDITION] Отправка запроса на вступление');
    
    if (requestSent || isParticipant || hasPendingRequest) {
      console.log('⚠️ [CONDITION] Запрос уже отправлен или пользователь уже участвует');
      return;
    }

    setRequestSent(true);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      console.error('❌ [CONDITION] Нет данных пользователя Telegram');
      setRequestSent(false);
      return;
    }
    console.log('👤 [CONDITION] Пользователь Telegram:', tgUser);

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .single();

    if (userError || !user) {
      console.error('❌ [CONDITION] Пользователь не найден в БД:', userError);
      setRequestSent(false);
      return;
    }
    console.log('✅ [CONDITION] Найден пользователь в БД:', user);

    const { error: insertError } = await supabase
      .from('entry_requests')
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        status: 'pending',
      });

    if (insertError) {
      if (insertError.code !== '23505') {
        console.error('❌ [CONDITION] Ошибка создания заявки:', insertError);
        setRequestSent(false);
        return;
      } else {
        console.log('ℹ️ [CONDITION] Заявка уже существует (дубликат)');
        setHasPendingRequest(true);
      }
    } else {
      console.log('✅ [CONDITION] Заявка успешно создана');
      setHasPendingRequest(true);
    }
  };

  const getPlaceText = (place: number) => {
    return `${place} место`;
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

  console.log('🎨 [CONDITION] Рендер с данными:', {
    title: challenge.title,
    participantsCount,
    prizesCount: prizes.length,
    limitReached,
    isParticipant,
    hasPendingRequest
  });

  // Определяем текст и состояние кнопки
  let buttonText = 'Отправить запрос';
  let buttonDisabled = false;
  let hintText = 'Автор проверит условие и подтвердит участие';

  if (isParticipant) {
    buttonText = '✓ Вы участвуете';
    buttonDisabled = true;
    hintText = 'Вы уже участник этого вызова';
  } else if (hasPendingRequest || requestSent) {
    buttonText = '⏳ Запрос отправлен';
    buttonDisabled = true;
    hintText = 'Ожидайте подтверждения автора';
  } else if (limitReached) {
    buttonText = '❌ Мест нет';
    buttonDisabled = true;
    hintText = 'Лимит участников исчерпан';
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

          {/* Условия входа */}
          <ConditionBox>
            <Label>Условие входа</Label>
            <Value>{challenge.entry_condition}</Value>
          </ConditionBox>

          <ContactInfo>
            <Label>Контакт</Label>
            <Value>@{challenge.contact_info.replace('@', '')}</Value>
          </ContactInfo>

          {challenge.max_participants && (
            <LimitBadge>
              Лимит: {challenge.max_participants} участников
            </LimitBadge>
          )}

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

          {/* Награды */}
          {challenge.has_rating && prizes.length > 0 && (
            <>
              <MetaRow>
                <MetaText>Награды</MetaText>
              </MetaRow>
              <PrizePreview>
                {prizes.map(prize => (
                  <PrizeItem key={prize.place}>
                    <PrizePlace>{getPlaceText(prize.place)}</PrizePlace>
                    <PrizeTitle>{prize.title}</PrizeTitle>
                  </PrizeItem>
                ))}
              </PrizePreview>
            </>
          )}

          {limitReached && (
            <WarningBox>
              ⚠️ Лимит участников достигнут
            </WarningBox>
          )}

          <RuleBox>
            <RuleIcon>🔒</RuleIcon>
            <RuleText>
              Выполните условие и отправьте запрос автору
            </RuleText>
          </RuleBox>
        </Card>
      </Content>

      <Footer>
        <RequestButton 
          onClick={handleSendRequest}
          disabled={buttonDisabled}
          $isSent={hasPendingRequest || requestSent || isParticipant}
          $disabled={buttonDisabled}
        >
          {buttonText}
        </RequestButton>
        <RequestHint>
          {hintText}
        </RequestHint>
      </Footer>
    </SafeArea>
  );
}