import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import {
  SafeArea,
  Container,
  HeaderRow,
  BackButton,
  Title,
  Section,
  RequestCard,
  UserInfo,
  Username,
  ApproveButton,
  EmptyState,
  EmptyIcon,
  EmptyText,
  LimitReached,
} from './styles';

type Props = {
  challengeId: string;
  onBack: () => void;
};

type Request = {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  users: {
    telegram_id: string;
    telegram_username: string | null;
    first_name: string | null;
  };
};

type ChallengeInfo = {
  max_participants: number | null;
  entry_type: 'free' | 'paid' | 'condition';
};

// Тип для сырых данных заявок (без users)
type RawRequest = {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
};

export default function EntryRequests({ challengeId, onBack }: Props) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [challenge, setChallenge] = useState<ChallengeInfo | null>(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [challengeId]);

  async function loadData() {
    // 1️⃣ Загружаем информацию о вызове
    const { data: challengeData } = await supabase
      .from('challenges')
      .select('max_participants, entry_type')
      .eq('id', challengeId)
      .single();

    setChallenge(challengeData);

    // 2️⃣ Считаем текущих участников
    const { count } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId);

    setParticipantsCount(count ?? 0);

    // 3️⃣ Загружаем заявки (без join)
    const { data: requestsData } = await supabase
      .from('entry_requests')
      .select(`
        id,
        user_id,
        status,
        created_at
      `)
      .eq('challenge_id', challengeId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (!requestsData || requestsData.length === 0) {
      setRequests([]);
      setLoading(false);
      return;
    }

    // 4️⃣ Получаем ID всех пользователей из заявок
    const userIds = requestsData.map(r => r.user_id);

    // 5️⃣ Загружаем информацию о пользователях отдельным запросом
    const { data: users } = await supabase
      .from('users')
      .select('id, telegram_id, telegram_username, first_name')
      .in('id', userIds);

    // 6️⃣ Создаем Map для быстрого доступа к пользователям по ID
    const usersMap = new Map(
      (users ?? []).map(u => [u.id, u])
    );

    // 7️⃣ Склеиваем заявки с пользователями
    const transformed = (requestsData as RawRequest[]).map(item => ({
      id: item.id,
      user_id: item.user_id,
      status: item.status as 'pending' | 'approved' | 'rejected',
      created_at: item.created_at,
      users: usersMap.get(item.user_id) ?? {
        telegram_id: '',
        telegram_username: null,
        first_name: null,
      },
    }));

    setRequests(transformed);
    setLoading(false);
  }

  const handleApprove = async (requestId: string, userId: string) => {
    if (!challenge) return;

    // Проверяем лимит
    if (challenge.max_participants && participantsCount >= challenge.max_participants) {
      alert('Лимит участников достигнут');
      return;
    }

    setProcessing(requestId);

    // 1️⃣ Обновляем статус заявки
    await supabase
      .from('entry_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    // 2️⃣ Добавляем пользователя в участники
    await supabase
      .from('participants')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
      });

    // 3️⃣ Обновляем счетчик
    setParticipantsCount(prev => prev + 1);

    // 4️⃣ Удаляем из списка
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setProcessing(null);
  };

  const getDisplayName = (user: Request['users']) => {
    // Сначала пробуем username
    if (user.telegram_username) {
      return `@${user.telegram_username}`;
    }
    // Если нет username, используем first_name
    if (user.first_name) {
      return user.first_name;
    }
    // В крайнем случае показываем ID
    return `ID: ${user.telegram_id}`;
  };

  if (loading) {
    return (
      <SafeArea>
        <Container>
          <HeaderRow>
            <BackButton onClick={onBack}>← Назад</BackButton>
            <Title>Заявки</Title>
          </HeaderRow>
          <Section>
            <EmptyText>Загрузка...</EmptyText>
          </Section>
        </Container>
      </SafeArea>
    );
  }

  const limitReached = challenge?.max_participants 
    ? participantsCount >= challenge.max_participants 
    : false;

  return (
    <SafeArea>
      <Container>
        <HeaderRow>
          <BackButton onClick={onBack}>← Назад</BackButton>
          <Title>Заявки на вступление</Title>
        </HeaderRow>

        <Section>
          {limitReached && (
            <LimitReached>
              ⚠️ Лимит участников достигнут ({participantsCount}/{challenge?.max_participants})
            </LimitReached>
          )}

          {requests.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📭</EmptyIcon>
              <EmptyText>Нет активных заявок</EmptyText>
            </EmptyState>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {requests.map(request => (
                <RequestCard key={request.id}>
                  <UserInfo>
                    <Username>{getDisplayName(request.users)}</Username>
                  </UserInfo>
                  <ApproveButton
                    onClick={() => handleApprove(request.id, request.user_id)}
                    disabled={processing === request.id || limitReached}
                  >
                    {processing === request.id ? '...' : '✔ Принять'}
                  </ApproveButton>
                </RequestCard>
              ))}
            </div>
          )}
        </Section>

        {/* Информация о лимите */}
        <Section>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Участников:</span>
            <strong>
              {participantsCount}
              {challenge?.max_participants ? ` / ${challenge.max_participants}` : ''}
            </strong>
          </div>
        </Section>
      </Container>
    </SafeArea>
  );
}