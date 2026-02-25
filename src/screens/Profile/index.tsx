import { useEffect, useState } from 'react';
import {
  SafeArea,
  Container,
  Title,
  Text,
  Toggle,
  ToggleKnob,
  Section,
  SectionTitle,
  UserInfo,
  Avatar,
  UserName,
  UserHandle,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  CalendarGrid,
  CalendarDay,
  RatingCard,
  RatingRow,
  RatingLabel,
  RatingChange,
  RatingBadge,
  Divider,
} from './styles';
import { BottomNav, NavItem } from '../Home/styles';
import {
  getCurrentUser,
  checkIsCreator,
  getUserProfile,
  getUserActivity,
  getUserRating,
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
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [rating, setRating] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 переименовал с loading на isLoading и буду использовать

  /* =========================
     ЗАГРУЗКА ДАННЫХ
  ========================= */

  useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        // Загружаем профиль
        const userProfile = await getUserProfile(currentUser.id);
        setProfile(userProfile);
        
        // Проверяем, создатель ли
        const creator = await checkIsCreator(currentUser.id);
        setIsCreator(creator);
        
        // Загружаем активность за последние 30 дней
        const userActivity = await getUserActivity(currentUser.id, 30);
        setActivity(userActivity);
        
        // Загружаем рейтинг
        const userRating = await getUserRating(currentUser.id);
        setRating(userRating);
      } else {
        setIsCreator(false);
      }
      
      setIsLoading(false);
    }

    if (screen === 'profile') {
      loadUserData();
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

  /* =========================
     ГЕНЕРАЦИЯ КАЛЕНДАРЯ
  ========================= */

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    // Последние 30 дней
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Проверяем, был ли выполнен вызов в этот день
      const dateStr = date.toISOString().split('T')[0];
      const hasActivity = activity.some(a => 
        a.date === dateStr && a.completed > 0
      );
      
      days.push({
        date,
        hasActivity,
        level: hasActivity ? Math.floor(Math.random() * 4) + 1 : 0,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  // Подсчет streak (дней подряд)
const calculateStreak = () => {
  let streak = 0;
  
  // Сортируем активность по дате (от новых к старым)
  const sortedActivity = [...activity].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  for (let i = 0; i < sortedActivity.length; i++) {
    if (sortedActivity[i].completed > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

  const streak = calculateStreak();

  // Если загрузка - показываем индикатор
  if (isLoading) {
    return (
      <SafeArea>
        <Container>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Text>Загрузка профиля...</Text>
          </div>
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
        {user && (
          <UserInfo>
            <Avatar>
              {user.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="avatar"
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
              ) : (
                <svg width="40" height="40" fill="none" stroke="#fff" strokeWidth="2">
                  <circle cx="20" cy="15" r="8" />
                  <path d="M5 38c3-8 10-12 15-12s12 4 15 12" />
                </svg>
              )}
            </Avatar>
            <div>
              <UserName>
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Пользователь'}
              </UserName>
              <UserHandle>@{user.user_metadata?.username || user.email?.split('@')[0] || 'user'}</UserHandle>
            </div>
          </UserInfo>
        )}

        {/* 📊 БЫСТРАЯ СТАТИСТИКА */}
        <StatsGrid>
          <StatCard>
            <StatValue>{profile?.total_challenges || 0}</StatValue>
            <StatLabel>Вызовов</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{profile?.completed_challenges || 0}</StatValue>
            <StatLabel>Завершено</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{profile?.success_rate || 0}%</StatValue>
            <StatLabel>Успешность</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{streak}</StatValue>
            <StatLabel>Дней подряд</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* 🔥 КАЛЕНДАРЬ АКТИВНОСТИ */}
        <Section>
          <SectionTitle>
            Активность
            <span style={{ fontSize: 13, fontWeight: 'normal', opacity: 0.6, marginLeft: 8 }}>
              последние 30 дней
            </span>
          </SectionTitle>
          
          <CalendarGrid>
            {calendarDays.map((day, index) => (
              <CalendarDay 
                key={index}
                $level={day.level}
                title={`${day.date.toLocaleDateString('ru-RU')}: ${day.hasActivity ? 'Выполнено' : 'Нет активности'}`}
              />
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
        </Section>

        {/* 🏆 РЕЙТИНГ */}
        <Section>
          <SectionTitle>Мой рейтинг</SectionTitle>
          
          {rating ? (
            <>
              <RatingCard>
                <RatingRow>
                  <RatingLabel>Общий рейтинг</RatingLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RatingBadge>#{rating.global_rank || 47}</RatingBadge>
                    <Text style={{ fontSize: 13, opacity: 0.5 }}>
                      из {rating.total_participants || 1250}
                    </Text>
                  </div>
                </RatingRow>
                
                <Divider />
                
                <RatingRow>
                  <RatingLabel>Рост за неделю</RatingLabel>
                  <RatingChange $positive={rating.weekly_change > 0}>
                    {rating.weekly_change > 0 ? '+' : ''}{rating.weekly_change || 15} позиций
                  </RatingChange>
                </RatingRow>
                
                <RatingRow>
                  <RatingLabel>Лучший результат</RatingLabel>
                  <Text style={{ fontWeight: 600 }}>#{rating.best_rank || 32}</Text>
                </RatingRow>
                
                <RatingRow>
                  <RatingLabel>В топ 10%</RatingLabel>
                  <Text style={{ color: '#4CAF50' }}>✓ Да</Text>
                </RatingRow>
              </RatingCard>
              
              <Text style={{ fontSize: 13, marginTop: 12, opacity: 0.6 }}>
                Рейтинг обновляется ежедневно на основе вашей активности
              </Text>
            </>
          ) : (
            <Text style={{ opacity: 0.6 }}>Загрузка рейтинга...</Text>
          )}
        </Section>

        {/* 🔧 АДМИН-РЕЖИМ */}
        <Section style={{ marginTop: 16 }}>
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
        </Section>
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