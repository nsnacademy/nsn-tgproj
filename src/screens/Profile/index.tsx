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
} from './styles';

import { BottomNav, NavItem } from '../Home/styles';
import {
  getCurrentUser,
  checkIsCreator,
} from '../../shared/lib/supabase';

type ProfileScreen = 'home' | 'create' | 'profile' | 'admin';

type ProfileProps = {
  screen: ProfileScreen;
  onNavigate: (screen: ProfileScreen) => void;
};

export default function Profile({ screen, onNavigate }: ProfileProps) {
  const [adminMode, setAdminMode] = useState(() => {
    const saved = localStorage.getItem('adminMode');
    return saved === 'true';
  });
  
  const [locked, setLocked] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [activeRole, setActiveRole] = useState<'participant' | 'creator'>('participant');

  // Моковые данные
  const userData = {
    name: 'Александр',
    handle: 'alex_dev',
    participantStats: {
      challenges: 24,
      completed: 18,
      successRate: 75,
      streak: 7,
      rating: 47,
      totalUsers: 1250,
      trend: 15,
      bestRank: 32
    },
    creatorStats: {
      created: 5,
      participants: 47,
      applications: 3,
      reportsToCheck: 5,
      rating: 42,
      totalCreators: 1250,
      trend: 8,
      byChallenges: 12,
      trust: 98,
      likes: 45,
      topPlaces: [
        { name: 'Марафон', place: 1 },
        { name: 'Челлендж', place: 2 }
      ]
    },
    activeChallenges: [
      { name: 'Марафон', progress: 5, total: 30 },
      { name: 'Челлендж', progress: 3, total: 7 },
      { name: '10000 шагов', progress: 12, total: 30 }
    ],
    pendingRequests: [
      { name: 'Марафон', new: 2, waiting: 0, reports: 3 },
      { name: 'Челлендж', new: 0, waiting: 1, reports: 2 },
    ]
  };

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
              Как участник
            </RoleButton>
            <RoleButton 
              $active={activeRole === 'creator'} 
              onClick={() => setActiveRole('creator')}
            >
              Как создатель
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
                <StatValue>✅ {userData.participantStats.completed}</StatValue>
                <StatLabel>Завершено</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{userData.participantStats.successRate}%</StatValue>
                <StatLabel>Успешность</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>🔥 {userData.participantStats.streak}</StatValue>
                <StatLabel>Дней</StatLabel>
              </StatItem>
            </StatsGrid>

            {/* Активные вызовы */}
            <SectionHeader>
              <SectionTitle>▶️ Активные вызовы</SectionTitle>
              <SectionBadge>{userData.activeChallenges.length}</SectionBadge>
            </SectionHeader>

            {userData.activeChallenges.map((ch, index) => (
              <RequestRow key={index} style={{ marginBottom: 8 }}>
                <RequestName>{ch.name}</RequestName>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ 
                    width: 80, 
                    height: 4, 
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${(ch.progress / ch.total) * 100}%`, 
                      height: '100%', 
                      background: '#FFD700' 
                    }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                    {ch.progress}/{ch.total}
                  </span>
                </div>
              </RequestRow>
            ))}

            {/* Рейтинг участника */}
            <RatingSection>
              <RatingTitle>🏆 Мой рейтинг</RatingTitle>
              <RatingGrid>
                <RatingRow>
                  <RatingLabel>Общий:</RatingLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <RatingValue>#{userData.participantStats.rating}</RatingValue>
                    <RatingValue $secondary>из {userData.participantStats.totalUsers}</RatingValue>
                    <RatingTrend>↑ +{userData.participantStats.trend}</RatingTrend>
                  </div>
                </RatingRow>
                <RatingDivider />
                <RatingRow>
                  <RatingLabel>Лучший:</RatingLabel>
                  <RatingValue>#{userData.participantStats.bestRank}</RatingValue>
                </RatingRow>
              </RatingGrid>
            </RatingSection>
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
                <StatValue>🔔 {userData.creatorStats.applications}</StatValue>
                <StatLabel>Заявки</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>📝 {userData.creatorStats.reportsToCheck}</StatValue>
                <StatLabel>Отчеты</StatLabel>
              </StatItem>
            </StatsGrid>

            {/* Заявки и отчеты по вызовам */}
            <SectionHeader>
              <SectionTitle>📋 Заявки и отчеты</SectionTitle>
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

            {/* Рейтинг создателя */}
            <RatingSection>
              <RatingTitle>🏆 Рейтинг создателя</RatingTitle>
              <RatingGrid>
                <RatingRow>
                  <RatingLabel>Общий:</RatingLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <RatingValue>#{userData.creatorStats.rating}</RatingValue>
                    <RatingValue $secondary>из {userData.creatorStats.totalCreators}</RatingValue>
                    <RatingTrend>↑ +{userData.creatorStats.trend}</RatingTrend>
                  </div>
                </RatingRow>
                
                <RatingDivider />
                
                <RatingRow>
                  <RatingLabel>По вызовам:</RatingLabel>
                  <RatingValue>#{userData.creatorStats.byChallenges}</RatingValue>
                </RatingRow>
                
                <RatingRow>
                  <RatingLabel>Доверие:</RatingLabel>
                  <TrustBadge>
                    {userData.creatorStats.trust}% ({userData.creatorStats.likes} 👍)
                  </TrustBadge>
                </RatingRow>

                {userData.creatorStats.topPlaces.length > 0 && (
                  <>
                    <RatingDivider />
                    <RatingRow>
                      <RatingLabel>🏅 Достижения:</RatingLabel>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {userData.creatorStats.topPlaces.map((p, i) => (
                          <span key={i} style={{ 
                            background: 'rgba(255,215,0,0.1)', 
                            color: '#FFD700',
                            padding: '2px 6px',
                            borderRadius: 12,
                            fontSize: 11
                          }}>
                            {p.place === 1 ? '🥇' : p.place === 2 ? '🥈' : '🥉'} {p.name}
                          </span>
                        ))}
                      </div>
                    </RatingRow>
                  </>
                )}
              </RatingGrid>
            </RatingSection>
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