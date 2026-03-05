import { useEffect, useState, useCallback, useMemo } from 'react';

import {
  SafeArea,
  FixedHeader,
  HeaderRow,
  HeaderTitle,
  HeaderSubtitle,
  ToggleContainer,
  Toggle,
  ToggleKnob,
  StatsCard,
  StatsGrid,
  StatItem,
  StatValue,
  StatLabel,
  ScrollContent,
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
  CardBadges,
  BadgeItem,
  BadgeIcon,
  BadgeText,
  CardActions,
  ActionButton,
  PendingBadge,
  EmptyState,
  EmptyIcon,
  EmptyText,
  SkeletonCard,
  SkeletonLine,
  SkeletonBadge,
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
  pending_reports_count?: number;
  pending_requests_count?: number;
};

// Кэш для данных
const adminCache = new Map<string, { data: AdminChallenge[]; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 минуты

// Скелетон для загрузки
const AdminSkeleton = () => (
  <>
    {[1, 2, 3].map((i) => (
      <SkeletonCard key={i}>
        <CardHeader>
          <div style={{ flex: 1 }}>
            <SkeletonLine width="70%" height={20} style={{ marginBottom: 8 }} />
            <SkeletonLine width="40%" height={14} />
          </div>
          <SkeletonBadge width="40px" height={28} />
        </CardHeader>
        <CardStats>
          <CardStat>
            <SkeletonLine width="30px" height={20} />
            <SkeletonLine width="60px" height={12} style={{ marginTop: 4 }} />
          </CardStat>
          <CardStat>
            <SkeletonLine width="30px" height={20} />
            <SkeletonLine width="40px" height={12} style={{ marginTop: 4 }} />
          </CardStat>
        </CardStats>
        <CardBadges>
          <SkeletonLine width="80px" height={24} style={{ borderRadius: 20 }} />
          <SkeletonLine width="70px" height={24} style={{ borderRadius: 20 }} />
        </CardBadges>
        <CardActions>
          <SkeletonLine width="100%" height={40} style={{ borderRadius: 10 }} />
          <SkeletonLine width="100%" height={40} style={{ borderRadius: 10 }} />
        </CardActions>
      </SkeletonCard>
    ))}
  </>
);

export default function Admin({ screen, onNavigate }: AdminProps) {
  const [adminMode, setAdminMode] = useState(true);
  const [locked, setLocked] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  /* =========================
     ПОЛУЧЕНИЕ USER ID
  ========================= */
  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      if (!user) {
        onNavigate('profile');
        return;
      }
      setUserId(user.id);
    }
    loadUser();
  }, [onNavigate]);

  /* =========================
     ЗАГРУЗКА ДАННЫХ
  ========================= */
  useEffect(() => {
    async function init() {
      if (!userId) return;
      
      console.log('[ADMIN] init');
      setLoading(true);

      const cacheKey = `admin_${userId}`;
      
      // Проверка кэша
      const cached = adminCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('[ADMIN] данные из кэша');
        setChallenges(cached.data);
        setAccessChecked(true);
        setLoading(false);
        return;
      }

      const isCreator = await checkIsCreator(userId);
      if (!isCreator) {
        onNavigate('profile');
        return;
      }

      // Загружаем вызовы
      const { data, error } = await supabase.rpc(
        'get_admin_challenges',
        { p_creator_id: userId }
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
        status: ch.end_at && new Date(ch.end_at) < new Date() ? 'completed' : 'active'
      }));
      
      // Загружаем дополнительные данные параллельно для всех вызовов
      const enhancedChallenges = await loadAdditionalDataParallel(challengesWithStatus);

      // Сохраняем в кэш
      adminCache.set(cacheKey, { data: enhancedChallenges, timestamp: Date.now() });
      
      setChallenges(enhancedChallenges);
      setAccessChecked(true);
      setLoading(false);
    }

    init();
  }, [userId, onNavigate]);

  /* =========================
     ПАРАЛЛЕЛЬНАЯ ЗАГРУЗКА ДАННЫХ
  ========================= */
  const loadAdditionalDataParallel = async (challengesData: AdminChallenge[]) => {
    if (!challengesData.length) return challengesData;

    // Создаем массив промисов для всех вызовов
    const promises = challengesData.map(async (ch) => {
      // Параллельные запросы для каждого вызова
      const [participantsCount, requestsCount, participants] = await Promise.all([
        supabase
          .from('participants')
          .select('*', { count: 'exact', head: true })
          .eq('challenge_id', ch.id)
          .then(({ count }) => count || 0),
          
        supabase
          .from('entry_requests')
          .select('*', { count: 'exact', head: true })
          .eq('challenge_id', ch.id)
          .eq('status', 'pending')
          .then(({ count }) => count || 0),
          
        supabase
          .from('participants')
          .select('id')
          .eq('challenge_id', ch.id)
          .then(({ data }) => data || [])
      ]);

      // Загружаем количество отчетов на проверке
      let pendingReportsCount = 0;
      if (participants.length > 0) {
        const participantIds = participants.map(p => p.id);
        const { count } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .in('participant_id', participantIds)
          .eq('status', 'pending');
        pendingReportsCount = count || 0;
      }

      return {
        ...ch,
        participants_count: participantsCount,
        pending_requests_count: requestsCount,
        pending_reports_count: pendingReportsCount
      };
    });

    // Ждем выполнения всех промисов параллельно
    return await Promise.all(promises);
  };

  /* =========================
     REAL-TIME ПОДПИСКА - ИСПРАВЛЕНО
  ========================= */
  useEffect(() => {
    if (!challenges.length) return;

    // Функция для обновления конкретного вызова
    const updateChallengeData = async (challengeId: string) => {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      const [requestsCount, participants] = await Promise.all([
        supabase
          .from('entry_requests')
          .select('*', { count: 'exact', head: true })
          .eq('challenge_id', challengeId)
          .eq('status', 'pending')
          .then(({ count }) => count || 0),
          
        supabase
          .from('participants')
          .select('id')
          .eq('challenge_id', challengeId)
          .then(({ data }) => data || [])
      ]);

      let pendingReportsCount = challenge.pending_reports_count || 0;
      if (participants.length > 0) {
        const participantIds = participants.map(p => p.id);
        const { count } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .in('participant_id', participantIds)
          .eq('status', 'pending');
        pendingReportsCount = count || 0;
      }

      setChallenges(prev => prev.map(c => 
        c.id === challengeId 
          ? { ...c, pending_requests_count: requestsCount, pending_reports_count: pendingReportsCount }
          : c
      ));
    };

    // Канал для заявок
    const requestsChannel = supabase
      .channel('admin-requests-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'entry_requests' 
        },
        (payload) => {
          console.log('[ADMIN] Изменение в заявках:', payload);
          // Используем type assertion для доступа к свойствам
          const newPayload = payload as any;
          if (newPayload.new?.challenge_id) {
            updateChallengeData(newPayload.new.challenge_id);
          }
        }
      )
      .subscribe();

    // Канал для отчетов
    const reportsChannel = supabase
      .channel('admin-reports-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'reports' 
        },
        async (payload) => {
          console.log('[ADMIN] Изменение в отчетах:', payload);
          const newPayload = payload as any;
          
          if (newPayload.new?.participant_id) {
            const { data } = await supabase
              .from('participants')
              .select('challenge_id')
              .eq('id', newPayload.new.participant_id)
              .single();
            if (data?.challenge_id) {
              await updateChallengeData(data.challenge_id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      requestsChannel.unsubscribe();
      reportsChannel.unsubscribe();
    };
  }, [challenges]);

  /* =========================
     EXIT ADMIN
  ========================= */
  const onToggleBack = useCallback(() => {
    if (locked) return;
    setAdminMode(false);
    setLocked(true);
    setTimeout(() => {
      onNavigate('profile');
      setLocked(false);
    }, 250);
  }, [locked, onNavigate]);

  /* =========================
     МЕМОИЗАЦИЯ СТАТИСТИКИ
  ========================= */
  const stats = useMemo(() => ({
    total: challenges.length,
    active: challenges.filter(c => c.status === 'active').length,
    completed: challenges.filter(c => c.status === 'completed').length,
  }), [challenges]);

  /* =========================
     ЗАГРУЗКА
  ========================= */
  if (!accessChecked || loading) {
    return (
      <SafeArea>
        <FixedHeader>
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
          <StatsCard>
            <StatsGrid>
              <StatItem>
                <SkeletonLine width="30px" height={22} />
                <StatLabel>Всего вызовов</StatLabel>
              </StatItem>
              <StatItem>
                <SkeletonLine width="30px" height={22} />
                <StatLabel>Активных</StatLabel>
              </StatItem>
              <StatItem>
                <SkeletonLine width="30px" height={22} />
                <StatLabel>Завершено</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsCard>
        </FixedHeader>
        <ScrollContent>
          <AdminSkeleton />
        </ScrollContent>
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
      <FixedHeader>
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

        <StatsCard>
          <StatsGrid>
            <StatItem>
              <StatValue>{stats.total}</StatValue>
              <StatLabel>Всего вызовов</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.active}</StatValue>
              <StatLabel>Активных</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.completed}</StatValue>
              <StatLabel>Завершено</StatLabel>
            </StatItem>
          </StatsGrid>
        </StatsCard>
      </FixedHeader>

      <ScrollContent>
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

                <CardBadges>
                  {ch.pending_reports_count ? (
                    <BadgeItem $type="report">
                      <BadgeIcon>📋</BadgeIcon>
                      <BadgeText>{ch.pending_reports_count} на проверке</BadgeText>
                    </BadgeItem>
                  ) : null}
                  
                  {ch.pending_requests_count ? (
                    <BadgeItem $type="request">
                      <BadgeIcon>📝</BadgeIcon>
                      <BadgeText>{ch.pending_requests_count} заявки</BadgeText>
                    </BadgeItem>
                  ) : null}
                </CardBadges>

                <CardActions>
                  <ActionButton
                    onClick={() => onNavigate('admin-challenge', ch.id)}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5l7 7-7 7M5 12h14" />
                    </svg>
                    Отчеты
                  </ActionButton>
                  
                  <ActionButton
                    variant="secondary"
                    onClick={() => onNavigate('invite-settings', ch.id)}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12h16M12 4v16" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    Управление
                  </ActionButton>
                </CardActions>
              </ChallengeCard>
            ))}
          </ChallengeGrid>
        )}
      </ScrollContent>

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