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
    username: string | null;
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
    console.log('🔍 [ENTRY_REQUESTS] Загрузка данных для challengeId:', challengeId);
    
    // 1️⃣ Загружаем информацию о вызове
    const { data: challengeData, error: challengeError } = await supabase
      .from('challenges')
      .select('max_participants, entry_type')
      .eq('id', challengeId)
      .single();

    if (challengeError) {
      console.error('❌ [ENTRY_REQUESTS] Ошибка загрузки challenge:', challengeError);
    } else {
      console.log('✅ [ENTRY_REQUESTS] Challenge данные:', challengeData);
    }
    
    setChallenge(challengeData);

    // 2️⃣ Считаем текущих участников
    const { count, error: countError } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId);

    if (countError) {
      console.error('❌ [ENTRY_REQUESTS] Ошибка подсчета участников:', countError);
    } else {
      console.log('✅ [ENTRY_REQUESTS] Количество участников:', count);
    }

    setParticipantsCount(count ?? 0);

    // 3️⃣ Загружаем заявки (без join)
    const { data: requestsData, error: requestsError } = await supabase
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

    if (requestsError) {
      console.error('❌ [ENTRY_REQUESTS] Ошибка загрузки заявок:', requestsError);
    } else {
      console.log('✅ [ENTRY_REQUESTS] Загружено заявок:', requestsData?.length || 0);
      console.log('📋 [ENTRY_REQUESTS] Сырые данные заявок:', requestsData);
    }

    if (!requestsData || requestsData.length === 0) {
      console.log('ℹ️ [ENTRY_REQUESTS] Нет заявок, завершаем загрузку');
      setRequests([]);
      setLoading(false);
      return;
    }

    // 4️⃣ Получаем ID всех пользователей из заявок
    const userIds = requestsData.map(r => r.user_id);
    console.log('🔢 [ENTRY_REQUESTS] ID пользователей из заявок:', userIds);

    // 5️⃣ Загружаем информацию о пользователях отдельным запросом
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, telegram_id, username, first_name')
      .in('id', userIds);

    if (usersError) {
      console.error('❌ [ENTRY_REQUESTS] Ошибка загрузки пользователей:', usersError);
    } else {
      console.log('✅ [ENTRY_REQUESTS] Загружено пользователей:', users?.length || 0);
      console.log('👤 [ENTRY_REQUESTS] Данные пользователей:', users);
      
      // Детальный лог каждого пользователя
      users?.forEach(u => {
        console.log(`👤 Пользователь ${u.id}:`, {
          telegram_id: u.telegram_id,
          username: u.username,
          first_name: u.first_name,
          hasUsername: !!u.username,
          hasFirstName: !!u.first_name
        });
      });
    }

    // 6️⃣ Создаем Map для быстрого доступа к пользователям по ID
    const usersMap = new Map(
      (users ?? []).map(u => [u.id, u])
    );
    
    console.log('🗺️ [ENTRY_REQUESTS] Создан Map пользователей, размер:', usersMap.size);

    // 7️⃣ Склеиваем заявки с пользователями
    const transformed = (requestsData as RawRequest[]).map(item => {
      const userData = usersMap.get(item.user_id);
      
      // Лог для каждой заявки
      console.log(`🔄 [ENTRY_REQUESTS] Обработка заявки ${item.id}:`, {
        user_id: item.user_id,
        найденUser: !!userData,
        userData: userData,
        итоговыйUsername: userData?.username || null,
        итоговыйFirstName: userData?.first_name || null
      });

      return {
        id: item.id,
        user_id: item.user_id,
        status: item.status as 'pending' | 'approved' | 'rejected',
        created_at: item.created_at,
        users: userData ?? {
          telegram_id: '',
          username: null,
          first_name: null,
        },
      };
    });

    console.log('✅ [ENTRY_REQUESTS] Трансформированные данные:', transformed);
    
    // Проверяем конкретно username в итоговых данных
    transformed.forEach((t, index) => {
      console.log(`📊 [ENTRY_REQUESTS] Итоговая заявка ${index + 1}:`, {
        id: t.id,
        username: t.users.username,
        first_name: t.users.first_name,
        telegram_id: t.users.telegram_id,
        displayName: t.users.username ? `@${t.users.username}` : (t.users.first_name || `ID: ${t.users.telegram_id}`)
      });
    });

    setRequests(transformed);
    setLoading(false);
  }

  const handleApprove = async (requestId: string, userId: string) => {
    console.log('🟢 [ENTRY_REQUESTS] Нажатие Approve:', { requestId, userId });
    
    if (!challenge) {
      console.error('❌ [ENTRY_REQUESTS] Нет данных challenge');
      return;
    }

    // Проверяем лимит
    if (challenge.max_participants && participantsCount >= challenge.max_participants) {
      console.warn('⚠️ [ENTRY_REQUESTS] Лимит участников достигнут:', {
        current: participantsCount,
        max: challenge.max_participants
      });
      alert('Лимит участников достигнут');
      return;
    }

    setProcessing(requestId);
    console.log('⏳ [ENTRY_REQUESTS] Начало обработки approve');

    // 1️⃣ Обновляем статус заявки
    const { error: updateError } = await supabase
      .from('entry_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    if (updateError) {
      console.error('❌ [ENTRY_REQUESTS] Ошибка обновления заявки:', updateError);
      setProcessing(null);
      return;
    }
    console.log('✅ [ENTRY_REQUESTS] Заявка обновлена');

    // 2️⃣ Добавляем пользователя в участники
    const { error: insertError } = await supabase
      .from('participants')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
      });

    if (insertError) {
      console.error('❌ [ENTRY_REQUESTS] Ошибка добавления участника:', insertError);
    } else {
      console.log('✅ [ENTRY_REQUESTS] Участник добавлен');
    }

    // 3️⃣ Обновляем счетчик
    setParticipantsCount(prev => {
      const newCount = prev + 1;
      console.log('📊 [ENTRY_REQUESTS] Счетчик участников:', newCount);
      return newCount;
    });

    // 4️⃣ Удаляем из списка
    setRequests(prev => {
      const filtered = prev.filter(r => r.id !== requestId);
      console.log('🗑️ [ENTRY_REQUESTS] Заявка удалена из списка, осталось:', filtered.length);
      return filtered;
    });
    
    setProcessing(null);
    console.log('✅ [ENTRY_REQUESTS] Обработка approve завершена');
  };

  const getDisplayName = (user: Request['users']) => {
    console.log('🔍 [getDisplayName] Получен user:', user);
    
    if (user.username) {
      console.log('✅ Используем username:', user.username);
      return `@${user.username}`;
    }
    if (user.first_name) {
      console.log('✅ Используем first_name:', user.first_name);
      return user.first_name;
    }
    console.log('⚠️ Используем telegram_id:', user.telegram_id);
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

  console.log('🎨 [ENTRY_REQUESTS] Рендер с данными:', {
    requestsCount: requests.length,
    limitReached,
    participantsCount,
    maxParticipants: challenge?.max_participants
  });

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
              {requests.map(request => {
                const displayName = getDisplayName(request.users);
                console.log(`🖼️ [RENDER] Заявка ${request.id} отображается как:`, displayName);
                
                return (
                  <RequestCard key={request.id}>
                    <UserInfo>
                      <Username>{displayName}</Username>
                    </UserInfo>
                    <ApproveButton
                      onClick={() => handleApprove(request.id, request.user_id)}
                      disabled={processing === request.id || limitReached}
                    >
                      {processing === request.id ? '...' : '✔ Принять'}
                    </ApproveButton>
                  </RequestCard>
                );
              })}
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