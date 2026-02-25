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

type ParticipantStats = {
  challenges: number;
  completed: number;
  successRate: number;
  streak: number;
  rating: number | null;
  totalUsers: number;
  trend: number;
  bestRank: number | null;
};

type CreatorStats = {
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

type ActiveChallenge = {
  name: string;
  progress: number;
  total: number;
};

type PendingRequest = {
  name: string;
  new: number;
  waiting: number;
  reports: number;
};

type ParticipantWithChallenge = {
  id: string;
  challenge_id: string;
  user_completed: boolean;
  challenge_finished: boolean;
  challenges: {
    id: string;
    title: string;
    duration_days: number;
  } | null;
};

type ChallengeWithRequests = {
  title: string | null;
  entry_requests: { status: string }[] | null;
};

type ChallengeWithReports = {
  title: string | null;
  reports: { status: string }[] | null;
};

export default function Profile({ screen, onNavigate }: ProfileProps) {
  const [adminMode, setAdminMode] = useState(() => {
    const saved = localStorage.getItem('adminMode');
    return saved === 'true';
  });
  
  const [locked, setLocked] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [activeRole, setActiveRole] = useState<'participant' | 'creator'>('participant');
  
  // Данные из БД
  const [username, setUsername] = useState<string>('');
  const [participantStats, setParticipantStats] = useState<ParticipantStats>({
    challenges: 0,
    completed: 0,
    successRate: 0,
    streak: 0,
    rating: null,
    totalUsers: 0,
    trend: 0,
    bestRank: null
  });
  
  const [creatorStats, setCreatorStats] = useState<CreatorStats>({
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
  });
  
  const [activeChallenges, setActiveChallenges] = useState<ActiveChallenge[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     ЗАГРУЗКА ДАННЫХ ИЗ БД
  ========================= */

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

      if (userData) {
        setUsername(userData.username || 'user');
      }

      // Проверяем, создатель ли
      const creator = await checkIsCreator(user.id);
      setIsCreator(creator);
      if (creator) setActiveRole('creator');

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
        ? Math.round(( (completedChallenges || 0) / totalChallenges) * 100) 
        : 0;

      // ===== АКТИВНЫЕ ВЫЗОВЫ =====
      
      const { data: participants } = await supabase
        .from('participants')
        .select(`
          id,
          challenge_id,
          user_completed,
          challenge_finished,
          challenges (
            id,
            title,
            duration_days
          )
        `)
        .eq('user_id', user.id)
        .eq('challenge_finished', false) as { data: ParticipantWithChallenge[] | null };

      // Формируем список активных вызовов
      const active: ActiveChallenge[] = [];
      
      if (participants) {
        for (const p of participants) {
          if (!p.challenges) continue;
          
          // Получаем прогресс из отчетов
          const { data: reports } = await supabase
            .from('reports')
            .select('value, is_done')
            .eq('participant_id', p.id)
            .eq('status', 'approved');

          const progress = reports?.length || 0;
          const total = p.challenges.duration_days || 0;

          active.push({
            name: p.challenges.title || 'Без названия',
            progress,
            total
          });
        }
      }
      
      setActiveChallenges(active);

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

      setParticipantStats({
        challenges: totalChallenges || 0,
        completed: completedChallenges || 0,
        successRate,
        streak: 0, // Нужно будет доделать логику стрика
        rating: ratingData?.place || null,
        totalUsers: totalUsers || 0,
        trend: 0, // Нужно будет доделать тренд
        bestRank: bestRankData?.place || null
      });

      // ===== ДАННЫЕ СОЗДАТЕЛЯ =====
      
      if (creator) {
        // Количество созданных вызовов
        const { count: createdChallenges } = await supabase
          .from('challenges')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', user.id);

        // Всего участников в созданных вызовах
        // Получаем ID созданных вызовов
        const { data: createdChallengeIds } = await supabase
          .from('challenges')
          .select('id')
          .eq('creator_id', user.id);

        let totalParticipants = 0;
        if (createdChallengeIds && createdChallengeIds.length > 0) {
          const challengeIds = createdChallengeIds.map(c => c.id);
          
          const { count } = await supabase
            .from('participants')
            .select('*', { count: 'exact', head: true })
            .in('challenge_id', challengeIds);
          
          totalParticipants = count || 0;
        }

        // Заявки на вступление
        const { data: requestsData } = await supabase
          .from('challenges')
          .select(`
            title,
            entry_requests (
              status
            )
          `)
          .eq('creator_id', user.id) as { data: ChallengeWithRequests[] | null };

        // Отчеты на проверку
        const { data: reportsData } = await supabase
          .from('challenges')
          .select(`
            title,
            reports!inner (
              status
            )
          `)
          .eq('creator_id', user.id)
          .eq('reports.status', 'pending') as { data: ChallengeWithReports[] | null };

        // Считаем заявки и отчеты
        let applications = 0;
        let reportsToCheck = 0;
        const pendingReqs: PendingRequest[] = [];

        if (requestsData) {
          for (const c of requestsData) {
            const pendingCount = c.entry_requests?.filter(
              (r) => r.status === 'pending'
            ).length || 0;
            
            applications += pendingCount;
            
            if (pendingCount > 0) {
              pendingReqs.push({
                name: c.title || 'Без названия',
                new: pendingCount,
                waiting: 0,
                reports: 0
              });
            }
          }
        }

        if (reportsData) {
          for (const c of reportsData) {
            const reportsCount = c.reports?.length || 0;
            reportsToCheck += reportsCount;
            
            const existing = pendingReqs.find(r => r.name === c.title);
            if (existing) {
              existing.reports = reportsCount;
            } else if (reportsCount > 0) {
              pendingReqs.push({
                name: c.title || 'Без названия',
                new: 0,
                waiting: 0,
                reports: reportsCount
              });
            }
          }
        }

        setPendingRequests(pendingReqs);

        // Рейтинг создателя
        const { data: creatorRating } = await supabase
          .from('ratings')
          .select('place')
          .eq('user_id', user.id)
          .not('challenge_id', 'is', null)
          .order('place', { ascending: true })
          .limit(1)
          .maybeSingle();

        // Количество создателей
        const { count: totalCreators } = await supabase
          .from('challenges')
          .select('creator_id', { count: 'exact', head: true });

        setCreatorStats({
          created: createdChallenges || 0,
          participants: totalParticipants,
          applications,
          reportsToCheck,
          rating: creatorRating?.place || null,
          totalCreators: totalCreators || 0,
          trend: 0,
          byChallenges: null,
          trust: 0,
          likes: 0
        });
      }

      setLoading(false);
    }

    if (screen === 'profile') {
      loadProfileData();
    }
  }, [screen]);

  /* =========================
     TOGGLE ADMIN MODE
  ========================= */

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

  /* =========================
     Сброс при выходе из админки
  ========================= */

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
            <UserName>{username}</UserName>
            <UserHandle>@{username}</UserHandle>
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
                <StatValue>{participantStats.challenges}</StatValue>
                <StatLabel>Вызовов</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{participantStats.completed}</StatValue>
                <StatLabel>Завершено</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{participantStats.successRate}%</StatValue>
                <StatLabel>Успешность</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{participantStats.streak}</StatValue>
                <StatLabel>Дней</StatLabel>
              </StatItem>
            </StatsGrid>

            {/* Активные вызовы */}
            {activeChallenges.length > 0 && (
              <>
                <SectionHeader>
                  <SectionTitle>Активные вызовы</SectionTitle>
                  <SectionBadge>{activeChallenges.length}</SectionBadge>
                </SectionHeader>

                {activeChallenges.map((ch, index) => (
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
            {(participantStats.rating || participantStats.bestRank) && (
              <RatingSection>
                <RatingTitle>Рейтинг</RatingTitle>
                <RatingGrid>
                  {participantStats.rating && (
                    <RatingRow>
                      <RatingLabel>Общий</RatingLabel>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <RatingValue>#{participantStats.rating}</RatingValue>
                        <RatingValue $secondary>из {participantStats.totalUsers}</RatingValue>
                        {participantStats.trend > 0 && (
                          <RatingTrend>+{participantStats.trend}</RatingTrend>
                        )}
                      </div>
                    </RatingRow>
                  )}
                  
                  {participantStats.rating && participantStats.bestRank && (
                    <RatingDivider />
                  )}
                  
                  {participantStats.bestRank && (
                    <RatingRow>
                      <RatingLabel>Лучший</RatingLabel>
                      <RatingValue>#{participantStats.bestRank}</RatingValue>
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
                <StatValue>{creatorStats.created}</StatValue>
                <StatLabel>Создано</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{creatorStats.participants}</StatValue>
                <StatLabel>Участников</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{creatorStats.applications}</StatValue>
                <StatLabel>Заявки</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{creatorStats.reportsToCheck}</StatValue>
                <StatLabel>Отчеты</StatLabel>
              </StatItem>
            </StatsGrid>

            {/* Заявки и отчеты по вызовам */}
            {pendingRequests.length > 0 && (
              <>
                <SectionHeader>
                  <SectionTitle>Заявки и отчеты</SectionTitle>
                </SectionHeader>

                {pendingRequests.map((req, index) => (
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
            {creatorStats.rating && (
              <RatingSection>
                <RatingTitle>Рейтинг создателя</RatingTitle>
                <RatingGrid>
                  <RatingRow>
                    <RatingLabel>Общий</RatingLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <RatingValue>#{creatorStats.rating}</RatingValue>
                      <RatingValue $secondary>из {creatorStats.totalCreators}</RatingValue>
                      {creatorStats.trend > 0 && (
                        <RatingTrend>+{creatorStats.trend}</RatingTrend>
                      )}
                    </div>
                  </RatingRow>
                  
                  {creatorStats.byChallenges && (
                    <>
                      <RatingDivider />
                      <RatingRow>
                        <RatingLabel>По вызовам</RatingLabel>
                        <RatingValue>#{creatorStats.byChallenges}</RatingValue>
                      </RatingRow>
                    </>
                  )}
                  
                  {creatorStats.trust > 0 && (
                    <RatingRow>
                      <RatingLabel>Доверие</RatingLabel>
                      <TrustBadge>
                        {creatorStats.trust}% ({creatorStats.likes})
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