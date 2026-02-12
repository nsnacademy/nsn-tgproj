import { useEffect, useState } from 'react';

import {
  SafeArea,
  Container,
  HeaderRow,
  BackButton,
  Title,
  Section,
  Row,
  Label,
  Value,
  Input,
  PrimaryButton,
  Toggle,
  ToggleKnob,
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

export default function InviteSettings({
  challengeId,
  onBack,
}: InviteSettingsProps) {
  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 ЛИМИТ ВЫЗОВА
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState<number | ''>('');
  const [participantsCount, setParticipantsCount] = useState(0);

  /* =========================
     LOAD
  ========================= */

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) return;

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

      // 2️⃣ CHALLENGE LIMIT
      const { data: challenge } = await supabase
        .from('challenges')
        .select('max_participants')
        .eq('id', challengeId)
        .single();

      if (challenge && challenge.max_participants !== null) {
        setLimitEnabled(true);
        setMaxParticipants(challenge.max_participants);
      }

      // 3️⃣ COUNT PARTICIPANTS
      const { count } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId);

      setParticipantsCount(count ?? 0);
      setLoading(false);
    }

    load();
  }, [challengeId]);

  /* =========================
     ACTIONS
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

  const copyLink = async () => {
    if (!invite || !invite.is_active) return;

    const link = `https://t.me/Projects365_bot?startapp=invite_${invite.code}`;
    await navigator.clipboard.writeText(link);
  };

  /* =========================
     🔥 DELETE CHALLENGE
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
          <Title>Приглашение</Title>
        </HeaderRow>

        <Section>
          {/* INVITE */}
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

          {/* LIMIT */}
          <Row>
            <Label>Лимит участников (на вызов)</Label>
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

        {/* 🔥 DELETE */}
        <Section>
          <PrimaryButton
            style={{
              background: '#ff3b30',
              color: '#fff',
            }}
            onClick={deleteChallenge}
          >
            Удалить вызов
          </PrimaryButton>
        </Section>
      </Container>
    </SafeArea>
  );
}
