import { useEffect, useState } from 'react';
import {
  SafeArea,
  Container,
  HeaderRow,
  Title,
  Section,
  Row,
  Label,
  Value,
  Input,
  Button,
  Footer,
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

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from('challenge_invites')
        .select('*')
        .eq('challenge_id', challengeId)
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

  if (loading || !invite) return null;

  const limitReached =
    invite.max_uses !== null &&
    invite.uses_count >= invite.max_uses;

  return (
    <SafeArea>
      <Container>
        <HeaderRow>
          <Button $secondary onClick={onBack}>
            ← Назад
          </Button>
          <Title>Приглашение</Title>
        </HeaderRow>

        <Section>
          <Row>
            <Label>Ссылка активна</Label>
            <Toggle
              $active={invite.is_active}
              $disabled={limitReached}
              onClick={() => {
                if (limitReached) return;
                supabase
                  .from('challenge_invites')
                  .update({ is_active: !invite.is_active })
                  .eq('id', invite.id)
                  .then(({ data }) => {
                    if (data) setInvite(data[0]);
                  });
              }}
            >
              <ToggleKnob $active={invite.is_active} />
            </Toggle>
          </Row>

          <Row>
            <Label>Лимит участников</Label>
            <Input
              type="number"
              placeholder="Без лимита"
              value={invite.max_uses ?? ''}
              onChange={e =>
                supabase
                  .from('challenge_invites')
                  .update({
                    max_uses:
                      e.target.value === ''
                        ? null
                        : Number(e.target.value),
                  })
                  .eq('id', invite.id)
                  .then(({ data }) => {
                    if (data) setInvite(data[0]);
                  })
              }
            />
          </Row>

          <Row>
            <Label>Уже присоединились</Label>
            <Value>
              {invite.uses_count}
              {invite.max_uses ? ` / ${invite.max_uses}` : ''}
            </Value>
          </Row>
        </Section>
      </Container>

      <Footer>
        <Button
          onClick={() =>
            navigator.clipboard.writeText(
              `https://t.me/Projects365_bot?startapp=invite_${invite.code}`
            )
          }
        >
          Скопировать ссылку
        </Button>
      </Footer>
    </SafeArea>
  );
}
