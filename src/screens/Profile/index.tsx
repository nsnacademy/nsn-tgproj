import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Container,
  Title,
  Text,
  Toggle,
  ToggleKnob,
  UserHandle,
  UserBio,
  UserStack,
  UserStats,
  StatsRow,
  StatItem,
  StatNumber,
  StatLabel,
  IndexBadge,
  IndexValue,
  IndexPercent,
  ActivityBar,
  ActivityFill,
  ActivityLabel,
  ContactSection,
  ContactItem,
  ContactLabel,
  ContactValue,
  EditButton,
  StatusBadge,
  StatusSelector,
  InviteButton,
  SectionDivider,
  SectionTitle,
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
  userId?: string;
};

type UserStats = {
  username: string;
  bio: string | null;
  stack: string[] | null;
  experience: string | null;
  portfolio: string | null;
  telegram: string | null;
  email: string | null;
  status: 'searching' | 'considering' | 'busy' | null;
  total_days: number;
  total_challenges: number;
  current_streak: number;
  max_streak: number;
  power_index: number;
  total_calls: number;
  monthly_active: number;
  weekly_growth: number;
};

type SupabaseUser = {
  id: string;
  user_metadata?: {
    full_name?: string;
    username?: string;
  };
};

export default function Profile({ screen, onNavigate, userId }: ProfileProps) {
  const [adminMode, setAdminMode] = useState(() => {
    const saved = localStorage.getItem('adminMode');
    return saved === 'true';
  });
  
  const [locked, setLocked] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  useEffect(() => {
    async function checkOwnProfile() {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;
      setIsOwnProfile(!userId || userId === currentUser.id);
    }
    checkOwnProfile();
  }, [userId]);

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser() as SupabaseUser | null;
      if (!currentUser) return;

      const targetUserId = userId || currentUser.id;

      // Загружаем данные из БД
      const { data: userStats } = await supabase
        .from('users')
        .select(`
          username, 
          total_days, 
          total_challenges, 
          current_streak, 
          max_streak, 
          power_index
        `)
        .eq('id', targetUserId)
        .single();

      // Здесь потом будет загрузка из profile_data
      if (userStats) {
        setStats({
          username: userStats.username || 'user',
          bio: 'Frontend-разработчик',
          stack: ['React', 'TypeScript', 'Node'],
          experience: '3 года',
          portfolio: 'github.com/alex',
          telegram: '@alex_dev',
          email: 'alex@mail.com',
          status: 'searching',
          total_days: userStats.total_days || 0,
          total_challenges: userStats.total_challenges || 0,
          current_streak: userStats.current_streak || 0,
          max_streak: userStats.max_streak || 0,
          power_index: userStats.power_index || 0,
          total_calls: Math.round((userStats.total_challenges || 0) * 1.5),
          monthly_active: Math.min(30, Math.round((userStats.total_days || 0) * 0.7)),
          weekly_growth: 12,
        });
      }
    }

    loadData();
  }, [userId]);

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

  const monthPercent = Math.round((stats.monthly_active / 30) * 100);
  const callsPercent = stats.total_days > 0 
    ? Math.round((stats.total_calls / stats.total_days) * 100) - 100 
    : 0;

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

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div style={{ marginTop: 20 }}>
          {/* Только username */}
          <UserHandle style={{ fontSize: 24, marginBottom: 16 }}>@{stats.username}</UserHandle>

          {/* Индекс дисциплины из БД */}
          <IndexBadge>
            <IndexValue>⚡ {Math.round(stats.power_index)}</IndexValue>
            <IndexPercent>· выше чем 78%</IndexPercent>
          </IndexBadge>

          {/* О себе */}
          <UserBio>{stats.bio}</UserBio>
          <UserStack>{stats.stack?.join(' · ')}</UserStack>
          <UserStats>Опыт: {stats.experience} · Портфолио: {stats.portfolio}</UserStats>

          <SectionDivider />

          {/* СТАТИСТИКА */}
          <SectionTitle>Показатели</SectionTitle>
          <StatsRow>
            <StatItem>
              <StatNumber>{stats.total_days}</StatNumber>
              <StatLabel>дней</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{stats.current_streak}</StatNumber>
              <StatLabel>подряд</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{stats.max_streak}</StatNumber>
              <StatLabel>рекорд</StatLabel>
            </StatItem>
          </StatsRow>

          {/* Активность */}
          <ActivityBar>
            <ActivityFill $width={monthPercent} />
          </ActivityBar>
          <ActivityLabel>
            {stats.monthly_active}/30 дней · {stats.total_calls} вызовов 
            {callsPercent > 0 && ` (+${callsPercent}%)`}
          </ActivityLabel>

          {/* Динамика */}
          {stats.weekly_growth > 0 && (
            <ActivityLabel style={{ marginTop: 8, color: '#4caf50' }}>
              ▲ +{stats.weekly_growth}% за неделю
            </ActivityLabel>
          )}

          <SectionDivider />

          {/* КОНТАКТЫ */}
          {isOwnProfile ? (
            /* СВОЙ ПРОФИЛЬ */
            <>
              <SectionTitle>Контакты</SectionTitle>
              <ContactSection>
                <ContactItem>
                  <ContactLabel>Telegram</ContactLabel>
                  <ContactValue>{stats.telegram}</ContactValue>
                </ContactItem>
                <ContactItem>
                  <ContactLabel>Email</ContactLabel>
                  <ContactValue>{stats.email}</ContactValue>
                </ContactItem>
                <EditButton>✎ Редактировать</EditButton>
              </ContactSection>

              <SectionTitle>Статус</SectionTitle>
              <StatusSelector>
                <StatusBadge $active={stats.status === 'searching'}>🔍 Ищу</StatusBadge>
                <StatusBadge $active={stats.status === 'considering'}>🤔 Смотрю</StatusBadge>
                <StatusBadge $active={stats.status === 'busy'}>⏳ Занят</StatusBadge>
              </StatusSelector>
            </>
          ) : (
            /* ЧУЖОЙ ПРОФИЛЬ */
            <>
              <SectionTitle>Контакты</SectionTitle>
              <ContactSection>
                <ContactItem>
                  <ContactLabel>Telegram</ContactLabel>
                  <ContactValue>{stats.telegram}</ContactValue>
                </ContactItem>
                {stats.email && (
                  <ContactItem>
                    <ContactLabel>Email</ContactLabel>
                    <ContactValue>{stats.email}</ContactValue>
                  </ContactItem>
                )}
              </ContactSection>

              <InviteButton>
                ПРИГЛАСИТЬ
              </InviteButton>

              {stats.status === 'searching' && (
                <StatusBadge $active style={{ marginTop: 12, display: 'inline-block' }}>
                  🔍 ИЩЕТ
                </StatusBadge>
              )}
            </>
          )}

          <SectionDivider />

          {/* ACCESS INFO */}
          {isCreator === false && (
            <Text style={{ marginTop: 8, fontSize: 12, color: '#666', textAlign: 'center' }}>
              Админ-режим только для создателя
            </Text>
          )}
        </div>
      </Container>

      {/* BOTTOM NAV */}
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