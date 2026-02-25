import { useEffect, useState } from 'react';

import {
  SafeArea,
  Container,
  Title,
  Text,
  Toggle,
  ToggleKnob,
  UserInfoBlock,
  UserAvatar,
  UserName,
  UserHandle,
  StatsRow,
  StatItem,
  StatNumber,
  StatLabel,
  CalendarBlock,
  CalendarTitle,
  CalendarGrid,
  CalendarDay,
  CalendarLegend,
  LegendItem,
  RatingBlock,
  RatingTitle,
  RatingRow,
  RatingLabel,
  RatingValue,
  RatingBadge,
  RatingChange,
  Divider,
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
            marginBottom: 12,
          }}
        >
          <Title>Профиль</Title>
        </div>

        {/* ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ */}
        <UserInfoBlock>
          <UserAvatar>
            <svg width="40" height="40" fill="none" stroke="#fff" strokeWidth="2">
              <circle cx="20" cy="15" r="8" />
              <path d="M5 38c3-8 10-12 15-12s12 4 15 12" />
            </svg>
          </UserAvatar>
          <div>
            <UserName>{userData.name}</UserName>
            <UserHandle>@{userData.handle}</UserHandle>
          </div>
        </UserInfoBlock>

        {/* СТАТИСТИКА */}
        <StatsRow>
          <StatItem>
            <StatNumber>{userData.stats.challenges}</StatNumber>
            <StatLabel>Вызовов</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{userData.stats.completed}</StatNumber>
            <StatLabel>Завершено</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{userData.stats.successRate}%</StatNumber>
            <StatLabel>Успешность</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{userData.stats.streak}</StatNumber>
            <StatLabel>Дней подряд</StatLabel>
          </StatItem>
        </StatsRow>

        {/* КАЛЕНДАРЬ АКТИВНОСТИ */}
        <CalendarBlock>
          <CalendarTitle>
            Активность
            <span style={{ fontSize: 13, fontWeight: 'normal', opacity: 0.6, marginLeft: 8 }}>
              последние 30 дней
            </span>
          </CalendarTitle>
          
          <CalendarGrid>
            {calendarDays.map((level, index) => (
              <CalendarDay key={index} $level={level} />
            ))}
          </CalendarGrid>
          
          <CalendarLegend>
            <span>Меньше</span>
            <LegendItem>
              <CalendarDay $level={0} style={{ width: 12, height: 12 }} />
              <CalendarDay $level={1} style={{ width: 12, height: 12 }} />
              <CalendarDay $level={2} style={{ width: 12, height: 12 }} />
              <CalendarDay $level={3} style={{ width: 12, height: 12 }} />
              <CalendarDay $level={4} style={{ width: 12, height: 12 }} />
            </LegendItem>
            <span>Больше</span>
          </CalendarLegend>
        </CalendarBlock>

        {/* РЕЙТИНГ */}
        <RatingBlock>
          <RatingTitle>Мой рейтинг</RatingTitle>
          
          <RatingRow>
            <RatingLabel>Общий рейтинг</RatingLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RatingBadge>#{userData.rating.current}</RatingBadge>
              <RatingValue>из {userData.rating.total}</RatingValue>
            </div>
          </RatingRow>
          
          <Divider />
          
          <RatingRow>
            <RatingLabel>Рост за неделю</RatingLabel>
            <RatingChange $positive={userData.rating.change > 0}>
              +{userData.rating.change} позиций
            </RatingChange>
          </RatingRow>
          
          <RatingRow>
            <RatingLabel>Лучший результат</RatingLabel>
            <RatingValue $bold>#{userData.rating.best}</RatingValue>
          </RatingRow>
          
          <RatingRow>
            <RatingLabel>В топ 10%</RatingLabel>
            <RatingValue $positive>✓ Да</RatingValue>
          </RatingRow>
        </RatingBlock>

        {/* АДМИН-РЕЖИМ (как было) */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
              Админ-режим
            </Text>

            <Toggle
              $active={adminMode}
              $disabled={!isCreator}
              onClick={onToggleAdmin}
            >
              <ToggleKnob $active={adminMode} />
            </Toggle>
          </div>

          <Text>
            Включите админ-режим для модерации вызовов
          </Text>

          {isCreator === false && (
            <Text
              style={{
                marginTop: 12,
                fontSize: 13,
                opacity: 0.6,
              }}
            >
              Админ-режим доступен только создателю вызова
            </Text>
          )}
        </div>
      </Container>

      {/* BOTTOM NAV */}
      <BottomNav>
        <NavItem
          $active={screen === 'home'}
          onClick={() => onNavigate('home')}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>

        <NavItem
          $active={screen === 'create'}
          onClick={() => onNavigate('create')}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </NavItem>

        <NavItem $active={false}>
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="6" y1="18" x2="6" y2="14" />
            <line x1="12" y1="18" x2="12" y2="10" />
            <line x1="18" y1="18" x2="18" y2="6" />
          </svg>
        </NavItem>

        <NavItem
          $active={screen === 'profile'}
          onClick={() => onNavigate('profile')}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}