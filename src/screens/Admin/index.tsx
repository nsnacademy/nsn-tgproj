import { useEffect, useState } from 'react';

import {
  SafeArea,
  Container,
  Title,
  Text,
  HeaderRow,
  List,

  CardRow,          // ✅ НОВАЯ ОБЁРТКА
  ChallengeCard,
  ChallengeTitle,
  ChallengeMeta,

  PendingBadge,
  ShareButton,

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

  /* =========================
     INIT
  ========================= */

  useEffect(() => {
    async function init() {
      console.log('[ADMIN] init');

      const user = await getCurrentUser();
      if (!user) {
        console.log('[ADMIN] no user');
        return onNavigate('profile');
      }

      const isCreator = await checkIsCreator(user.id);
      if (!isCreator) {
        console.log('[ADMIN] not creator');
        return onNavigate('profile');
      }

      const { data, error } = await supabase.rpc(
        'get_admin_challenges',
        { p_creator_id: user.id }
      );

      if (error) {
        console.error('[ADMIN] load error', error);
        return;
      }

      console.log('[ADMIN] challenges loaded', data);
      setChallenges(data ?? []);
      setAccessChecked(true);
    }

    init();
  }, [onNavigate]);

  /* =========================
     INVITE
  ========================= */

  const openInvite = async (
    e: React.MouseEvent,
    challengeId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('[ADMIN] openInvite click', challengeId);

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
      const { data: code } = await supabase.rpc(
        'create_challenge_invite',
        {
          p_challenge_id: challengeId,
          p_created_by: user.id,
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
    setInviteOpen(true);
  };

  const updateInvite = async (patch: Partial<InviteState>) => {
    if (!invite) return;

    console.log('[ADMIN] updateInvite', patch);

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

    console.log('[ADMIN] invite link copied', link);
    alert('Ссылка скопирована');
  };

  /* =========================
     EXIT ADMIN
  ========================= */

  const onToggleBack = () => {
    if (locked) return;

    console.log('[ADMIN] exit admin mode');

    setAdminMode(false);
    setLocked(true);

    setTimeout(() => {
      onNavigate('profile');
      setLocked(false);
    }, 250);
  };

  if (!accessChecked) return null;

  /* =========================
     RENDER
  ========================= */

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
            <CardRow key={ch.id}>
              {/* 🔲 КАРТОЧКА — ТОЛЬКО ПЕРЕХОД */}
              <ChallengeCard
                onClick={() => {
                  console.log(
                    '[ADMIN] card click → admin-challenge',
                    ch.id
                  );
                  onNavigate('admin-challenge', ch.id);
                }}
              >
                <ChallengeTitle>{ch.title}</ChallengeTitle>
                <ChallengeMeta>
                  {new Date(ch.start_at).toLocaleDateString()} →
                  {ch.end_at
                    ? ` ${new Date(ch.end_at).toLocaleDateString()}`
                    : ' …'}
                </ChallengeMeta>
              </ChallengeCard>

              {/* 🔗 ОТДЕЛЬНОЕ ДЕЙСТВИЕ */}
              <ShareButton
                type="button"
                onClick={e => openInvite(e, ch.id)}
              >
                🔗
              </ShareButton>

              {ch.pending_count > 0 && (
                <PendingBadge>
                  {ch.pending_count}
                </PendingBadge>
              )}
            </CardRow>
          ))}
        </List>
      </Container>

      {/* =========================
          INVITE SETTINGS
      ========================= */}

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

      {/* =========================
          BOTTOM NAV
      ========================= */}

      <BottomNav>
        <NavItem
          $active={screen === 'home'}
          onClick={() => onNavigate('home')}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>

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

        <NavItem $active={false}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="18" x2="6" y2="14" />
            <line x1="12" y1="18" x2="12" y2="10" />
            <line x1="18" y1="18" x2="18" y2="6" />
          </svg>
        </NavItem>

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
