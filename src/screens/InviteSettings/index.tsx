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
} from './styles';

import { supabase, getCurrentUser } from '../../shared/lib/supabase';

type InviteSettingsProps = {
  challengeId: string;
  onBack: () => void;
  onNavigateToRequests?: () => void; // для перехода к заявкам
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
  }; // 👈 объект, не массив
};

// 👇 Вспомогательный тип для сырых данных из Supabase
type RawParticipant = {
  id: string;
  user_id: string;
  users: {
    telegram_username: string | null;
    first_name: string | null;
    telegram_id: string;
  }[];
};

export default function InviteSettings({
  challengeId,
  onBack,
  onNavigateToRequests,
}: InviteSettingsProps) {
  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 ЛИМИТ ВЫЗОВА
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState<number | ''>('');
  const [participantsCount, setParticipantsCount] = useState(0);

  // 👥 УЧАСТНИКИ
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [entryType, setEntryType] = useState<'free' | 'paid' | 'condition'>('free');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  /* =========================
     LOAD
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

      // 👇 ПРАВИЛЬНАЯ ТРАНСФОРМАЦИЯ
      if (participantsData) {
        const transformed = (participantsData as RawParticipant[]).map(item => ({
          id: item.id,
          user_id: item.user_id,
          users: item.users[0] || {  // берем первый элемент массива
            telegram_username: null,
            first_name: null,
            telegram_id: '',
          },
        }));
        setParticipants(transformed);
      }

      // 4️⃣ COUNT PENDING REQUESTS (для paid/condition)
      if (challenge?.entry_type !== 'free') {
        const { count: requestsCount } = await supabase
          .from('entry_requests')
          .select('*', { count: 'exact', head: true })
          .eq('challenge_id', challengeId)
          .eq('status', 'pending');

        setPendingRequestsCount(requestsCount ?? 0);
      }

      setLoading(false);
    }

    load();
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

    // 3️⃣ удалить сам вызов
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

  /* =========================
     RENDER
  ========================= */

  if (loading || !invite) {
    return (
      <SafeArea>
        <Container>
          <Section>
            <Label>Загрузка…</Label>
          </Section>
        </Container>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <Container>
        <HeaderRow>
          <BackButton onClick={onBack}>← Назад</BackButton>
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

        {/* 👥 УЧАСТНИКИ */}
        <Section>
          <SectionHeader>
            <SectionTitle>👥 Участники ({participantsCount})</SectionTitle>
            
            {/* Кнопка заявок (только для paid/condition) */}
            {entryType !== 'free' && onNavigateToRequests && (
              <PrimaryButton 
                onClick={onNavigateToRequests}
                style={{ width: 'auto', padding: '8px 16px' }}
              >
                Заявки {pendingRequestsCount > 0 && `(${pendingRequestsCount})`}
              </PrimaryButton>
            )}
          </SectionHeader>

          {participants.length === 0 ? (
            <EmptyUsers>
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
                    ✕
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
            Удалить вызов
          </DangerButton>
        </Section>
      </Container>
    </SafeArea>
  );
}