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
  WeekDays,
  DayCell,
  DayDot,
  MonthGrid,
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
  full_name: string;
  avatar_url: string;
  total_days: number;
  total_challenges: number;
  current_streak: number;
  max_streak: number;
  power_index: number;
};

type DailyLog = {
  date: string;
  challenges_count: number;
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
  const [adminMode, setAdminMode] = useState(() => localStorage.getItem('adminMode') === 'true');
  const [locked, setLocked] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

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
          full_name: currentUser.user_metadata?.full_name || 'Пользователь',
          avatar_url: currentUser.user_metadata?.avatar_url || '',
          total_days: userStats.total_days || 0,
          total_challenges: userStats.total_challenges || 0,
          current_streak: userStats.current_streak || 0,
          max_streak: userStats.max_streak || 0,
          power_index: userStats.power_index || 0,
        });
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('date, challenges_count')
        .eq('user_id', currentUser.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

      setDailyLogs(logs || []);
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

  const getMonthDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    let startOffset = firstDay.getDay() - 1;
    if (startOffset === -1) startOffset = 6;
    
    for (let i = 0; i < startOffset; i++) days.push(null);
    
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split('T')[0];
      const log = dailyLogs.find(l => l.date === dateStr);
      days.push({
        day: d,
        hasActivity: !!log,
        intensity: log?.challenges_count || 0,
      });
    }
    
    return days;
  };

  if (!stats) return null;

  return (
    <SafeArea>
      <Container>
        {/* HEADER - НЕ ТРОГАЕМ */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Title>Профиль</Title>
          <Toggle $active={adminMode} $disabled={!isCreator} onClick={onToggleAdmin}>
            <ToggleKnob $active={adminMode} />
          </Toggle>
        </div>

        {/* USER INFO */}
        <UserInfo>
          <UserAvatar>
            {stats.avatar_url ? (
              <img src={stats.avatar_url} alt="avatar" />
            ) : (
              stats.username?.[0]?.toUpperCase() || '?'
            )}
          </UserAvatar>
          <div>
            <UserName>{stats.full_name}</UserName>
            <UserHandle>@{stats.username || 'unknown'}</UserHandle>
          </div>
        </UserInfo>

        {/* POWER INDEX */}
        <IndexBadge>
          <span style={{ fontSize: 24, fontWeight: 700 }}>⚡ {stats.power_index.toFixed(1)}</span>
          <StatusBadge $index={stats.power_index}>
            {stats.power_index >= 100 ? '🔥' : stats.power_index >= 50 ? '📈' : stats.power_index >= 20 ? '🌱' : '💤'}
          </StatusBadge>
        </IndexBadge>

        {/* STATS GRID */}
        <StatsGrid>
          <StatItem><StatValue>{stats.total_days}</StatValue><StatLabel>дней</StatLabel></StatItem>
          <StatItem><StatValue>{stats.current_streak}</StatValue><StatLabel>стрик</StatLabel></StatItem>
          <StatItem><StatValue>{stats.max_streak}</StatValue><StatLabel>рекорд</StatLabel></StatItem>
          <StatItem><StatValue>{stats.total_challenges}</StatValue><StatLabel>вызовов</StatLabel></StatItem>
        </StatsGrid>

        {/* MINI CALENDAR */}
        <CalendarSection>
          <WeekDays>
            <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
          </WeekDays>
          <MonthGrid>
            {getMonthDays().map((day, i) => (
              <DayCell key={i}>
                {day?.hasActivity && (
                  <DayDot $intensity={
                    day.intensity >= 3 ? 'high' :
                    day.intensity >= 2 ? 'medium' : 'low'
                  } />
                )}
              </DayCell>
            ))}
          </MonthGrid>
        </CalendarSection>

        <FriendLink>Друзья ›</FriendLink>

        {isCreator === false && (
          <Text style={{ marginTop: 12, fontSize: 13, opacity: 0.6 }}>
            Админ-режим доступен только создателю вызова
          </Text>
        )}
      </Container>

      {/* BOTTOM NAV - НЕ ТРОГАЕМ */}
      <BottomNav>
        <NavItem $active={screen === 'home'} onClick={() => onNavigate('home')}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>
        <NavItem $active={screen === 'create'} onClick={() => onNavigate('create')}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </NavItem>
        <NavItem $active={false}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="18" x2="6" y2="14" /><line x1="12" y1="18" x2="12" y2="10" /><line x1="18" y1="18" x2="18" y2="6" />
          </svg>
        </NavItem>
        <NavItem $active={screen === 'profile'} onClick={() => onNavigate('profile')}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}