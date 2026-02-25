import { useEffect, useState } from 'react';

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
import {
  supabase,
  getCurrentUser,
  checkIsCreator,
} from '../../shared/lib/supabase';

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

export default function Profile({ screen, onNavigate }: ProfileProps) {
  const [adminMode, setAdminMode] = useState(() => {
    const saved = localStorage.getItem('adminMode');
    return saved === 'true';
  });
  
  const [locked, setLocked] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [activeRole, setActiveRole] = useState<'participant' | 'creator'>('participant');
  const [loading, setLoading] = useState(true);

  // Данные из БД в том же формате, что и моковые
  const [userData, setUserData] = useState<UserData>({
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
  });

  // Проверяем создателя при загрузке
  useEffect(() => {
    async function checkAccess() {
      const user = await getCurrentUser();
      if (!user) {
        setIsCreator(false);
        return;
      }

      const creator = await checkIsCreator(user.id);
      setIsCreator(creator);
      if (creator) setActiveRole('creator');
    }

    checkAccess();
  }, []);

  // Загружаем данные профиля
  useEffect(() => {
    async function loadProfileData() {
      setLoading(true);
      
      const user = await getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Получаем username из таблицы users
      const { data: userData } = await supabase
        .from('users')
        .select('username')
        .eq('telegram_id', user.telegram_id)
        .maybeSingle();

      // ===== СТАТИСТИКА УЧАСТНИКА =====
      
      // Всего вызовов
      const { count: totalChallenges } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Завершенных вызовов
      const { count: completedChallenges } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('user_completed', true);

      // Успешность
      const successRate = totalChallenges && totalChallenges > 0
        ? Math.round(((completedChallenges || 0) / totalChallenges) * 100) 
        : 0;

      // ===== АКТИВНЫЕ ВЫЗОВЫ =====
      
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

      const activeChallengesList = [];
      
      if (participants) {
        for (const p of participants) {
          const challenge = p.challenges as any;
          if (!challenge) continue;
          
          // Получаем прогресс из отчетов
          const { data: reports } = await supabase
            .from('reports')
            .select('id')
            .eq('participant_id', p.id)
            .eq('status', 'approved');

          const progress = reports?.length || 0;
          const total = challenge.duration_days || 0;

          activeChallengesList.push({
            name: challenge.title || 'Без названия',
            progress,
            total
          });
        }
      }

      // ===== РЕЙТИНГ УЧАСТНИКА =====
      
      const { data: ratingData } = await supabase
        .from('ratings')
        .select('place')
        .eq('user_id', user.id)
        .is('challenge_id', null)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Общее количество участников
      const { count: totalUsers } = await supabase
        .from('ratings')
        .select('*', { count: 'exact', head: true })
        .is('challenge_id', null);

      // Лучший результат
      const { data: bestRankData } = await supabase
        .from('ratings')
        .select('place')
        .eq('user_id', user.id)
        .is('challenge_id', null)
        .order('place', { ascending: true })
        .limit(1)
        .maybeSingle();

      // ===== ДАННЫЕ СОЗДАТЕЛЯ =====
      
      let createdChallenges = 0;
      let totalParticipants = 0;
      let applications = 0;
      let reportsToCheck = 0;
      let creatorRating = null;
      let totalCreators = 0;
      const pendingRequestsList = [];

      // Проверяем, является ли пользователь создателем
      const creator = await checkIsCreator(user.id);

      if (creator) {
        // Количество созданных вызовов
        const { count } = await supabase
          .from('challenges')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', user.id);
        createdChallenges = count || 0;

        // ID созданных вызовов
        const { data: challengeIds } = await supabase
          .from('challenges')
          .select('id, title')
          .eq('creator_id', user.id);

        if (challengeIds && challengeIds.length > 0) {
          const ids = challengeIds.map(c => c.id);
          
          // Участники
          const { count: pCount } = await supabase
            .from('participants')
            .select('*', { count: 'exact', head: true })
            .in('challenge_id', ids);
          totalParticipants = pCount || 0;

          // Заявки по каждому вызову
          for (const c of challengeIds) {
            const { count: pendingCount } = await supabase
              .from('entry_requests')
              .select('*', { count: 'exact', head: true })
              .eq('challenge_id', c.id)
              .eq('status', 'pending');
            
            if (pendingCount && pendingCount > 0) {
              applications += pendingCount;
              pendingRequestsList.push({
                name: c.title || 'Без названия',
                new: pendingCount,
                waiting: 0,
                reports: 0
              });
            }

            // Отчеты на проверку
            const { count: reportsCount } = await supabase
              .from('reports')
              .select('*', { count: 'exact', head: true })
              .eq('challenge_id', c.id)
              .eq('status', 'pending');
            
            if (reportsCount && reportsCount > 0) {
              reportsToCheck += reportsCount;
              const existing = pendingRequestsList.find(r => r.name === c.title);
              if (existing) {
                existing.reports = reportsCount;
              } else {
                pendingRequestsList.push({
                  name: c.title || 'Без названия',
                  new: 0,
                  waiting: 0,
                  reports: reportsCount
                });
              }
            }
          }
        }

        // Рейтинг создателя
        const { data: cRating } = await supabase
          .from('ratings')
          .select('place')
          .eq('user_id', user.id)
          .not('challenge_id', 'is', null)
          .order('place', { ascending: true })
          .limit(1)
          .maybeSingle();
        creatorRating = cRating?.place || null;

        // Количество создателей
        const { count: cCount } = await supabase
          .from('challenges')
          .select('creator_id', { count: 'exact', head: true });
        totalCreators = cCount || 0;
      }

      // Обновляем состояние
      setUserData({
        name: userData?.username || 'Пользователь',
        handle: userData?.username || 'user',
        participantStats: {
          challenges: totalChallenges || 0,
          completed: completedChallenges || 0,
          successRate,
          streak: 0,
          rating: ratingData?.place || null,
          totalUsers: totalUsers || 0,
          trend: 0,
          bestRank: bestRankData?.place || null
        },
        creatorStats: {
          created: createdChallenges,
          participants: totalParticipants,
          applications,
          reportsToCheck,
          rating: creatorRating,
          totalCreators,
          trend: 0,
          byChallenges: null,
          trust: 0,
          likes: 0
        },
        activeChallenges: activeChallengesList,
        pendingRequests: pendingRequestsList
      });

      setLoading(false);
    }

    if (screen === 'profile') {
      loadProfileData();
    }
  }, [screen]);

  const onToggleAdmin = () => {
    if (locked || !isCreator) return;

    localStorage.setItem('adminMode', 'true');
    setAdminMode(true);
    setLocked(true);

    setTimeout(() => {
      onNavigate('admin');
      setLocked(false);
    }, 250);
  };

  useEffect(() => {
    if (screen === 'profile') {
      localStorage.setItem('adminMode', 'false');
      setAdminMode(false);
    }
  }, [screen]);

  if (loading) {
    return (
      <SafeArea>
        <Container>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
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
              onClick={() => setActiveRole('participant')}
            >
              Участник
            </RoleButton>
            <RoleButton 
              $active={activeRole === 'creator'} 
              onClick={() => setActiveRole('creator')}
            >
              Создатель
            </RoleButton>
          </RoleSwitch>
        )}

        {/* РЕЖИМ УЧАСТНИКА */}
        {activeRole === 'participant' && (
          <ParticipantSection>
            {/* Быстрая статистика */}
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

            {/* Активные вызовы */}
            {userData.activeChallenges.length > 0 && (
              <>
                <SectionHeader>
                  <SectionTitle>Активные вызовы</SectionTitle>
                  <SectionBadge>{userData.activeChallenges.length}</SectionBadge>
                </SectionHeader>

                {userData.activeChallenges.map((ch, index) => (
                  <RequestRow key={index} style={{ marginBottom: 12 }}>
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

            {/* Рейтинг участника */}
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
        )}

        {/* РЕЖИМ СОЗДАТЕЛЯ */}
        {activeRole === 'creator' && (
          <CreatorSection>
            {/* Статистика создателя */}
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

            {/* Заявки и отчеты по вызовам */}
            {userData.pendingRequests.length > 0 && (
              <>
                <SectionHeader>
                  <SectionTitle>Заявки и отчеты</SectionTitle>
                </SectionHeader>

                {userData.pendingRequests.map((req, index) => (
                  <RequestRow key={index}>
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

            {/* Рейтинг создателя */}
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
        )}
      </Container>

      {/* BOTTOM NAV */}
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