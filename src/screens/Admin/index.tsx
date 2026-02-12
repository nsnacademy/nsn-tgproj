import { useEffect, useState } from 'react';

import {
  SafeArea,
  Container,
  Title,
  Text,
  HeaderRow,
  List,
  ChallengeCard,
  ChallengeInfo,
  ChallengeTitle,
  ChallengeMeta,
  PendingBadge,
  ShareButton,
  CardActions,

  /* INVITE SETTINGS */
  InviteOverlay,
  InviteCard,
  InviteTitle,
  InviteRow,
  InviteLabel,
  InviteInput,
  InviteActions,
  InviteButton,
} from './styles';

import { Toggle, ToggleKnob } from '../Profile/styles';
import { BottomNav, NavItem } from '../Home/styles';

import {
  supabase,
  getCurrentUser,
  checkIsCreator,
} from '../../shared/lib/supabase';

type Screen =
  | 'home'
  | 'create'
  | 'profile'
  | 'admin'
  | 'admin-challenge';

type AdminProps = {
  screen: Screen;
  onNavigate: (screen: Screen, challengeId?: string) => void;
};

type AdminChallenge = {
  id: string;
  title: string;
  start_at: string;
  end_at: string | null;
  pending_count: number;
};

type InviteState = {
  id: string;
  code: string;
  is_active: boolean;
  max_uses: number | null;
};

export default function Admin({ screen, onNavigate }: AdminProps) {
  const [adminMode, setAdminMode] = useState(true);
  const [locked, setLocked] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState<InviteState | null>(null);

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();
      if (!user) return onNavigate('profile');

      const isCreator = await checkIsCreator(user.id);
      if (!isCreator) return onNavigate('profile');

      const { data, error } = await supabase.rpc(
        'get_admin_challenges',
        { p_creator_id: user.id }
      );

      if (error) return;
      setChallenges(data ?? []);
      setAccessChecked(true);
    }

    init();
  }, [onNavigate]);

  // 🔗 OPEN INVITE SETTINGS
  const openInvite = async (
    e: React.MouseEvent,
    challengeId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const user = await getCurrentUser();
    if (!user) return;

    const { data: existing } = await supabase
      .from('challenge_invites')
      .select('*')
      .eq('challenge_id', challengeId)
      .limit(1)
      .single();

    let inviteData = existing;

    if (!inviteData) {
      const { data } = await supabase.rpc(
        'create_challenge_invite',
        {
          p_challenge_id: challengeId,
          p_created_by: user.id,
        }
      );

      const { data: created } = await supabase
        .from('challenge_invites')
        .select('*')
        .eq('code', data)
        .single();

      inviteData = created;
    }

    setInvite(inviteData);
    setInviteOpen(true);
  };

  const updateInvite = async (patch: Partial<InviteState>) => {
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
    if (!invite) return;
    const link = `https://t.me/YOUR_BOT_USERNAME?startapp=invite_${invite.code}`;
    await navigator.clipboard.writeText(link);
    alert('Ссылка скопирована');
  };

  const onToggleBack = () => {
    if (locked) return;
    setAdminMode(false);
    setLocked(true);

    setTimeout(() => {
      onNavigate('profile');
      setLocked(false);
    }, 250);
  };

  if (!accessChecked) return null;

  return (
    <SafeArea>
      <Container>
        <HeaderRow>
          <Title>Админ-панель</Title>
          <Toggle $active={adminMode} onClick={onToggleBack}>
            <ToggleKnob $active={adminMode} />
          </Toggle>
        </HeaderRow>

        <Text>Мои вызовы</Text>

        <List>
          {challenges.map(ch => (
            <ChallengeCard
              key={ch.id}
              onClick={() =>
                onNavigate('admin-challenge', ch.id)
              }
            >
              <ChallengeInfo>
                <ChallengeTitle>{ch.title}</ChallengeTitle>
                <ChallengeMeta>
                  {new Date(ch.start_at).toLocaleDateString()} →
                  {ch.end_at
                    ? ` ${new Date(ch.end_at).toLocaleDateString()}`
                    : ' …'}
                </ChallengeMeta>
              </ChallengeInfo>

              <CardActions>
                <ShareButton
                  onClick={e => openInvite(e, ch.id)}
                >
                  🔗
                </ShareButton>

                {ch.pending_count > 0 && (
                  <PendingBadge>
                    {ch.pending_count}
                  </PendingBadge>
                )}
              </CardActions>
            </ChallengeCard>
          ))}
        </List>
      </Container>

      {/* INVITE SETTINGS */}
      {inviteOpen && invite && (
        <InviteOverlay onClick={() => setInviteOpen(false)}>
          <InviteCard onClick={e => e.stopPropagation()}>
            <InviteTitle>Приглашение</InviteTitle>

            <InviteRow>
              <InviteLabel>Приглашение активно</InviteLabel>
              <Toggle
                $active={invite.is_active}
                onClick={() =>
                  updateInvite({ is_active: !invite.is_active })
                }
              >
                <ToggleKnob $active={invite.is_active} />
              </Toggle>
            </InviteRow>

            <InviteRow>
              <InviteLabel>Лимит участников</InviteLabel>
              <InviteInput
                type="number"
                placeholder="0 = без лимита"
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
            </InviteRow>

            <InviteActions>
              <InviteButton onClick={copyLink}>
                Скопировать ссылку
              </InviteButton>
            </InviteActions>
          </InviteCard>
        </InviteOverlay>
      )}

      <BottomNav>
  {/* HOME */}
  <NavItem
    $active={screen === 'home'}
    onClick={() => onNavigate('home')}
  >
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  </NavItem>

  {/* CREATE */}
  <NavItem
    $active={screen === 'create'}
    onClick={() => onNavigate('create')}
  >
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  </NavItem>

  {/* STATS (ПОКА НЕТ ЭКРАНА) */}
  <NavItem
    $active={false}
    onClick={() => {}}
  >
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="6" y1="18" x2="6" y2="14" />
      <line x1="12" y1="18" x2="12" y2="10" />
      <line x1="18" y1="18" x2="18" y2="6" />
    </svg>
  </NavItem>

  {/* PROFILE */}
  <NavItem
    $active={screen === 'profile'}
    onClick={() => onNavigate('profile')}
  >
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </svg>
  </NavItem>
</BottomNav>
    </SafeArea>
  );
}
