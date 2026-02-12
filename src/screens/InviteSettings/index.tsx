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
  max_uses: number | null;
  uses_count: number;
};

export default function InviteSettings({
  challengeId,
  onBack,
}: InviteSettingsProps) {
  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD / CREATE INVITE
  ========================= */

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from('challenge_invites')
        .select('*')
        .eq('challenge_id', challengeId)
        .limit(1)
        .maybeSingle();

      let inviteData = existing;

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

  const copyLink = async () => {
    if (!invite || !invite.is_active) return;

    const link = `https://t.me/Projects365_bot?startapp=invite_${invite.code}`;
    await navigator.clipboard.writeText(link);
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
        {/* HEADER */}
        <HeaderRow>
          <BackButton onClick={onBack}>
            ← Назад
          </BackButton>

          <Title>Приглашение</Title>
        </HeaderRow>

        <Section>
          {/* TOGGLE */}
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

          {/* COPY LINK */}
          <PrimaryButton
            disabled={!invite.is_active}
            onClick={copyLink}
          >
            Скопировать ссылку
          </PrimaryButton>

          <Row>
            <Label>Лимит участников</Label>
            <Input
              type="number"
              placeholder="Без лимита"
              value={invite.max_uses ?? ''}
              onChange={e =>
                updateInvite({
                  max_uses:
                    e.target.value === ''
                      ? null
                      : Number(e.target.value),
                })
              }
            />
          </Row>

          <Row>
            <Label>Уже присоединились</Label>
            <Value>
              {invite.uses_count}
              {invite.max_uses
                ? ` / ${invite.max_uses}`
                : ''}
            </Value>
          </Row>
        </Section>
      </Container>
    </SafeArea>
  );
}
