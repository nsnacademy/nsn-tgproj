import { useEffect, useState } from 'react';

import {
  SafeArea,
  Container,
  Title,
  Text,
  Toggle,
  ToggleKnob,
  UserCard,
  UserAvatar,
  UserInfo,
  UserName,
  UserHandle,
  StatsGrid,
  StatCard,
  StatIcon,
  StatContent,
  StatNumber,
  StatLabel,
  StatTrend,
  ActivitySection,
  ActivityHeader,
  ActivityTitle,
  ActivityBadge,
  ActivityCalendar,
  DayCell,
  Legend,
  LegendItem,
  LegendColor,
  LegendText,
  RatingSection,
  RatingTitle,
  RatingList,
  RatingItem,
  RatingLabel,
  RatingValueWrapper,
  RatingNumber,
  RatingTotal,
  RatingChange,
  RatingDivider,
  RatingBadge,
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
      challenges: 24,
      completed: 18,
      successRate: 75,
      streak: 7
    },
    rating: {
      current: 47,
      total: 1250,
      change: 15,
      best: 32
    }
  };

  // Генерация календаря
  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < 30; i++) {
      days.push(Math.floor(Math.random() * 5));
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

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

        <Text style={{ marginBottom: 16, fontSize: 13, opacity: 0.6 }}>
          {isCreator 
            ? "Включите админ-режим для модерации вызовов"
            : "Админ-режим доступен только создателю вызова"}
        </Text>

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

        {/* STATS GRID */}
        <StatsGrid>
          <StatCard>
            <StatIcon>
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2">
                <rect x="3" y="3" width="14" height="14" rx="2" />
                <line x1="3" y1="9" x2="17" y2="9" />
              </svg>
            </StatIcon>
            <StatContent>
              <StatNumber>{userData.stats.challenges}</StatNumber>
              <StatLabel>Всего вызовов</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon>
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M3 6l5 5 8-8" />
                <circle cx="18" cy="6" r="1.5" />
                <path d="M16 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8" />
              </svg>
            </StatIcon>
            <StatContent>
              <StatNumber>{userData.stats.completed}</StatNumber>
              <StatLabel>Завершено</StatLabel>
              <StatTrend>+3 на этой неделе</StatTrend>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon>
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2">
                <circle cx="10" cy="10" r="8" />
                <path d="M10 6v4l3 3" />
              </svg>
            </StatIcon>
            <StatContent>
              <StatNumber>{userData.stats.successRate}%</StatNumber>
              <StatLabel>Успешность</StatLabel>
              <StatTrend>Выше среднего</StatTrend>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon>
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M4 4v12a4 4 0 0 0 4 4h8" />
                <path d="M12 12v4" />
                <path d="M16 8v8" />
                <path d="M8 8v8" />
              </svg>
            </StatIcon>
            <StatContent>
              <StatNumber>{userData.stats.streak}</StatNumber>
              <StatLabel>Дней подряд</StatLabel>
              <StatTrend>Личный рекорд</StatTrend>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* ACTIVITY SECTION */}
        <ActivitySection>
          <ActivityHeader>
            <ActivityTitle>Активность</ActivityTitle>
            <ActivityBadge>30 дней</ActivityBadge>
          </ActivityHeader>
          
          <ActivityCalendar>
            {calendarDays.map((level, index) => (
              <DayCell key={index} $level={level} />
            ))}
          </ActivityCalendar>
          
          <Legend>
            <LegendItem>
              <LegendColor $level={0} />
              <LegendText>Нет</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendColor $level={1} />
              <LegendText>1</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendColor $level={2} />
              <LegendText>2-3</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendColor $level={3} />
              <LegendText>4-5</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendColor $level={4} />
              <LegendText>6+</LegendText>
            </LegendItem>
          </Legend>
        </ActivitySection>

        {/* RATING SECTION */}
        <RatingSection>
          <RatingTitle>Мой рейтинг</RatingTitle>
          
          <RatingList>
            <RatingItem>
              <RatingLabel>Общий рейтинг</RatingLabel>
              <RatingValueWrapper>
                <RatingNumber>#{userData.rating.current}</RatingNumber>
                <RatingTotal>из {userData.rating.total}</RatingTotal>
              </RatingValueWrapper>
            </RatingItem>
            
            <RatingDivider />
            
            <RatingItem>
              <RatingLabel>Рост за неделю</RatingLabel>
              <RatingChange $positive={userData.rating.change > 0}>
                +{userData.rating.change} позиций
              </RatingChange>
            </RatingItem>
            
            <RatingItem>
              <RatingLabel>Лучший результат</RatingLabel>
              <RatingNumber>#{userData.rating.best}</RatingNumber>
            </RatingItem>
            
            <RatingItem>
              <RatingLabel>В топ 10%</RatingLabel>
              <RatingBadge>✓ Да</RatingBadge>
            </RatingItem>
          </RatingList>
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