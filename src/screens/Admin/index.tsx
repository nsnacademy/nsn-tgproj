import { useEffect, useState } from 'react';

import {
  SafeArea,
  Container,
  Title,
  Text,
  HeaderRow,
  List,
  ChallengeCard,
  ChallengeTitle,
  ChallengeMeta,
  PendingBadge,
  ShareButton, // 🔗 INVITE
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

export default function Admin({ screen, onNavigate }: AdminProps) {
  const [adminMode, setAdminMode] = useState(true);
  const [locked, setLocked] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);

  // 🔒 защита админки
  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();
      if (!user) {
        onNavigate('profile');
        return;
      }

      const isCreator = await checkIsCreator(user.id);
      if (!isCreator) {
        onNavigate('profile');
        return;
      }

      const { data, error } = await supabase.rpc(
        'get_admin_challenges',
        { p_creator_id: user.id }
      );

      if (error) {
        console.error('[ADMIN] load challenges error', error);
        return;
      }

      setChallenges(data ?? []);
      setAccessChecked(true);
    }

    init();
  }, [onNavigate]);

  // 🔗 INVITE: копирование ссылки
  const handleShare = async (
    e: React.MouseEvent,
    challengeId: string
  ) => {
    e.stopPropagation();

    const user = await getCurrentUser();
    if (!user) return;

    // 1️⃣ пробуем получить существующий invite
    const { data: existing } = await supabase
      .from('challenge_invites')
      .select('code')
      .eq('challenge_id', challengeId)
      .eq('is_active', true)
      .limit(1)
      .single();

    let code = existing?.code;

    // 2️⃣ если нет — создаём
    if (!code) {
      const { data } = await supabase.rpc(
        'create_challenge_invite',
        {
          p_challenge_id: challengeId,
          p_created_by: user.id,
        }
      );

      code = data;
    }

    if (!code) return;

    const link = `https://t.me/YOUR_BOT_USERNAME?startapp=invite_${code}`;

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
        {/* HEADER */}
        <HeaderRow>
          <Title>Админ-панель</Title>

          <Toggle $active={adminMode} onClick={onToggleBack}>
            <ToggleKnob $active={adminMode} />
          </Toggle>
        </HeaderRow>

        <Text>Мои вызовы</Text>

        <List>
          {challenges.length === 0 ? (
            <Text style={{ marginTop: 16 }}>
              У вас пока нет вызовов для модерации
            </Text>
          ) : (
            challenges.map(ch => (
              <ChallengeCard
                key={ch.id}
                onClick={() =>
                  onNavigate('admin-challenge', ch.id)
                }
              >
                <div>
                  <ChallengeTitle>{ch.title}</ChallengeTitle>

                  <ChallengeMeta>
                    {new Date(ch.start_at).toLocaleDateString()} →
                    {ch.end_at
                      ? ` ${new Date(ch.end_at).toLocaleDateString()}`
                      : ' …'}
                  </ChallengeMeta>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {/* 🔗 INVITE */}
                  <ShareButton
                    onClick={e => handleShare(e, ch.id)}
                  >
                    🔗
                  </ShareButton>

                  {ch.pending_count > 0 && (
                    <PendingBadge>
                      {ch.pending_count}
                    </PendingBadge>
                  )}
                </div>
              </ChallengeCard>
            ))
          )}
        </List>
      </Container>

      {/* Bottom navigation */}
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
