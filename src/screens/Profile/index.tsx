import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  SafeArea,
  Container,
  Title,
  Toggle,
  ToggleKnob,
  UserCard,
  UserAvatar,
  UserInfo,
  UserName,
  UserHandle,
  RoleSwitch,
  RoleButton,
  StatsGrid,
  StatItem,
  StatValue,
  StatLabel,
  ParticipantSection,
  CreatorSection,
  SectionHeader,
  SectionTitle,
  SectionBadge,
  RequestRow,
  RequestName,
  RequestBadge,
  ReportBadge,
  RatingSection,
  RatingTitle,
  RatingGrid,
  RatingRow,
  RatingLabel,
  RatingValue,
  RatingTrend,
  RatingDivider,
  TrustBadge,
  ProgressBar,
  ProgressFill,
  ProgressText,
} from './styles';
import { BottomNav, NavItem } from '../Home/styles';
import { supabase, getCurrentUser, checkIsCreator } from '../../shared/lib/supabase';

type ProfileScreen = 'home' | 'create' | 'profile' | 'admin';

type ProfileProps = {
  screen: ProfileScreen;
  onNavigate: (screen: ProfileScreen) => void;
};

type UserData = {
  name: string;
  handle: string;
  participantStats: {
    challenges: number;
    completed: number;
    successRate: number;
    streak: number;
    rating: number | null;
    totalUsers: number;
    trend: number;
    bestRank: number | null;
  };
  creatorStats: {
    created: number;
    participants: number;
    applications: number;
    reportsToCheck: number;
    rating: number | null;
    totalCreators: number;
    trend: number;
    byChallenges: number | null;
    trust: number;
    likes: number;
  };
  activeChallenges: {
    name: string;
    progress: number;
    total: number;
  }[];
  pendingRequests: {
    name: string;
    new: number;
    waiting: number;
    reports: number;
  }[];
};

const DEFAULT_USER_DATA: UserData = {
  name: '',
  handle: '',
  participantStats: {
    challenges: 0,
    completed: 0,
    successRate: 0,
    streak: 0,
    rating: null,
    totalUsers: 0,
    trend: 0,
    bestRank: null
  },
  creatorStats: {
    created: 0,
    participants: 0,
    applications: 0,
    reportsToCheck: 0,
    rating: null,
    totalCreators: 0,
    trend: 0,
    byChallenges: null,
    trust: 0,
    likes: 0
  },
  activeChallenges: [],
  pendingRequests: []
};

export default function Profile({ screen, onNavigate }: ProfileProps) {
  const [adminMode, setAdminMode] = useState(() => {
    try {
      return localStorage.getItem('adminMode') === 'true';
    } catch {
      return false;
    }
  });
  
  const [locked, setLocked] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [activeRole, setActiveRole] = useState<'participant' | 'creator'>('participant');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);

  // Проверяем создателя при загрузке
  useEffect(() => {
    let mounted = true;
    
    async function checkAccess() {
      try {
        const user = await getCurrentUser();
        if (!mounted) return;
        
        if (!user) {
          setIsCreator(false);
          return;
        }

        const creator = await checkIsCreator(user.id);
        if (!mounted) return;
        
        setIsCreator(creator);
        if (creator) setActiveRole('creator');
      } catch (error) {
        console.error('Error checking creator status:', error);
        if (mounted) setIsCreator(false);
      }
    }

    checkAccess();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Оптимизированная загрузка данных с параллельными запросами
  useEffect(() => {
    let mounted = true;
    
    async function loadProfileData() {
      if (screen !== 'profile') return;
      
      setLoading(true);
      
      try {
        const user = await getCurrentUser();
        if (!mounted || !user) {
          setLoading(false);
          return;
        }

        // Параллельное выполнение всех запросов для оптимизации
        const [
          userDataResult,
          participantStats,
          activeChallengesData,
          ratingData,
          creatorChallengesData,
          creatorTrustData  // 👈 переименовано с creatorStatsData на creatorTrustData
        ] = await Promise.allSettled([
          // Username
          supabase
            .from('users')
            .select('username')
            .eq('telegram_id', user.telegram_id)
            .maybeSingle(),
          
          // Статистика участника
          (async () => {
            const [totalChallenges, completedChallenges] = await Promise.all([
              supabase
                .from('participants')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id),
              supabase
                .from('participants')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('user_completed', true)
            ]);

            return {
              total: totalChallenges.count || 0,
              completed: completedChallenges.count || 0
            };
          })(),
          
          // Активные вызовы
          (async () => {
            const { data: participants } = await supabase
              .from('participants')
              .select(`
                id,
                challenges (
                  id,
                  title,
                  duration_days
                )
              `)
              .eq('user_id', user.id)
              .eq('challenge_finished', false);

            if (!participants?.length) return [];

            // Получаем прогресс для всех вызовов одним запросом
            const participantIds = participants.map(p => p.id);
            const { data: reports } = await supabase
              .from('reports')
              .select('participant_id')
              .eq('status', 'approved')
              .in('participant_id', participantIds);

            // Группируем отчеты по participant_id
            const reportsCount = (reports || []).reduce((acc, r) => {
              acc[r.participant_id] = (acc[r.participant_id] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            return participants.map(p => {
              const challenge = p.challenges as any;
              return {
                name: challenge?.title || 'Без названия',
                progress: reportsCount[p.id] || 0,
                total: challenge?.duration_days || 0
              };
            });
          })(),
          
          // Рейтинг
          (async () => {
            const [rating, totalUsers, bestRank] = await Promise.all([
              supabase
                .from('ratings')
                .select('place')
                .eq('user_id', user.id)
                .is('challenge_id', null)
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle(),
              supabase
                .from('ratings')
                .select('*', { count: 'exact', head: true })
                .is('challenge_id', null),
              supabase
                .from('ratings')
                .select('place')
                .eq('user_id', user.id)
                .is('challenge_id', null)
                .order('place', { ascending: true })
                .limit(1)
                .maybeSingle()
            ]);

            return {
              rating: rating.data?.place || null,
              totalUsers: totalUsers.count || 0,
              bestRank: bestRank.data?.place || null
            };
          })(),
          
          // Данные создателя (вызовы, заявки, отчеты)
          (async () => {
            const isUserCreator = await checkIsCreator(user.id);
            if (!isUserCreator) return null;

            // Получаем все созданные вызовы
            const { data: challenges } = await supabase
              .from('challenges')
              .select('id, title')
              .eq('creator_id', user.id);

            if (!challenges?.length) {
              return {
                created: 0,
                participants: 0,
                applications: 0,
                reportsToCheck: 0,
                pendingRequests: [],
                rating: null,
                totalCreators: 0
              };
            }

            const challengeIds = challenges.map(c => c.id);
            
            // Параллельные запросы для статистики создателя
            const [participantsCount, entryRequests, reports, creatorRating, totalCreatorsCount] = await Promise.all([
              supabase
                .from('participants')
                .select('*', { count: 'exact', head: true })
                .in('challenge_id', challengeIds),
              
              supabase
                .from('entry_requests')
                .select('challenge_id, status')
                .in('challenge_id', challengeIds)
                .eq('status', 'pending'),
              
              supabase
                .from('reports')
                .select('challenge_id')
                .in('challenge_id', challengeIds)
                .eq('status', 'pending'),
              
              supabase
                .from('ratings')
                .select('place')
                .eq('user_id', user.id)
                .not('challenge_id', 'is', null)
                .order('place', { ascending: true })
                .limit(1)
                .maybeSingle(),
              
              supabase
                .from('challenges')
                .select('creator_id', { count: 'exact', head: true })
            ]);

            // Группируем заявки по вызовам
            const pendingRequestsMap = new Map();
            
            // Обрабатываем заявки
            (entryRequests.data || []).forEach(req => {
              const challenge = challenges.find(c => c.id === req.challenge_id);
              if (!challenge) return;
              
              const existing = pendingRequestsMap.get(challenge.id) || {
                name: challenge.title || 'Без названия',
                new: 0,
                waiting: 0,
                reports: 0
              };
              existing.new++;
              pendingRequestsMap.set(challenge.id, existing);
            });

            // Обрабатываем отчеты
            (reports.data || []).forEach(report => {
              const challenge = challenges.find(c => c.id === report.challenge_id);
              if (!challenge) return;
              
              const existing = pendingRequestsMap.get(challenge.id);
              if (existing) {
                existing.reports++;
              } else {
                pendingRequestsMap.set(challenge.id, {
                  name: challenge.title || 'Без названия',
                  new: 0,
                  waiting: 0,
                  reports: 1
                });
              }
            });

            return {
              created: challenges.length,
              participants: participantsCount.count || 0,
              applications: entryRequests.data?.length || 0,
              reportsToCheck: reports.data?.length || 0,
              pendingRequests: Array.from(pendingRequestsMap.values()),
              rating: creatorRating.data?.place || null,
              totalCreators: totalCreatorsCount.count || 0
            };
          })(),

          // 👇 НОВЫЙ ЗАПРОС: доверие и лайки создателя (переименовано)
          (async () => {
            const isUserCreator = await checkIsCreator(user.id);
            if (!isUserCreator) return { trust: 0, likes: 0 };

            const { data } = await supabase
              .from('creator_stats')
              .select('trust_percent, likes_count')
              .eq('creator_id', user.id)
              .maybeSingle();

            return {
              trust: data?.trust_percent || 0,
              likes: data?.likes_count || 0
            };
          })()
        ]);

        if (!mounted) return;

        // Обрабатываем результаты
        const username = userDataResult.status === 'fulfilled' 
          ? userDataResult.value.data?.username 
          : null;

        const participantStatsData = participantStats.status === 'fulfilled' 
          ? participantStats.value 
          : { total: 0, completed: 0 };

        const activeChallengesList = activeChallengesData.status === 'fulfilled' 
          ? activeChallengesData.value 
          : [];

        const ratingStats = ratingData.status === 'fulfilled' 
          ? ratingData.value 
          : { rating: null, totalUsers: 0, bestRank: null };

        const creatorChallenges = creatorChallengesData.status === 'fulfilled' 
          ? creatorChallengesData.value 
          : null;

        // 👇 НОВОЕ: обрабатываем данные доверия (используем creatorTrustData)
        const trustStats = creatorTrustData.status === 'fulfilled'
          ? creatorTrustData.value
          : { trust: 0, likes: 0 };

        const successRate = participantStatsData.total > 0
          ? Math.round((participantStatsData.completed / participantStatsData.total) * 100)
          : 0;

        setUserData({
          name: username || 'Пользователь',
          handle: username || 'user',
          participantStats: {
            challenges: participantStatsData.total,
            completed: participantStatsData.completed,
            successRate,
            streak: 0,
            rating: ratingStats.rating,
            totalUsers: ratingStats.totalUsers,
            trend: 0,
            bestRank: ratingStats.bestRank
          },
          creatorStats: {
            created: creatorChallenges?.created || 0,
            participants: creatorChallenges?.participants || 0,
            applications: creatorChallenges?.applications || 0,
            reportsToCheck: creatorChallenges?.reportsToCheck || 0,
            rating: creatorChallenges?.rating || null,
            totalCreators: creatorChallenges?.totalCreators || 0,
            trend: 0,
            byChallenges: null,
            // 👇 НОВОЕ: добавляем trust и likes из trustStats
            trust: trustStats.trust,
            likes: trustStats.likes
          },
          activeChallenges: activeChallengesList,
          pendingRequests: creatorChallenges?.pendingRequests || []
        });
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfileData();
    
    return () => {
      mounted = false;
    };
  }, [screen]);

  const onToggleAdmin = useCallback(() => {
    if (locked || !isCreator) return;

    try {
      localStorage.setItem('adminMode', 'true');
    } catch (error) {
      console.error('Error saving admin mode:', error);
    }
    
    setAdminMode(true);
    setLocked(true);

    setTimeout(() => {
      onNavigate('admin');
      setLocked(false);
    }, 250);
  }, [locked, isCreator, onNavigate]);

  useEffect(() => {
    if (screen === 'profile') {
      try {
        localStorage.setItem('adminMode', 'false');
      } catch (error) {
        console.error('Error saving admin mode:', error);
      }
      setAdminMode(false);
    }
  }, [screen]);

  const handleRoleChange = useCallback((role: 'participant' | 'creator') => {
    setActiveRole(role);
  }, []);

  const handleNavigate = useCallback((target: ProfileScreen) => {
    onNavigate(target);
  }, [onNavigate]);

  // Мемоизированные значения для производительности
  const participantContent = useMemo(() => (
    <ParticipantSection>
      <StatsGrid>
        <StatItem>
          <StatValue>{userData.participantStats.challenges}</StatValue>
          <StatLabel>Вызовов</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{userData.participantStats.completed}</StatValue>
          <StatLabel>Завершено</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{userData.participantStats.successRate}%</StatValue>
          <StatLabel>Успешность</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{userData.participantStats.streak}</StatValue>
          <StatLabel>Дней</StatLabel>
        </StatItem>
      </StatsGrid>

      {userData.activeChallenges.length > 0 && (
        <>
          <SectionHeader>
            <SectionTitle>Активные вызовы</SectionTitle>
            <SectionBadge>{userData.activeChallenges.length}</SectionBadge>
          </SectionHeader>

          {userData.activeChallenges.map((ch, index) => (
            <RequestRow key={`challenge-${index}`} style={{ marginBottom: 12 }}>
              <RequestName>{ch.name}</RequestName>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ProgressBar>
                  <ProgressFill $width={ch.total > 0 ? (ch.progress / ch.total) * 100 : 0} />
                </ProgressBar>
                <ProgressText>
                  {ch.progress}/{ch.total}
                </ProgressText>
              </div>
            </RequestRow>
          ))}
        </>
      )}

      {(userData.participantStats.rating || userData.participantStats.bestRank) && (
        <RatingSection>
          <RatingTitle>Рейтинг</RatingTitle>
          <RatingGrid>
            {userData.participantStats.rating && (
              <RatingRow>
                <RatingLabel>Общий</RatingLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RatingValue>#{userData.participantStats.rating}</RatingValue>
                  <RatingValue $secondary>из {userData.participantStats.totalUsers}</RatingValue>
                  {userData.participantStats.trend > 0 && (
                    <RatingTrend>+{userData.participantStats.trend}</RatingTrend>
                  )}
                </div>
              </RatingRow>
            )}
            
            {userData.participantStats.rating && userData.participantStats.bestRank && (
              <RatingDivider />
            )}
            
            {userData.participantStats.bestRank && (
              <RatingRow>
                <RatingLabel>Лучший</RatingLabel>
                <RatingValue>#{userData.participantStats.bestRank}</RatingValue>
              </RatingRow>
            )}
          </RatingGrid>
        </RatingSection>
      )}
    </ParticipantSection>
  ), [userData.participantStats, userData.activeChallenges]);

  const creatorContent = useMemo(() => (
    <CreatorSection>
      <StatsGrid>
        <StatItem>
          <StatValue>{userData.creatorStats.created}</StatValue>
          <StatLabel>Создано</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{userData.creatorStats.participants}</StatValue>
          <StatLabel>Участников</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{userData.creatorStats.applications}</StatValue>
          <StatLabel>Заявки</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{userData.creatorStats.reportsToCheck}</StatValue>
          <StatLabel>Отчеты</StatLabel>
        </StatItem>
      </StatsGrid>

      {userData.pendingRequests.length > 0 && (
        <>
          <SectionHeader>
            <SectionTitle>Заявки и отчеты</SectionTitle>
          </SectionHeader>

          {userData.pendingRequests.map((req, index) => (
            <RequestRow key={`request-${index}`}>
              <RequestName>{req.name}</RequestName>
              <div style={{ display: 'flex', gap: 8 }}>
                {req.new > 0 && <RequestBadge $type="new">{req.new} нов.</RequestBadge>}
                {req.waiting > 0 && <RequestBadge $type="waiting">{req.waiting} ждет</RequestBadge>}
                {req.reports > 0 && <ReportBadge>{req.reports} отч.</ReportBadge>}
              </div>
            </RequestRow>
          ))}
        </>
      )}

      {userData.creatorStats.rating && (
        <RatingSection>
          <RatingTitle>Рейтинг создателя</RatingTitle>
          <RatingGrid>
            <RatingRow>
              <RatingLabel>Общий</RatingLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RatingValue>#{userData.creatorStats.rating}</RatingValue>
                <RatingValue $secondary>из {userData.creatorStats.totalCreators}</RatingValue>
                {userData.creatorStats.trend > 0 && (
                  <RatingTrend>+{userData.creatorStats.trend}</RatingTrend>
                )}
              </div>
            </RatingRow>
            
            {userData.creatorStats.byChallenges && (
              <>
                <RatingDivider />
                <RatingRow>
                  <RatingLabel>По вызовам</RatingLabel>
                  <RatingValue>#{userData.creatorStats.byChallenges}</RatingValue>
                </RatingRow>
              </>
            )}
            
            {/* 👇 НОВОЕ: отображаем доверие и лайки */}
            {userData.creatorStats.trust > 0 && (
              <RatingRow>
                <RatingLabel>Доверие</RatingLabel>
                <TrustBadge>
                  {userData.creatorStats.trust}% ({userData.creatorStats.likes})
                </TrustBadge>
              </RatingRow>
            )}
          </RatingGrid>
        </RatingSection>
      )}
    </CreatorSection>
  ), [userData.creatorStats, userData.pendingRequests]);

  if (loading) {
    return (
      <SafeArea>
        <Container>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '60vh' 
          }}>
            <StatLabel>Загрузка...</StatLabel>
          </div>
        </Container>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <Container>
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <Title>Профиль</Title>

          <Toggle
            $active={adminMode}
            $disabled={!isCreator}
            onClick={onToggleAdmin}
          >
            <ToggleKnob $active={adminMode} />
          </Toggle>
        </div>

        {/* USER CARD */}
        <UserCard>
          <UserAvatar>
            <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="2">
              <circle cx="18" cy="14" r="7" />
              <path d="M5 36c2-7 9-12 13-12s11 5 13 12" />
            </svg>
          </UserAvatar>
          <UserInfo>
            <UserName>{userData.name}</UserName>
            <UserHandle>@{userData.handle}</UserHandle>
          </UserInfo>
        </UserCard>

        {/* ROLE SWITCHER (только для создателей) */}
        {isCreator && (
          <RoleSwitch>
            <RoleButton 
              $active={activeRole === 'participant'} 
              onClick={() => handleRoleChange('participant')}
            >
              Участник
            </RoleButton>
            <RoleButton 
              $active={activeRole === 'creator'} 
              onClick={() => handleRoleChange('creator')}
            >
              Создатель
            </RoleButton>
          </RoleSwitch>
        )}

        {/* РЕЖИМ УЧАСТНИКА */}
        {activeRole === 'participant' && participantContent}

        {/* РЕЖИМ СОЗДАТЕЛЯ */}
        {activeRole === 'creator' && creatorContent}
      </Container>

      {/* BOTTOM NAV */}
      <BottomNav>
        <NavItem $active={screen === 'home'} onClick={() => handleNavigate('home')}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>
        <NavItem $active={screen === 'create'} onClick={() => handleNavigate('create')}>
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
        <NavItem $active={screen === 'profile'} onClick={() => handleNavigate('profile')}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}