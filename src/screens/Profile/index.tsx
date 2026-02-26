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
  ScoreCard,
  ScoreValue,
  ScoreBadge,
  ScoreInfo,
  ScoreToday,
  PopupOverlay,
  Popup,
  PopupClose,
  PopupTitle,
  PopupText,
  StatsRow,
  StatBlock,
  StatNumber,
  StatLabel,
  SimpleList,
  SimpleItem,
  SimpleLabel,
  SimpleValue,
  TotalRow,
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

  if (!stats) {
    return (
      <SafeArea>
        <Container>
          <Text>Загрузка...</Text>
        </Container>
      </SafeArea>
    );
  }

  const daysScore = Math.round(stats.total_days * 0.5);
  const recordScore = stats.max_streak;
  const challengesScore = stats.total_challenges * 2;
  const monthScore = 80;
  const totalScore = Math.round(stats.power_index);

  return (
    <SafeArea>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Title>Профиль</Title>
          <Toggle $active={adminMode} $disabled={!isCreator} onClick={onToggleAdmin}>
            <ToggleKnob $active={adminMode} />
          </Toggle>
        </div>

        <div style={{ marginBottom: 20 }}>
          <UserName>{stats.full_name || 'Пользователь'}</UserName>
          <UserHandle>@{stats.username}</UserHandle>
        </div>

        <ScoreCard>
          <ScoreValue>{totalScore}</ScoreValue>
          <ScoreBadge>⚡</ScoreBadge>
          <ScoreInfo onClick={() => setShowInfo(true)}>i</ScoreInfo>
          <ScoreToday>+3 сегодня</ScoreToday>
        </ScoreCard>

        {showInfo && (
          <>
            <PopupOverlay onClick={() => setShowInfo(false)} />
            <Popup>
              <PopupClose onClick={() => setShowInfo(false)}>✕</PopupClose>
              <PopupTitle>Как считается рейтинг</PopupTitle>
              <PopupText>• Дни: {stats.total_days} ×0.5 = {daysScore}</PopupText>
              <PopupText>• Рекорд: {stats.max_streak} ×1 = {recordScore}</PopupText>
              <PopupText>• Вызовы: {stats.total_challenges} ×2 = {challengesScore}</PopupText>
              <PopupText>• Активность за месяц: +{monthScore}</PopupText>
              <PopupText style={{ marginTop: 10, color: '#ffd700' }}>
                Итого: {daysScore} + {recordScore} + {challengesScore} + {monthScore} = {totalScore}
              </PopupText>
            </Popup>
          </>
        )}

        <StatsRow>
          <StatBlock>
            <StatNumber>{stats.total_days}</StatNumber>
            <StatLabel>дней</StatLabel>
          </StatBlock>
          <StatBlock>
            <StatNumber>{stats.current_streak}</StatNumber>
            <StatLabel>подряд</StatLabel>
          </StatBlock>
          <StatBlock>
            <StatNumber>{stats.max_streak}</StatNumber>
            <StatLabel>рекорд</StatLabel>
          </StatBlock>
          <StatBlock>
            <StatNumber>{stats.total_challenges}</StatNumber>
            <StatLabel>вызовов</StatLabel>
          </StatBlock>
        </StatsRow>

        <SimpleList>
          <SimpleItem>
            <SimpleLabel>Баллы за дни ({stats.total_days} ×0.5)</SimpleLabel>
            <SimpleValue>+{daysScore}</SimpleValue>
          </SimpleItem>
          <SimpleItem>
            <SimpleLabel>Баллы за рекорд ({stats.max_streak} ×1)</SimpleLabel>
            <SimpleValue>+{recordScore}</SimpleValue>
          </SimpleItem>
          <SimpleItem>
            <SimpleLabel>Баллы за вызовы ({stats.total_challenges} ×2)</SimpleLabel>
            <SimpleValue>+{challengesScore}</SimpleValue>
          </SimpleItem>
          <SimpleItem>
            <SimpleLabel>Баллы за последние 30 дней</SimpleLabel>
            <SimpleValue>+{monthScore}</SimpleValue>
          </SimpleItem>
          <TotalRow>
            <SimpleLabel>Всего баллов</SimpleLabel>
            <SimpleValue>{totalScore}</SimpleValue>
          </TotalRow>
        </SimpleList>

        {isCreator === false && (
          <AdminNote>Админ-режим только для создателя</AdminNote>
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