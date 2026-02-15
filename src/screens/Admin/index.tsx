import { useEffect, useState } from 'react';

import {
  SafeArea,
  Container,
  Header,
  HeaderRow,
  HeaderTitle,
  HeaderSubtitle,
  StatsCard,
  StatsGrid,
  StatItem,
  StatValue,
  StatLabel,
  Content,
  SectionTitle,
  ChallengeGrid,
  ChallengeCard,
  CardHeader,
  CardTitle,
  CardMeta,
  CardStats,
  CardStat,
  CardStatValue,
  CardStatLabel,
  CardActions,
  ActionButton,
  PendingBadge,
  EmptyState,
  EmptyIcon,
  EmptyText,
  LoadingState,
  ToggleContainer,
  Toggle,
  ToggleKnob,
} from './styles';

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
  | 'admin-challenge'
  | 'invite-settings';

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
  participants_count?: number;
  status?: 'active' | 'completed';
  entry_type?: 'free' | 'paid' | 'condition';
};

export default function Admin({ screen, onNavigate }: AdminProps) {
  const [adminMode, setAdminMode] = useState(true);
  const [locked, setLocked] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Состояние для общего количества заявок
  const [totalRequestsCount, setTotalRequestsCount] = useState(0);

  /* =========================
     INIT
  ========================= */

  useEffect(() => {
    async function init() {
      console.log('[ADMIN] init');
      setLoading(true);

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

      // Загружаем вызовы
      const { data, error } = await supabase.rpc(
        'get_admin_challenges',
        { p_creator_id: user.id }
      );

      if (error) {
        console.error('[ADMIN] load error', error);
        setLoading(false);
        return;
      }

      console.log('[ADMIN] challenges loaded', data);
      
      // Добавляем статус для каждого вызова
      const challengesWithStatus = (data ?? []).map((ch: AdminChallenge) => ({
        ...ch,
        status: new Date(ch.end_at || '') < new Date() ? 'completed' : 'active'
      }));
      
      setChallenges(challengesWithStatus);

      // Загружаем количество участников для каждого вызова
      await loadParticipantsCount(challengesWithStatus);

      // Загружаем общее количество заявок по всем вызовам
      await loadTotalRequests(challengesWithStatus);

      setAccessChecked(true);
      setLoading(false);
    }

    init();
  }, [onNavigate]);

  /* =========================
     ЗАГРУЗКА КОЛИЧЕСТВА УЧАСТНИКОВ ДЛЯ КАЖДОГО ВЫЗОВА
  ========================= */

  const loadParticipantsCount = async (challengesData: AdminChallenge[]) => {
    if (!challengesData.length) return;

    const updatedChallenges = [...challengesData];

    for (let i = 0; i < updatedChallenges.length; i++) {
      const ch = updatedChallenges[i];
      
      const { count, error } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', ch.id);

      if (!error) {
        updatedChallenges[i] = {
          ...ch,
          participants_count: count || 0
        };
      }
    }

    setChallenges(updatedChallenges);
  };

  /* =========================
     ЗАГРУЗКА ОБЩЕГО КОЛИЧЕСТВА ЗАЯВОК
  ========================= */

  const loadTotalRequests = async (challengesData?: AdminChallenge[]) => {
    const challengesToUse = challengesData || challenges;
    
    if (challengesToUse && challengesToUse.length > 0) {
      const challengeIds = challengesToUse.map((ch: AdminChallenge) => ch.id);
      
      const { count, error: countError } = await supabase
        .from('entry_requests')
        .select('*', { count: 'exact', head: true })
        .in('challenge_id', challengeIds)
        .eq('status', 'pending');

      if (!countError) {
        setTotalRequestsCount(count || 0);
      }
    }
  };

  /* =========================
     REAL-TIME ПОДПИСКА НА ИЗМЕНЕНИЯ ЗАЯВОК
  ========================= */

  useEffect(() => {
    if (!challenges.length) return;

    const challengeIds = challenges.map(ch => ch.id);
    
    // Создаем канал для отслеживания изменений
    const channel = supabase
      .channel('admin-requests-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'entry_requests' 
        },
        async (payload) => {
          console.log('[ADMIN] Изменение в заявках:', payload);
          
          // Обновляем общее количество заявок
          const { count, error } = await supabase
            .from('entry_requests')
            .select('*', { count: 'exact', head: true })
            .in('challenge_id', challengeIds)
            .eq('status', 'pending');

          if (!error) {
            setTotalRequestsCount(count || 0);
          }

          // Проверяем, является ли это обновлением статуса заявки
          const payloadAny = payload as any;
          if (payloadAny.eventType === 'UPDATE' && 
              payloadAny.new?.status === 'approved' && 
              payloadAny.old?.status === 'pending') {
            
            const challengeId = payloadAny.new.challenge_id;
            
            const { count: participantsCount } = await supabase
              .from('participants')
              .select('*', { count: 'exact', head: true })
              .eq('challenge_id', challengeId);

            setChallenges(prev => 
              prev.map(ch => 
                ch.id === challengeId 
                  ? { ...ch, participants_count: participantsCount || 0 }
                  : ch
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [challenges]);

  /* =========================
     EXIT ADMIN
  ========================= */

  const onToggleBack = () => {
    if (locked) return;

    setAdminMode(false);
    setLocked(true);

    setTimeout(() => {
      onNavigate('profile');
      setLocked(false);
    }, 250);
  };

  /* =========================
     STATS
  ========================= */

  const totalChallenges = challenges.length;
  const activeChallenges = challenges.filter(c => c.status === 'active').length;
  const completedChallenges = challenges.filter(c => c.status === 'completed').length;

  if (!accessChecked || loading) {
    return (
      <SafeArea>
        <Container>
          <Header>
            <HeaderRow>
              <HeaderTitle>Админ-панель</HeaderTitle>
              <ToggleContainer>
                <Toggle $active={adminMode} onClick={onToggleBack}>
                  <ToggleKnob $active={adminMode} />
                </Toggle>
              </ToggleContainer>
            </HeaderRow>
          </Header>
          <Content>
            <LoadingState>Загрузка данных...</LoadingState>
          </Content>
        </Container>
        <BottomNav>
          <NavItem $active={screen === 'home'} onClick={() => onNavigate('home')}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
          </NavItem>
          <NavItem $active={screen === 'create'} onClick={() => onNavigate('create')}>
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
          <NavItem $active={screen === 'profile'} onClick={() => onNavigate('profile')}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
            </svg>
          </NavItem>
        </BottomNav>
      </SafeArea>
    );
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <SafeArea>
      <Container>
        <Header>
          <HeaderRow>
            <div>
              <HeaderTitle>Админ-панель</HeaderTitle>
              <HeaderSubtitle>Управление вашими вызовами</HeaderSubtitle>
            </div>
            <ToggleContainer>
              <Toggle $active={adminMode} onClick={onToggleBack}>
                <ToggleKnob $active={adminMode} />
              </Toggle>
            </ToggleContainer>
          </HeaderRow>
        </Header>

        <Content>
          {/* Статистика */}
          <StatsCard>
            <StatsGrid>
              <StatItem>
                <StatValue>{totalChallenges}</StatValue>
                <StatLabel>Всего вызовов</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{activeChallenges}</StatValue>
                <StatLabel>Активных</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{completedChallenges}</StatValue>
                <StatLabel>Завершено</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{totalRequestsCount}</StatValue>
                <StatLabel>Заявки</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsCard>

          {/* Список вызовов */}
          <SectionTitle>Мои вызовы</SectionTitle>

          {challenges.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="24" cy="24" r="22" />
                  <path d="M24 12v12l8 4" />
                </svg>
              </EmptyIcon>
              <EmptyText>У вас пока нет созданных вызовов</EmptyText>
            </EmptyState>
          ) : (
            <ChallengeGrid>
              {challenges.map(ch => (
                <ChallengeCard key={ch.id}>
                  <CardHeader>
                    <div style={{ flex: 1 }}>
                      <CardTitle>{ch.title}</CardTitle>
                      <CardMeta>
                        {new Date(ch.start_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short'
                        })}
                        {' → '}
                        {ch.end_at
                          ? new Date(ch.end_at).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short'
                            })
                          : 'бессрочно'}
                      </CardMeta>
                    </div>
                    
                    {ch.pending_count > 0 && (
                      <PendingBadge>{ch.pending_count}</PendingBadge>
                    )}
                  </CardHeader>

                  <CardStats>
                    <CardStat>
                      <CardStatValue>{ch.participants_count || 0}</CardStatValue>
                      <CardStatLabel>участников</CardStatLabel>
                    </CardStat>
                    <CardStat>
                      <CardStatValue>
                        {ch.status === 'active' ? '🟢' : '🔴'}
                      </CardStatValue>
                      <CardStatLabel>
                        {ch.status === 'active' ? 'Активен' : 'Завершён'}
                      </CardStatLabel>
                    </CardStat>
                  </CardStats>

                  <CardActions>
                    <ActionButton
                      onClick={() => {
                        console.log('[ADMIN] card click → admin-challenge', ch.id);
                        onNavigate('admin-challenge', ch.id);
                      }}
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5l7 7-7 7M5 12h14" />
                      </svg>
                      Отчеты
                    </ActionButton>
                    
                    <ActionButton
                      variant="secondary"
                      onClick={() => {
                        console.log('[ADMIN] open invite settings', ch.id);
                        onNavigate('invite-settings', ch.id);
                      }}
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12h16M12 4v16" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      Пригласить
                    </ActionButton>
                  </CardActions>
                </ChallengeCard>
              ))}
            </ChallengeGrid>
          )}
        </Content>
      </Container>

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