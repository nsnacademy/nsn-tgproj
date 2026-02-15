import { useEffect, useState } from 'react';

import {
  SafeArea,
  Container,
  HeaderRow,
  BackButton,
  Title,
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
  RequestActions,
  ApproveButton,
  RejectButton,
  LimitReached,
  EmptyRequests,
  RequestsToggle,
  InfoMessage,
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
    telegram_username: string | null;
    first_name: string | null;
    telegram_id: string;
  };
};

type Request = {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  users: {
    telegram_username: string | null;
    first_name: string | null;
    telegram_id: string;
  };
};

type RawParticipant = {
  id: string;
  user_id: string;
  users: {
    telegram_username: string | null;
    first_name: string | null;
    telegram_id: string;
  }[];
};

type RawRequest = {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  users: {
    telegram_username: string | null;
    first_name: string | null;
    telegram_id: string;
  }[];
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
     LOAD INITIAL DATA
  ========================= */

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) return;

      // 0️⃣ CHALLENGE INFO
      const { data: challenge } = await supabase
        .from('challenges')
        .select('max_participants, entry_type')
        .eq('id', challengeId)
        .single();

      if (challenge) {
        setEntryType(challenge.entry_type);
        if (challenge.max_participants !== null) {
          setLimitEnabled(true);
          setMaxParticipants(challenge.max_participants);
        }
      }

      // 1️⃣ INVITE
      const { data: existingInvite } = await supabase
        .from('challenge_invites')
        .select('*')
        .eq('challenge_id', challengeId)
        .limit(1)
        .maybeSingle();

      let inviteData = existingInvite;

      if (!inviteData) {
        const { data: code } = await supabase.rpc(
          'create_challenge_invite',
          {
            p_challenge_id: challengeId,
            p_created_by: user.id,
            p_max_uses: null,
          }
        );

        const { data: created } = await supabase
          .from('challenge_invites')
          .select('*')
          .eq('code', code)
          .single();

        inviteData = created;
      }

      setInvite(inviteData);

      // 2️⃣ COUNT PARTICIPANTS
      const { count } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId);

      setParticipantsCount(count ?? 0);

      // 3️⃣ LOAD PARTICIPANTS LIST
      const { data: participantsData } = await supabase
        .from('participants')
        .select(`
          id,
          user_id,
          users (
            telegram_username,
            first_name,
            telegram_id
          )
        `)
        .eq('challenge_id', challengeId);

      if (participantsData) {
        const transformed = (participantsData as RawParticipant[]).map(item => ({
          id: item.id,
          user_id: item.user_id,
          users: item.users[0] || {
            telegram_username: null,
            first_name: null,
            telegram_id: '',
          },
        }));
        setParticipants(transformed);
      }

      // 4️⃣ LOAD PENDING REQUESTS
      await loadRequests();

      setLoading(false);
    }

    load();
  }, [challengeId]);

  /* =========================
     LOAD REQUESTS FUNCTION
  ========================= */

  const loadRequests = async () => {
    // Считаем количество
    const { count: requestsCount } = await supabase
      .from('entry_requests')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId)
      .eq('status', 'pending');

    setPendingRequestsCount(requestsCount ?? 0);

    // Загружаем сами заявки
    const { data: requestsData } = await supabase
      .from('entry_requests')
      .select(`
        id,
        user_id,
        status,
        created_at,
        users (
          telegram_username,
          first_name,
          telegram_id
        )
      `)
      .eq('challenge_id', challengeId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (requestsData) {
      const transformed = (requestsData as RawRequest[]).map(item => ({
        id: item.id,
        user_id: item.user_id,
        status: item.status as 'pending' | 'approved' | 'rejected',
        created_at: item.created_at,
        users: item.users[0] || {
          telegram_username: null,
          first_name: null,
          telegram_id: '',
        },
      }));
      setRequests(transformed);
    }
  };

  /* =========================
     REAL-TIME SUBSCRIPTION
  ========================= */

  useEffect(() => {
    // Подписываемся на новые заявки
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
          console.log('🆕 Новая заявка:', payload);
          
          // Загружаем данные нового пользователя
          const { data: userData } = await supabase
            .from('users')
            .select('telegram_username, first_name, telegram_id')
            .eq('id', payload.new.user_id)
            .single();

          if (userData) {
            const newRequest: Request = {
              id: payload.new.id,
              user_id: payload.new.user_id,
              status: payload.new.status,
              created_at: payload.new.created_at,
              users: userData,
            };

            setRequests(prev => [...prev, newRequest]);
            setPendingRequestsCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [challengeId]);

  /* =========================
     INVITE ACTIONS
  ========================= */

  const updateInvite = async (patch: Partial<Invite>) => {
    if (!invite) return;

    const { data } = await supabase
      .from('challenge_invites')
      .update(patch)
      .eq('id', invite.id)
      .select()
      .single();

    setInvite(data);
  };

  const copyLink = async () => {
    if (!invite || !invite.is_active) return;

    const link = `https://t.me/Projects365_bot?startapp=invite_${invite.code}`;
    await navigator.clipboard.writeText(link);
    alert('Ссылка скопирована!');
  };

  /* =========================
     LIMIT ACTIONS
  ========================= */

  const updateChallengeLimit = async (value: number | null) => {
    await supabase
      .from('challenges')
      .update({ max_participants: value })
      .eq('id', challengeId);
  };

  const toggleLimit = async () => {
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
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить участника из вызова?'
    );

    if (!confirmed) return;

    // Удаляем из participants
    await supabase
      .from('participants')
      .delete()
      .eq('id', participantId);

    // Если была заявка — удаляем или помечаем
    await supabase
      .from('entry_requests')
      .delete()
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);

    // Обновляем список
    setParticipants(prev => prev.filter(p => p.id !== participantId));
    setParticipantsCount(prev => prev - 1);
  };

  /* =========================
     REQUEST MANAGEMENT
  ========================= */

  const handleApprove = async (requestId: string, userId: string) => {
    console.log('🟢 [REQUESTS] Нажатие Approve:', { requestId, userId });

    // Проверяем лимит
    if (limitEnabled && maxParticipants && participantsCount >= Number(maxParticipants)) {
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
      console.error('❌ [REQUESTS] Ошибка обновления заявки:', updateError);
      setProcessing(null);
      return;
    }

    // 2️⃣ Добавляем пользователя в участники
    const { error: insertError } = await supabase
      .from('participants')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
      });

    if (insertError) {
      console.error('❌ [REQUESTS] Ошибка добавления участника:', insertError);
      setProcessing(null);
      return;
    }

    // 3️⃣ Загружаем данные нового участника
    const { data: newParticipant } = await supabase
      .from('participants')
      .select(`
        id,
        user_id,
        users (
          telegram_username,
          first_name,
          telegram_id
        )
      `)
      .eq('challenge_id', challengeId)
      .eq('user_id', userId)
      .single();

    if (newParticipant) {
      const transformed = {
        id: newParticipant.id,
        user_id: newParticipant.user_id,
        users: newParticipant.users[0] || {
          telegram_username: null,
          first_name: null,
          telegram_id: '',
        },
      };
      setParticipants(prev => [...prev, transformed]);
    }

    // 4️⃣ Обновляем счетчики
    setParticipantsCount(prev => prev + 1);
    setPendingRequestsCount(prev => prev - 1);

    // 5️⃣ Удаляем из списка заявок
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setProcessing(null);
  };

  const handleReject = async (requestId: string) => {
    const confirmed = window.confirm('Отклонить заявку?');
    if (!confirmed) return;

    setProcessing(requestId);

    const { error } = await supabase
      .from('entry_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) {
      console.error('❌ [REQUESTS] Ошибка отклонения заявки:', error);
      setProcessing(null);
      return;
    }

    setPendingRequestsCount(prev => prev - 1);
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setProcessing(null);
  };

  const getDisplayName = (user: Request['users']) => {
    if (user.telegram_username) return `@${user.telegram_username}`;
    if (user.first_name) return user.first_name;
    return `ID: ${user.telegram_id}`;
  };

  /* =========================
     DELETE CHALLENGE
  ========================= */

  const deleteChallenge = async () => {
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить вызов?\nЭто действие необратимо.'
    );

    if (!confirmed) return;

    // 1️⃣ удалить участников
    await supabase
      .from('participants')
      .delete()
      .eq('challenge_id', challengeId);

    // 2️⃣ удалить инвайты
    await supabase
      .from('challenge_invites')
      .delete()
      .eq('challenge_id', challengeId);

    // 3️⃣ удалить заявки
    await supabase
      .from('entry_requests')
      .delete()
      .eq('challenge_id', challengeId);

    // 4️⃣ удалить сам вызов
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', challengeId);

    if (error) {
      console.error('[DELETE CHALLENGE] error', error);
      return;
    }

    onBack();
  };

  const getUsername = (user: Participant['users']) => {
    if (user.telegram_username) return `@${user.telegram_username}`;
    if (user.first_name) return user.first_name;
    return `ID: ${user.telegram_id}`;
  };

  const limitReached = Boolean(limitEnabled && maxParticipants && participantsCount >= Number(maxParticipants));
  const isProcessing = (requestId: string) => processing === requestId;

  /* =========================
     RENDER
  ========================= */

  if (loading || !invite) {
    return (
      <SafeArea>
        <Container>
          <HeaderRow>
            <BackButton onClick={onBack}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </BackButton>
            <Title>Управление вызовом</Title>
          </HeaderRow>
          <Section>
            <InfoMessage>Загрузка...</InfoMessage>
          </Section>
        </Container>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <Container>
        <HeaderRow>
          <BackButton onClick={onBack}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
          <Title>Управление вызовом</Title>
        </HeaderRow>

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
                      
                      return (
                        <RequestCard key={request.id}>
                          <RequestUserInfo>
                            <RequestUsername>
                              {getDisplayName(request.users)}
                            </RequestUsername>
                          </RequestUserInfo>
                          <RequestActions>
                            <ApproveButton
                              onClick={() => handleApprove(request.id, request.user_id)}
                              disabled={disableButtons}
                            >
                              {processingThis ? '...' : '✓'}
                            </ApproveButton>
                            <RejectButton
                              onClick={() => handleReject(request.id)}
                              disabled={processingThis}
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
              {participants.map(p => (
                <UserCard key={p.id}>
                  <UserInfo>
                    <Username>{getUsername(p.users)}</Username>
                    <UserRole>участник</UserRole>
                  </UserInfo>
                  <RemoveButton onClick={() => removeParticipant(p.id, p.user_id)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 1l12 12M13 1L1 13" />
                    </svg>
                  </RemoveButton>
                </UserCard>
              ))}
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
      </Container>
    </SafeArea>
  );
}