import { useEffect, useState } from 'react';

import {
  SafeArea,
  FixedHeader,
  HeaderRow,
  BackButton,
  Title,
  ScrollContent,
  Section,
  SectionHeader,
  SectionTitle,
  Row,
  Label,
  Value,
  Input,
  PrimaryButton,
  DangerButton,
  Toggle,
  ToggleKnob,
  UserList,
  UserCard,
  UserInfo,
  Username,
  UserRole,
  RemoveButton,
  EmptyUsers,
  RequestsSection,
  RequestsHeader,
  RequestsTitle,
  RequestCount,
  RequestList,
  RequestCard,
  RequestUserInfo,
  RequestUsername,
  RequestMeta,
  RequestDate,
  RequestActions,
  ApproveButton,
  RejectButton,
  LimitReached,
  EmptyRequests,
  RequestsToggle,
  InfoMessage,
  RequestAvatar,
  RequestBadge,
} from './styles';

import { supabase, getCurrentUser } from '../../shared/lib/supabase';

type InviteSettingsProps = {
  challengeId: string;
  onBack: () => void;
};

type Invite = {
  id: string;
  code: string;
  is_active: boolean;
};

type Participant = {
  id: string;
  user_id: string;
  users: {
    username: string | null;
    telegram_id: string;
  };
};

type Request = {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  users: {
    username: string | null;
    telegram_id: string;
  };
};

type RawParticipant = {
  id: string;
  user_id: string;
  users: Array<{
    username: string | null;
    telegram_id: string;
  }>;
};

export default function InviteSettings({
  challengeId,
  onBack,
}: InviteSettingsProps) {
  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRequests, setShowRequests] = useState(true);

  // 🔥 ЛИМИТ ВЫЗОВА
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState<number | ''>('');
  const [participantsCount, setParticipantsCount] = useState(0);

  // 👥 УЧАСТНИКИ
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [entryType, setEntryType] = useState<'free' | 'paid' | 'condition'>('free');

  // 📋 ЗАЯВКИ
  const [requests, setRequests] = useState<Request[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [processing, setProcessing] = useState<string | null>(null);

  /* =========================
     DEBUG LOGS
  ========================= */

  console.log('🎯 [RENDER] InviteSettings state:', {
    challengeId,
    loading,
    entryType,
    requestsCount: requests.length,
    pendingRequestsCount,
    participantsCount,
    limitEnabled,
    maxParticipants,
    showRequests
  });

  /* =========================
     LOAD INITIAL DATA
  ========================= */

  const loadAllData = async () => {
    console.log('🚀 [LOAD] Начало загрузки всех данных для challengeId:', challengeId);
    
    const user = await getCurrentUser();
    console.log('👤 [LOAD] Текущий пользователь:', user?.id);
    
    if (!user) {
      console.log('❌ [LOAD] Пользователь не найден');
      return;
    }

    // 0️⃣ CHALLENGE INFO
    console.log('📊 [LOAD] Загрузка информации о вызове...');
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('max_participants, entry_type')
      .eq('id', challengeId)
      .single();

    if (challengeError) {
      console.error('❌ [LOAD] Ошибка загрузки challenge:', challengeError);
    } else {
      console.log('✅ [LOAD] Данные challenge:', challenge);
      setEntryType(challenge.entry_type);
      if (challenge.max_participants !== null) {
        setLimitEnabled(true);
        setMaxParticipants(challenge.max_participants);
      }
    }

    // 1️⃣ INVITE
    console.log('🔗 [LOAD] Загрузка invite...');
    const { data: existingInvite, error: inviteError } = await supabase
      .from('challenge_invites')
      .select('*')
      .eq('challenge_id', challengeId)
      .limit(1)
      .maybeSingle();

    if (inviteError) {
      console.error('❌ [LOAD] Ошибка загрузки invite:', inviteError);
    }

    let inviteData = existingInvite;

    if (!inviteData) {
      console.log('🆕 [LOAD] Создание нового invite...');
      const { data: code, error: codeError } = await supabase.rpc(
        'create_challenge_invite',
        {
          p_challenge_id: challengeId,
          p_created_by: user.id,
          p_max_uses: null,
        }
      );

      if (codeError) {
        console.error('❌ [LOAD] Ошибка создания кода:', codeError);
      } else {
        console.log('✅ [LOAD] Создан код:', code);
        
        const { data: created, error: createdError } = await supabase
          .from('challenge_invites')
          .select('*')
          .eq('code', code)
          .single();

        if (createdError) {
          console.error('❌ [LOAD] Ошибка получения созданного invite:', createdError);
        } else {
          console.log('✅ [LOAD] Создан invite:', created);
          inviteData = created;
        }
      }
    } else {
      console.log('✅ [LOAD] Найден существующий invite:', inviteData);
    }

    setInvite(inviteData);

    // 2️⃣ COUNT PARTICIPANTS
    console.log('👥 [LOAD] Подсчет участников...');
    const { count, error: countError } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId);

    if (countError) {
      console.error('❌ [LOAD] Ошибка подсчета участников:', countError);
    } else {
      console.log('✅ [LOAD] Количество участников:', count);
      setParticipantsCount(count ?? 0);
    }

    // 3️⃣ LOAD PARTICIPANTS LIST
    console.log('📋 [LOAD] Загрузка списка участников...');
    const { data: participantsData, error: participantsError } = await supabase
      .from('participants')
      .select(`
        id,
        user_id,
        users (
          username,
          telegram_id
        )
      `)
      .eq('challenge_id', challengeId);

    if (participantsError) {
      console.error('❌ [LOAD] Ошибка загрузки участников:', participantsError);
    } else {
      console.log('✅ [LOAD] Загружено участников:', participantsData?.length || 0);
      
      if (participantsData) {
        console.log('📦 [LOAD] Сырые данные участников:', JSON.stringify(participantsData, null, 2));
        
        const transformed = (participantsData as RawParticipant[]).map(item => {
          console.log(`🔄 [LOAD] Обработка участника ${item.id}:`, {
            user_id: item.user_id,
            usersData: item.users,
            firstUser: item.users?.[0],
            hasUsers: !!item.users,
            usersLength: item.users?.length
          });
          
          // Если нет данных пользователя, пробуем загрузить их отдельно
          if (!item.users?.[0]?.telegram_id) {
            console.log(`⚠️ [LOAD] Нет данных пользователя для участника ${item.id}, пробуем загрузить...`);
            loadUserDataForParticipant(item.id, item.user_id);
          }
          
          return {
            id: item.id,
            user_id: item.user_id,
            users: item.users?.[0] || {
              username: null,
              telegram_id: '',
            },
          };
        });
        console.log('✅ [LOAD] Трансформированные участники:', transformed);
        setParticipants(transformed);
      }
    }

    // 4️⃣ LOAD PENDING REQUESTS
    console.log('📨 [LOAD] Загрузка заявок...');
    await loadRequests();

    setLoading(false);
    console.log('✅ [LOAD] Загрузка завершена');
  };

  // Функция для загрузки данных пользователя для участника
  const loadUserDataForParticipant = async (participantId: string, userId: string) => {
    console.log(`👤 [USER_DATA] Загрузка данных для пользователя ${userId}`);
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('username, telegram_id')
      .eq('id', userId)
      .single();

    if (error) {
      console.error(`❌ [USER_DATA] Ошибка загрузки пользователя ${userId}:`, error);
      return;
    }

    console.log(`✅ [USER_DATA] Получены данные для пользователя ${userId}:`, userData);

    if (userData) {
      setParticipants(prev => {
        const updated = prev.map(p => 
          p.id === participantId 
            ? { 
                ...p, 
                users: {
                  username: userData.username,
                  telegram_id: userData.telegram_id
                }
              }
            : p
        );
        console.log('✅ [USER_DATA] Обновленные участники:', updated);
        return updated;
      });
    }
  };

  /* =========================
     LOAD REQUESTS FUNCTION
  ========================= */

  const loadRequests = async () => {
    console.log('🔍 [REQUESTS] Загрузка заявок для challengeId:', challengeId);
    
    const { data: requestsData, error } = await supabase
      .from('entry_requests')
      .select(`
        id,
        user_id,
        status,
        created_at,
        users!inner (
          username,
          telegram_id
        )
      `)
      .eq('challenge_id', challengeId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ [REQUESTS] Ошибка загрузки заявок:', error);
      return;
    }

    console.log('✅ [REQUESTS] Загружено заявок (сырые данные):', requestsData?.length || 0);
    console.log('📦 [REQUESTS] Сырые данные заявок:', JSON.stringify(requestsData, null, 2));

    if (requestsData) {
      const rawData = requestsData as any[];
      
      const transformed = rawData.map(item => {
        console.log(`🔄 [REQUESTS] Обработка заявки ${item.id}:`, {
          user_id: item.user_id,
          status: item.status,
          created_at: item.created_at,
          users: item.users,
          username: item.users?.username,
          telegram_id: item.users?.telegram_id
        });
        
        return {
          id: item.id,
          user_id: item.user_id,
          status: item.status as 'pending' | 'approved' | 'rejected',
          created_at: item.created_at,
          users: item.users || {
            username: null,
            telegram_id: '',
          },
        };
      });
      
      console.log('✅ [REQUESTS] Трансформированные заявки:', transformed);
      setRequests(transformed);
      setPendingRequestsCount(transformed.length);
    } else {
      console.log('ℹ️ [REQUESTS] Нет данных о заявках');
      setRequests([]);
      setPendingRequestsCount(0);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [challengeId]);

  /* =========================
     REAL-TIME SUBSCRIPTION
  ========================= */

  useEffect(() => {
    console.log('🔌 [REALTIME] Установка подписки для challengeId:', challengeId);
    
    const subscription = supabase
      .channel(`entry_requests:${challengeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'entry_requests',
          filter: `challenge_id=eq.${challengeId}`,
        },
        async (payload) => {
          console.log('🆕 [REALTIME] ПОЛУЧЕНА НОВАЯ ЗАЯВКА!', payload);
          console.log('📦 [REALTIME] Payload:', JSON.stringify(payload, null, 2));
          
          const { data: userData, error } = await supabase
            .from('users')
            .select('username, telegram_id')
            .eq('id', payload.new.user_id)
            .single();

          if (error) {
            console.error('❌ [REALTIME] Ошибка загрузки пользователя:', error);
            return;
          }

          console.log('✅ [REALTIME] Данные пользователя:', userData);

          if (userData) {
            const newRequest: Request = {
              id: payload.new.id,
              user_id: payload.new.user_id,
              status: payload.new.status,
              created_at: payload.new.created_at,
              users: {
                username: userData.username,
                telegram_id: userData.telegram_id
              },
            };

            console.log('➕ [REALTIME] Добавляем новую заявку:', newRequest);
            setRequests(prev => {
              const exists = prev.some(r => r.id === newRequest.id);
              if (exists) {
                console.log('⚠️ [REALTIME] Заявка уже существует');
                return prev;
              }
              console.log('✅ [REALTIME] Заявка добавлена');
              return [...prev, newRequest];
            });
            setPendingRequestsCount(prev => {
              console.log('📊 [REALTIME] Счетчик был:', prev, 'стал:', prev + 1);
              return prev + 1;
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('🔌 [REALTIME] Статус подписки:', status);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [challengeId]);

  // Периодическая проверка
  useEffect(() => {
    console.log('⏱️ [INTERVAL] Установка интервала 5 секунд');
    const interval = setInterval(() => {
      console.log('🔄 [INTERVAL] Периодическая проверка...');
      loadRequests();
    }, 5000);

    return () => {
      console.log('⏱️ [INTERVAL] Очистка интервала');
      clearInterval(interval);
    };
  }, [challengeId]);

  /* =========================
     INVITE ACTIONS
  ========================= */

  const updateInvite = async (patch: Partial<Invite>) => {
    if (!invite) return;

    console.log('🔄 [INVITE] Обновление invite:', patch);
    const { data } = await supabase
      .from('challenge_invites')
      .update(patch)
      .eq('id', invite.id)
      .select()
      .single();

    console.log('✅ [INVITE] Invite обновлен:', data);
    setInvite(data);
  };

  const copyLink = async () => {
    if (!invite || !invite.is_active) return;

    const link = `https://t.me/nsndsc_bot?startapp=invite_${invite.code}`;
    await navigator.clipboard.writeText(link);
    alert('Ссылка скопирована!');
  };

  /* =========================
     LIMIT ACTIONS
  ========================= */

  const updateChallengeLimit = async (value: number | null) => {
    console.log('📊 [LIMIT] Обновление лимита:', value);
    await supabase
      .from('challenges')
      .update({ max_participants: value })
      .eq('id', challengeId);
  };

  const toggleLimit = async () => {
    console.log('🔄 [LIMIT] Переключение лимита, было:', limitEnabled);
    if (limitEnabled) {
      setLimitEnabled(false);
      setMaxParticipants('');
      await updateChallengeLimit(null);
    } else {
      const initial = participantsCount || 1;
      setLimitEnabled(true);
      setMaxParticipants(initial);
      await updateChallengeLimit(initial);
    }
  };

  const onChangeLimit = async (value: string) => {
    console.log('📝 [LIMIT] Изменение значения:', value);
    if (value === '') {
      setMaxParticipants('');
      await updateChallengeLimit(null);
      return;
    }

    const num = Number(value);
    if (Number.isNaN(num) || num < participantsCount) return;

    setMaxParticipants(num);
    await updateChallengeLimit(num);
  };

  /* =========================
     USER MANAGEMENT
  ========================= */

  const removeParticipant = async (participantId: string, userId: string) => {
    console.log('🗑️ [PARTICIPANT] Удаление участника:', { participantId, userId });
    
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить участника из вызова?'
    );

    if (!confirmed) return;

    await supabase
      .from('participants')
      .delete()
      .eq('id', participantId);

    await supabase
      .from('entry_requests')
      .delete()
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);

    setParticipants(prev => prev.filter(p => p.id !== participantId));
    setParticipantsCount(prev => prev - 1);
    console.log('✅ [PARTICIPANT] Участник удален');
  };

  /* =========================
     REQUEST MANAGEMENT - ИСПРАВЛЕНО
  ========================= */

  const handleApprove = async (requestId: string, userId: string) => {
    console.log('🟢 [APPROVE] Начало approve:', { requestId, userId });

    if (limitEnabled && maxParticipants && participantsCount >= Number(maxParticipants)) {
      console.log('⚠️ [APPROVE] Лимит участников достигнут');
      alert('Лимит участников достигнут');
      return;
    }

    setProcessing(requestId);

    // 1️⃣ Обновляем статус заявки
    const { error: updateError } = await supabase
      .from('entry_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    if (updateError) {
      console.error('❌ [APPROVE] Ошибка обновления заявки:', updateError);
      setProcessing(null);
      return;
    }
    console.log('✅ [APPROVE] Статус заявки обновлен');

    // 2️⃣ Добавляем пользователя в участники
    console.log('📝 [APPROVE] Добавление в участники...');
    const { error: insertError } = await supabase
      .from('participants')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
      });

    if (insertError) {
      console.error('❌ [APPROVE] Ошибка добавления участника:', insertError);
      setProcessing(null);
      return;
    }
    console.log('✅ [APPROVE] Пользователь добавлен в участники');

    // 3️⃣ Загружаем данные нового участника
    console.log('📝 [APPROVE] Загрузка данных нового участника...');
    const { data: newParticipant, error: participantError } = await supabase
      .from('participants')
      .select(`
        id,
        user_id,
        users!inner (
          username,
          telegram_id
        )
      `)
      .eq('challenge_id', challengeId)
      .eq('user_id', userId)
      .single();

    if (participantError) {
      console.error('❌ [APPROVE] Ошибка загрузки участника:', participantError);
    } else if (newParticipant) {
      console.log('✅ [APPROVE] Данные нового участника:', newParticipant);
      const rawParticipant = newParticipant as any;
      const transformed: Participant = {
        id: rawParticipant.id,
        user_id: rawParticipant.user_id,
        users: rawParticipant.users?.[0] || {
          username: null,
          telegram_id: '',
        },
      };
      setParticipants(prev => [...prev, transformed]);
    }

    setParticipantsCount(prev => prev + 1);
    setPendingRequestsCount(prev => prev - 1);
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setProcessing(null);
    
    console.log('✅ [APPROVE] Процесс approve завершен');
    
    // 👇 ОБНОВЛЯЕМ СТРАНИЦУ (перезагружаем все данные)
    await loadAllData();
  };

  const handleReject = async (requestId: string) => {
    console.log('🔴 [REJECT] Начало reject:', requestId);
    
    const confirmed = window.confirm('Отклонить заявку?');
    if (!confirmed) {
      console.log('ℹ️ [REJECT] Отменено пользователем');
      return;
    }

    setProcessing(requestId);

    const { error } = await supabase
      .from('entry_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) {
      console.error('❌ [REJECT] Ошибка отклонения заявки:', error);
      setProcessing(null);
      return;
    }

    console.log('✅ [REJECT] Заявка отклонена');
    setPendingRequestsCount(prev => prev - 1);
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setProcessing(null);
    
    // 👇 ОБНОВЛЯЕМ СТРАНИЦУ (перезагружаем все данные)
    await loadAllData();
  };

  const getDisplayName = (user: { username: string | null; telegram_id: string }) => {
    console.log('🔍 [getDisplayName] Получен user:', user);
    
    if (user?.username) {
      console.log('✅ [getDisplayName] Есть username:', user.username);
      return `@${user.username}`;
    }
    
    if (user?.telegram_id) {
      console.log('⚠️ [getDisplayName] Нет username, используем telegram_id:', user.telegram_id);
      return `ID: ${user.telegram_id}`;
    }
    
    console.log('❌ [getDisplayName] Нет данных о пользователе');
    return 'ID: неизвестно';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /* =========================
     DELETE CHALLENGE
  ========================= */

  const deleteChallenge = async () => {
    console.log('🗑️ [DELETE] Удаление вызова:', challengeId);
    
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить вызов?\nЭто действие необратимо.'
    );

    if (!confirmed) return;

    await supabase
      .from('participants')
      .delete()
      .eq('challenge_id', challengeId);

    await supabase
      .from('challenge_invites')
      .delete()
      .eq('challenge_id', challengeId);

    await supabase
      .from('entry_requests')
      .delete()
      .eq('challenge_id', challengeId);

    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', challengeId);

    if (error) {
      console.error('❌ [DELETE] Ошибка удаления:', error);
      return;
    }

    console.log('✅ [DELETE] Вызов удален');
    console.log('🔙 [NAVIGATION] Вызов onBack() после удаления');
    onBack(); // Возвращаемся в админ-панель
  };

  // 👇 Функция-обработчик для кнопки назад с логами
  const handleBackClick = () => {
    console.log('🔙 [NAVIGATION] Нажата кнопка назад');
    console.log('📍 [NAVIGATION] Текущий экран: InviteSettings, challengeId:', challengeId);
    console.trace('[NAVIGATION] Стек вызовов:');
    
    onBack();
  };

  const limitReached = Boolean(limitEnabled && maxParticipants && participantsCount >= Number(maxParticipants));
  const isProcessing = (requestId: string) => processing === requestId;

  if (loading || !invite) {
    return (
      <SafeArea>
        <FixedHeader>
          <HeaderRow>
            <BackButton onClick={handleBackClick}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              
            </BackButton>
            <Title>Управление вызовом</Title>
          </HeaderRow>
        </FixedHeader>
        <ScrollContent>
          <InfoMessage>Загрузка...</InfoMessage>
        </ScrollContent>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <FixedHeader>
        <HeaderRow>
          <BackButton onClick={handleBackClick}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Назад
          </BackButton>
          <Title>Управление вызовом</Title>
        </HeaderRow>
      </FixedHeader>

      <ScrollContent>
        {/* 🔗 ПРИГЛАШЕНИЕ */}
        <Section>
          <SectionHeader>
            <SectionTitle>🔗 Приглашение</SectionTitle>
          </SectionHeader>

          <Row>
            <Label>Ссылка активна</Label>
            <Toggle
              $active={invite.is_active}
              onClick={() =>
                updateInvite({ is_active: !invite.is_active })
              }
            >
              <ToggleKnob $active={invite.is_active} />
            </Toggle>
          </Row>

          <PrimaryButton
            disabled={!invite.is_active}
            onClick={copyLink}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <rect x="3" y="3" width="14" height="14" rx="2" />
              <path d="M8 12h8M12 8v8" />
            </svg>
            Скопировать ссылку
          </PrimaryButton>
        </Section>

        {/* 📊 ЛИМИТ УЧАСТНИКОВ */}
        <Section>
          <SectionHeader>
            <SectionTitle>📊 Лимит участников</SectionTitle>
          </SectionHeader>

          <Row>
            <Label>Ограничить</Label>
            <Toggle
              $active={limitEnabled}
              onClick={toggleLimit}
            >
              <ToggleKnob $active={limitEnabled} />
            </Toggle>
          </Row>

          <Row>
            <Label>Максимум</Label>
            <Input
              type="number"
              disabled={!limitEnabled}
              placeholder="Без лимита"
              value={maxParticipants}
              onChange={e => onChangeLimit(e.target.value)}
            />
          </Row>

          <Row>
            <Label>Уже присоединились</Label>
            <Value>
              {participantsCount}
              {limitEnabled && maxParticipants
                ? ` / ${maxParticipants}`
                : ''}
            </Value>
          </Row>
        </Section>

        {/* 📋 ЗАЯВКИ (только для paid/condition) */}
        {entryType !== 'free' && (
          <RequestsSection>
            <RequestsHeader>
              <RequestsTitle>
                📋 Заявки на вступление
                {pendingRequestsCount > 0 && (
                  <RequestCount>{pendingRequestsCount}</RequestCount>
                )}
              </RequestsTitle>
              <RequestsToggle onClick={() => setShowRequests(!showRequests)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={showRequests ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
                </svg>
              </RequestsToggle>
            </RequestsHeader>

            {showRequests && (
              <>
                {limitReached && (
                  <LimitReached>
                    ⚠️ Лимит участников достигнут ({participantsCount}/{maxParticipants})
                  </LimitReached>
                )}

                {requests.length === 0 ? (
                  <EmptyRequests>
                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '12px', opacity: 0.3 }}>
                      <circle cx="20" cy="20" r="18" />
                      <path d="M12 16l8 8 8-8" />
                    </svg>
                    Нет активных заявок
                  </EmptyRequests>
                ) : (
                  <RequestList>
                    {requests.map(request => {
                      const processingThis = isProcessing(request.id);
                      const disableButtons = processingThis || limitReached;
                      const displayName = getDisplayName(request.users);
                      const firstLetter = displayName.charAt(0).toUpperCase();
                      
                      console.log(`🖼️ [RENDER] Заявка ${request.id}:`, {
                        displayName,
                        firstLetter,
                        users: request.users
                      });
                      
                      return (
                        <RequestCard key={request.id}>
                          <RequestUserInfo>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <RequestAvatar>
                                {firstLetter}
                              </RequestAvatar>
                              <div style={{ flex: 1 }}>
                                <RequestUsername>
                                  {displayName}
                                  {!request.users?.username && (
                                    <RequestBadge>⚡</RequestBadge>
                                  )}
                                </RequestUsername>
                                <RequestMeta>
                                  <RequestDate>
                                    {formatDate(request.created_at)}
                                  </RequestDate>
                                </RequestMeta>
                              </div>
                            </div>
                          </RequestUserInfo>
                          <RequestActions>
                            <ApproveButton
                              onClick={() => handleApprove(request.id, request.user_id)}
                              disabled={disableButtons}
                              title="Принять заявку"
                            >
                              {processingThis ? '⋯' : '✓'}
                            </ApproveButton>
                            <RejectButton
                              onClick={() => handleReject(request.id)}
                              disabled={processingThis}
                              title="Отклонить заявку"
                            >
                              ✕
                            </RejectButton>
                          </RequestActions>
                        </RequestCard>
                      );
                    })}
                  </RequestList>
                )}
              </>
            )}
          </RequestsSection>
        )}

        {/* 👥 УЧАСТНИКИ */}
        <Section>
          <SectionHeader>
            <SectionTitle>👥 Участники ({participantsCount})</SectionTitle>
          </SectionHeader>

          {participants.length === 0 ? (
            <EmptyUsers>
              <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '12px', opacity: 0.3 }}>
                <circle cx="20" cy="10" r="4" />
                <path d="M5 26c1.5-4 5-6 15-6s13.5 2 15 6" />
              </svg>
              Пока нет участников
            </EmptyUsers>
          ) : (
            <UserList>
              {participants.map(p => {
                const displayName = getDisplayName(p.users);
                const firstLetter = displayName.charAt(0).toUpperCase();
                
                console.log(`🖼️ [RENDER] Участник ${p.id}:`, {
                  displayName,
                  firstLetter,
                  users: p.users
                });
                
                return (
                  <UserCard key={p.id}>
                    <UserInfo>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <RequestAvatar style={{ background: 'rgba(255,255,255,0.1)' }}>
                          {firstLetter}
                        </RequestAvatar>
                        <div>
                          <Username>{displayName}</Username>
                          <UserRole></UserRole>
                        </div>
                      </div>
                    </UserInfo>
                    <RemoveButton onClick={() => removeParticipant(p.id, p.user_id)} title="Удалить участника">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 1l12 12M13 1L1 13" />
                      </svg>
                    </RemoveButton>
                  </UserCard>
                );
              })}
            </UserList>
          )}
        </Section>

        {/* 🗑️ УДАЛЕНИЕ ВЫЗОВА */}
        <Section>
          <SectionHeader>
            <SectionTitle>🗑️ Опасная зона</SectionTitle>
          </SectionHeader>
          
          <DangerButton onClick={deleteChallenge}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Удалить вызов
          </DangerButton>
        </Section>
      </ScrollContent>
    </SafeArea>
  );
}