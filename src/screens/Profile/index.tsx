import { useEffect, useState } from 'react';

import {
  SafeArea,
  Container,
  Title,
  Text,
  Toggle,
  ToggleKnob,
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

        <Text style={{ marginBottom: 24 }}>
          Включите админ-режим для модерации вызовов
        </Text>

        {/* 🔒 ACCESS INFO */}
        {isCreator === false && (
          <Text
            style={{
              marginBottom: 24,
              fontSize: 13,
              opacity: 0.6,
            }}
          >
            Админ-режим доступен только создателю вызова
          </Text>
        )}

        {/* ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 16, 
          marginBottom: 24,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 16,
          padding: 16
        }}>
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
            <div style={{ fontSize: 18, fontWeight: 600 }}>{userData.name}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>@{userData.handle}</div>
          </div>
        </div>

        {/* СТАТИСТИКА */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 8,
          marginBottom: 24
        }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{userData.stats.challenges}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Вызовов</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{userData.stats.completed}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Завершено</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{userData.stats.successRate}%</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Успешность</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{userData.stats.streak}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Дней подряд</div>
          </div>
        </div>

        {/* КАЛЕНДАРЬ АКТИВНОСТИ */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: 16, 
          padding: 16,
          marginBottom: 24
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 12 
          }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>Активность</span>
            <span style={{ fontSize: 13, opacity: 0.6 }}>последние 30 дней</span>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(30, 1fr)', 
            gap: 2,
            marginBottom: 8
          }}>
            {calendarDays.map((level, index) => (
              <div
                key={index}
                style={{
                  aspectRatio: '1',
                  borderRadius: 2,
                  background: (() => {
                    switch (level) {
                      case 0: return 'rgba(255, 255, 255, 0.1)';
                      case 1: return 'rgba(76, 175, 80, 0.3)';
                      case 2: return 'rgba(76, 175, 80, 0.5)';
                      case 3: return 'rgba(76, 175, 80, 0.7)';
                      case 4: return 'rgba(76, 175, 80, 1)';
                      default: return 'rgba(255, 255, 255, 0.1)';
                    }
                  })()
                }}
                title={`Активность: уровень ${level}`}
              />
            ))}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontSize: 12, 
            color: 'rgba(255,255,255,0.4)' 
          }}>
            <span>Меньше</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2,3,4].map(level => (
                <div
                  key={level}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: level === 0 ? 'rgba(255,255,255,0.1)' : 
                                level === 1 ? 'rgba(76,175,80,0.3)' :
                                level === 2 ? 'rgba(76,175,80,0.5)' :
                                level === 3 ? 'rgba(76,175,80,0.7)' :
                                'rgba(76,175,80,1)'
                  }}
                />
              ))}
            </div>
            <span>Больше</span>
          </div>
        </div>

        {/* РЕЙТИНГ */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: 16, 
          padding: 16,
          marginBottom: 24
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Мой рейтинг</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, opacity: 0.7 }}>Общий рейтинг</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
                #{userData.rating.current}
              </span>
              <span style={{ fontSize: 13, opacity: 0.5 }}>из {userData.rating.total}</span>
            </div>
          </div>
          
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '12px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, opacity: 0.7 }}>Рост за неделю</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#4CAF50' }}>+{userData.rating.change} позиций</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, opacity: 0.7 }}>Лучший результат</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>#{userData.rating.best}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, opacity: 0.7 }}>В топ 10%</span>
            <span style={{ color: '#4CAF50' }}>✓ Да</span>
          </div>
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