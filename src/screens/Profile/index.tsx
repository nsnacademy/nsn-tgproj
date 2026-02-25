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
  CreatorBadge,
  StatsGrid,
  StatItem,
  StatValue,
  StatLabel,
  RequestsSection,
  RequestsHeader,
  RequestsTitle,
  RequestsGrid,
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
  // 👇 Инициализируем из localStorage
  const [adminMode, setAdminMode] = useState(() => {
    const saved = localStorage.getItem('adminMode');
    return saved === 'true';
  });
  
  const [locked, setLocked] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);

  // Моковые данные
  const userData = {
    name: 'Александр',
    handle: 'alex_dev',
    stats: {
      participation: 24,
      completed: 18,
      created: 5,
      participants: 47
    },
    requests: [
      { name: 'Марафон', new: 2, waiting: 0, reports: 3 },
      { name: 'Челлендж', new: 0, waiting: 1, reports: 2 },
    ],
    rating: {
      overall: 42,
      total: 1250,
      trend: 8,
      byChallenges: 12,
      trust: 98,
      likes: 45
    }
  };

  /* =========================
     CHECK CREATOR ACCESS
  ========================= */

  useEffect(() => {
    async function checkAccess() {
      const user = await getCurrentUser();
      if (!user) {
        setIsCreator(false);
        return;
      }

      const creator = await checkIsCreator(user.id);
      setIsCreator(creator);
    }

    checkAccess();
  }, []);

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

  /* =========================
     RENDER
  ========================= */

  return (
    <SafeArea>
      <Container>
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
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
            <UserName>
              {userData.name}
              {isCreator && <CreatorBadge>Создатель</CreatorBadge>}
            </UserName>
            <UserHandle>@{userData.handle}</UserHandle>
          </UserInfo>
        </UserCard>

        {/* STATS GRID */}
        <StatsGrid>
          <StatItem>
            <StatValue>{userData.stats.participation}</StatValue>
            <StatLabel>Участие</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>✅ {userData.stats.completed}</StatValue>
            <StatLabel>Завершено</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{userData.stats.created}</StatValue>
            <StatLabel>Создано</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{userData.stats.participants}</StatValue>
            <StatLabel>Участников</StatLabel>
          </StatItem>
        </StatsGrid>

        {/* REQUESTS & REPORTS */}
        <RequestsSection>
          <RequestsHeader>
            <RequestsTitle>🔔 ЗАЯВКИ (3) • 📝 ОТЧЕТЫ (5)</RequestsTitle>
          </RequestsHeader>
          <RequestsGrid>
            {userData.requests.map((req, index) => (
              <RequestRow key={index}>
                <RequestName>{req.name}</RequestName>
                <div style={{ display: 'flex', gap: 12 }}>
                  {req.new > 0 && <RequestBadge $type="new">{req.new} нов.</RequestBadge>}
                  {req.waiting > 0 && <RequestBadge $type="waiting">{req.waiting} ждет</RequestBadge>}
                  {req.reports > 0 && <ReportBadge>{req.reports} отч.</ReportBadge>}
                </div>
              </RequestRow>
            ))}
          </RequestsGrid>
        </RequestsSection>

        {/* CREATOR RATING */}
        <RatingSection>
          <RatingTitle>🏆 РЕЙТИНГ СОЗДАТЕЛЯ</RatingTitle>
          <RatingGrid>
            <RatingRow>
              <RatingLabel>Общий:</RatingLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RatingValue>#{userData.rating.overall}</RatingValue>
                <RatingValue $secondary>из {userData.rating.total}</RatingValue>
                <RatingTrend>↑ +{userData.rating.trend}</RatingTrend>
              </div>
            </RatingRow>
            
            <RatingDivider />
            
            <RatingRow>
              <RatingLabel>По вызовам:</RatingLabel>
              <RatingValue>#{userData.rating.byChallenges}</RatingValue>
            </RatingRow>
            
            <RatingRow>
              <RatingLabel>Доверие:</RatingLabel>
              <TrustBadge>
                {userData.rating.trust}% ({userData.rating.likes} 👍)
              </TrustBadge>
            </RatingRow>
          </RatingGrid>
        </RatingSection>
      </Container>

      {/* BOTTOM NAV */}
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