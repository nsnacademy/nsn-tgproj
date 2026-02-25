import { useEffect, useState } from 'react';

import {
  SafeArea,
  Container,
  Title,
  Text,
  Toggle,
  ToggleKnob,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  CalendarGrid,
  CalendarDay,
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
  
  // Моковые данные для демонстрации
  const mockStats = {
    challenges: 24,
    completed: 18,
    successRate: 75,
    streak: 7
  };
  
  const mockRating = {
    globalRank: 47,
    totalParticipants: 1250,
    weeklyChange: 15,
    bestRank: 32
  };
  
  // Генерация календаря
  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < 30; i++) {
      days.push({
        level: Math.floor(Math.random() * 5) // 0-4
      });
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

    // 👇 Сохраняем в localStorage
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

  // Если мы вернулись на профиль из админки, сбрасываем состояние
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

        {/* 👤 ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ 
            width: 56, 
            height: 56, 
            borderRadius: 28, 
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="32" height="32" fill="none" stroke="#fff" strokeWidth="2">
              <circle cx="16" cy="12" r="6" />
              <path d="M4 32c2-6 8-10 12-10s10 4 12 10" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Имя пользователя</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>@username</div>
          </div>
        </div>

        {/* 📊 СТАТИСТИКА */}
        <StatsGrid>
          <StatCard>
            <StatValue>{mockStats.challenges}</StatValue>
            <StatLabel>Вызовов</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{mockStats.completed}</StatValue>
            <StatLabel>Завершено</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{mockStats.successRate}%</StatValue>
            <StatLabel>Успешность</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{mockStats.streak}</StatValue>
            <StatLabel>Дней подряд</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* 🔥 КАЛЕНДАРЬ АКТИВНОСТИ */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>Активность</span>
            <span style={{ fontSize: 13, opacity: 0.6 }}>последние 30 дней</span>
          </div>
          
          <CalendarGrid>
            {calendarDays.map((day, index) => (
              <CalendarDay key={index} $level={day.level} />
            ))}
          </CalendarGrid>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            <span>Меньше</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <CalendarDay $level={0} style={{ width: 12, height: 12 }} />
              <CalendarDay $level={1} style={{ width: 12, height: 12 }} />
              <CalendarDay $level={2} style={{ width: 12, height: 12 }} />
              <CalendarDay $level={3} style={{ width: 12, height: 12 }} />
              <CalendarDay $level={4} style={{ width: 12, height: 12 }} />
            </div>
            <span>Больше</span>
          </div>
        </div>

        {/* 🏆 РЕЙТИНГ */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Мой рейтинг</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, opacity: 0.7 }}>Общий рейтинг</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
                #{mockRating.globalRank}
              </span>
              <span style={{ fontSize: 13, opacity: 0.5 }}>из {mockRating.totalParticipants}</span>
            </div>
          </div>
          
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '12px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, opacity: 0.7 }}>Рост за неделю</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#4CAF50' }}>+{mockRating.weeklyChange} позиций</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, opacity: 0.7 }}>Лучший результат</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>#{mockRating.bestRank}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, opacity: 0.7 }}>В топ 10%</span>
            <span style={{ color: '#4CAF50' }}>✓ Да</span>
          </div>
        </div>

        {/* 🔧 АДМИН-РЕЖИМ */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Text style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                Админ-режим
              </Text>
              <Text style={{ fontSize: 13, opacity: 0.6, margin: '4px 0 0' }}>
                Включите для модерации вызовов
              </Text>
            </div>

            <Toggle
              $active={adminMode}
              $disabled={!isCreator}
              onClick={onToggleAdmin}
            >
              <ToggleKnob $active={adminMode} />
            </Toggle>
          </div>

          {/* 🔒 ACCESS INFO */}
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