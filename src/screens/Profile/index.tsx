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
  StatItem,
  StatValue,
  StatLabel,
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
  const [adminMode, setAdminMode] = useState(() => {
    const saved = localStorage.getItem('adminMode');
    return saved === 'true';
  });

  const [locked, setLocked] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  /* =========================
     LOAD USER
  ========================= */

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    loadUser();
  }, []);

  /* =========================
     CHECK CREATOR ACCESS
  ========================= */

  useEffect(() => {
    async function checkAccess() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        setIsCreator(false);
        return;
      }

      const creator = await checkIsCreator(currentUser.id);
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
     RESET ON RETURN
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

        {/* USER CARD */}
        {user && (
          <UserCard>
            <UserAvatar>
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="avatar" />
              ) : (
                user.user_metadata?.username?.[0]?.toUpperCase() || '?'
              )}
            </UserAvatar>

            <UserInfo>
              <UserName>
                {user.user_metadata?.full_name || 'Пользователь'}
              </UserName>
              <UserHandle>
                @{user.user_metadata?.username || 'unknown'}
              </UserHandle>
            </UserInfo>
          </UserCard>
        )}

        {/* STATS */}
        <StatsGrid>
          <StatItem>
            <StatValue>7</StatValue>
            <StatLabel>streak</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>42</StatValue>
            <StatLabel>дней</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>5</StatValue>
            <StatLabel>вызовов</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>Impact</StatValue>
            <StatLabel>вклад</StatLabel>
          </StatItem>
        </StatsGrid>

        {/* HEADER — НЕ ТРОГАЕМ */}
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
      </Container>

      {/* BOTTOM NAV — НЕ ТРОГАЕМ */}
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