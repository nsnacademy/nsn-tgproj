import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import {
  SafeArea,
  Container,
  Title,
  Text,
  Toggle,
  ToggleKnob,
  UserInfo,
  UserName,
  UserHandle,
  UserAvatar,
  StatsGrid,
  StatItem,
  StatValue,
  StatLabel,
  IndexBadge,
  StatusBadge,
  CalendarSection,
  MonthTitle,
  WeekDays,
  DotsGrid,
  DayDot,
  FriendLink,
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

type UserStats = {
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  total_days: number;
  total_challenges: number;
  current_streak: number;
  max_streak: number;
  power_index: number;
};

type SupabaseUser = {
  id: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    username?: string;
  };
};

export default function Profile({ screen, onNavigate }: ProfileProps) {
  const [adminMode, setAdminMode] = useState(() => {
    const saved = localStorage.getItem('adminMode');
    return saved === 'true';
  });
  
  const [locked, setLocked] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser() as SupabaseUser | null;
      if (!currentUser) return;

      const { data: userStats } = await supabase
        .from('users')
        .select('username, total_days, total_challenges, current_streak, max_streak, power_index')
        .eq('id', currentUser.id)
        .single();

      if (userStats) {
        setStats({
          username: userStats.username,
          full_name: currentUser.user_metadata?.full_name || null,
          avatar_url: currentUser.user_metadata?.avatar_url || null,
          total_days: userStats.total_days || 0,
          total_challenges: userStats.total_challenges || 0,
          current_streak: userStats.current_streak || 0,
          max_streak: userStats.max_streak || 0,
          power_index: userStats.power_index || 0,
        });
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 35);
      
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('date')
        .eq('user_id', currentUser.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

      const active = new Set(logs?.map(log => log.date) || []);
      setActiveDays(active);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function checkAccess() {
      const user = await getCurrentUser() as SupabaseUser | null;
      if (!user) {
        setIsCreator(false);
        return;
      }
      const creator = await checkIsCreator(user.id);
      setIsCreator(creator);
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

  const getStatusText = (index: number) => {
    if (index >= 100) return '🔥';
    if (index >= 50) return '📈';
    if (index >= 20) return '🌱';
    return '💤';
  };

  // Календарь 5 недель (35 дней)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 34); // 35 дней назад
  
  const days = [];
  for (let i = 0; i < 35; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      isActive: activeDays.has(dateStr),
    });
  }

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <SafeArea>
      <Container>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title>Профиль</Title>
          <Toggle $active={adminMode} $disabled={!isCreator} onClick={onToggleAdmin}>
            <ToggleKnob $active={adminMode} />
          </Toggle>
        </div>

        {stats && (
          <>
            <UserInfo>
              <UserAvatar>
                {stats.avatar_url ? (
                  <img src={stats.avatar_url} alt="avatar" />
                ) : (
                  stats.username?.[0]?.toUpperCase() || '?'
                )}
              </UserAvatar>
              <div>
                <UserName>{stats.full_name || 'Пользователь'}</UserName>
                <UserHandle>@{stats.username}</UserHandle>
              </div>
            </UserInfo>

            <IndexBadge>
              <span style={{ fontSize: 20, fontWeight: 700 }}>⚡{Math.round(stats.power_index)}</span>
              <StatusBadge $status={getStatusText(stats.power_index)}>
                {getStatusText(stats.power_index)}
              </StatusBadge>
            </IndexBadge>

            <StatsGrid>
              <StatItem>
                <StatValue>{stats.total_days}</StatValue>
                <StatLabel>дней</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.current_streak}</StatValue>
                <StatLabel>стрик</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.max_streak}</StatValue>
                <StatLabel>рекорд</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.total_challenges}</StatValue>
                <StatLabel>вызовов</StatLabel>
              </StatItem>
            </StatsGrid>

            <CalendarSection>
              <MonthTitle>Последние 35 дней</MonthTitle>
              <WeekDays>
                {weekDays.map(day => (
                  <span key={day}>{day}</span>
                ))}
              </WeekDays>
              <DotsGrid>
                {days.map((day, i) => (
                  <DayDot key={i} $active={day.isActive} />
                ))}
              </DotsGrid>
            </CalendarSection>

            <FriendLink>Друзья ›</FriendLink>
          </>
        )}

        {isCreator === false && (
          <Text style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
            Админ-режим доступен только создателю вызова
          </Text>
        )}
      </Container>

      <BottomNav>
        <NavItem $active={screen === 'home'} onClick={() => onNavigate('home')}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>
        <NavItem $active={screen === 'create'} onClick={() => onNavigate('create')}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </NavItem>
        <NavItem $active={false}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="18" x2="6" y2="14" />
            <line x1="12" y1="18" x2="12" y2="10" />
            <line x1="18" y1="18" x2="18" y2="6" />
          </svg>
        </NavItem>
        <NavItem $active={screen === 'profile'} onClick={() => onNavigate('profile')}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}