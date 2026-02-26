import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Container,
  Title,
  Text,
  Toggle,
  ToggleKnob,
  UserName,
  UserHandle,
  Power,
  PowerValue,
  PowerStatus,
  PowerInfo,
  PowerToday,
  PopupOverlay,
  Popup,
  PopupClose,
  PopupTitle,
  PopupText,
  StatsRow,
  StatBlock,
  StatValue,
  StatLabel,
  ActivityStats,
  ActivityStat,
  ActivityLabel,
  ActivityValue,
  AdminNote,
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
  const [showInfo, setShowInfo] = useState(false);

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
    }

    loadData();
  }, []);

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

  // Расчет для отображения
  const daysScore = stats ? Math.round(stats.total_days * 0.5) : 0;
  const recordScore = stats?.max_streak || 0;
  const challengesScore = stats ? stats.total_challenges * 2 : 0;
  const monthlyScore = 80; // Пример
  const totalScore = stats ? Math.round(stats.power_index) : 0;

  return (
    <SafeArea>
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
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

        {stats ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <UserName>{stats.full_name || 'Пользователь'}</UserName>
              <UserHandle>@{stats.username}</UserHandle>
            </div>

            <Power>
              <PowerValue>{totalScore}</PowerValue>
              <PowerStatus>{getStatusText(totalScore)}</PowerStatus>
              <PowerInfo onClick={() => setShowInfo(true)}>i</PowerInfo>
              <PowerToday>+3 сегодня</PowerToday>
            </Power>

            {showInfo && (
              <>
                <PopupOverlay onClick={() => setShowInfo(false)} />
                <Popup>
                  <PopupClose onClick={() => setShowInfo(false)}>✕</PopupClose>
                  <PopupTitle>Как считается индекс</PopupTitle>
                  <PopupText>• За каждый день: +0.5</PopupText>
                  <PopupText>• Рекордный стрик: +1 за день</PopupText>
                  <PopupText>• За вызов: +2</PopupText>
                  <PopupText>• За активность в месяце: до +100</PopupText>
                  <PopupText style={{ marginTop: 12, color: '#ffd700' }}>
                    Пример: 42 дня (21) + рекорд 15 (15) + 5 вызовов (10) + месяц (80) = 126
                  </PopupText>
                </Popup>
              </>
            )}

            <StatsRow>
              <StatBlock>
                <StatValue>{stats.total_days}</StatValue>
                <StatLabel>дней</StatLabel>
              </StatBlock>
              <StatBlock>
                <StatValue>{stats.current_streak}</StatValue>
                <StatLabel>подряд</StatLabel>
              </StatBlock>
              <StatBlock>
                <StatValue>{stats.max_streak}</StatValue>
                <StatLabel>рекорд</StatLabel>
              </StatBlock>
              <StatBlock>
                <StatValue>{stats.total_challenges}</StatValue>
                <StatLabel>вызовов</StatLabel>
              </StatBlock>
            </StatsRow>

            <ActivityStats>
              <ActivityStat>
                <ActivityLabel>Баллы за дни ({stats.total_days} ×0.5)</ActivityLabel>
                <ActivityValue>{daysScore}</ActivityValue>
              </ActivityStat>
              <ActivityStat>
                <ActivityLabel>Баллы за рекорд ({stats.max_streak} ×1)</ActivityLabel>
                <ActivityValue>{recordScore}</ActivityValue>
              </ActivityStat>
              <ActivityStat>
                <ActivityLabel>Баллы за вызовы ({stats.total_challenges} ×2)</ActivityLabel>
                <ActivityValue>{challengesScore}</ActivityValue>
              </ActivityStat>
              <ActivityStat>
                <ActivityLabel>Баллы за последние 30 дней</ActivityLabel>
                <ActivityValue>{monthlyScore}</ActivityValue>
              </ActivityStat>
              <ActivityStat $total>
                <ActivityLabel>Итого</ActivityLabel>
                <ActivityValue>{totalScore}</ActivityValue>
              </ActivityStat>
            </ActivityStats>

            {isCreator === false && (
              <AdminNote>Админ-режим только для создателя</AdminNote>
            )}
          </>
        ) : (
          <Text>Загрузка...</Text>
        )}
      </Container>

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