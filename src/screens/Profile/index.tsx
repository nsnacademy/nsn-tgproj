import { useState } from 'react';

import {
  SafeArea,
  Container,
  Title,
  Text,
  ToggleRow,
  ToggleLabel,
  Toggle,
  ToggleKnob,
  Section,
} from './styles';

import { BottomNav, NavItem } from '../Home/styles';


type Screen = 'home' | 'create' | 'profile';

type ProfileProps = {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
};

export default function Profile({ screen, onNavigate }: ProfileProps) {
  const [adminMode, setAdminMode] = useState(false);

  return (
    <SafeArea>
      <Container>
        <Title>Профиль</Title>

        {/* 🔀 ТУМБЛЕР */}
        <Section>
          <ToggleRow>
            <ToggleLabel>Админ-режим</ToggleLabel>

            <Toggle
              $active={adminMode}
              onClick={() => setAdminMode(v => !v)}
            >
              <ToggleKnob $active={adminMode} />
            </Toggle>
          </ToggleRow>

          <Text>
            {adminMode
              ? 'Админ-панель (в разработке)'
              : 'Включите админ-режим для модерации вызовов'}
          </Text>
        </Section>
      </Container>

      {/* ⬇️ ТОТ ЖЕ BottomNav */}
      <BottomNav>
        {/* HOME */}
        <NavItem
          $active={screen === 'home'}
          onClick={() => onNavigate('home')}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>

        {/* CREATE */}
        <NavItem
          $active={screen === 'create'}
          onClick={() => onNavigate('create')}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </NavItem>

        {/* STATS */}
        <NavItem $active={false}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="18" x2="6" y2="14" />
            <line x1="12" y1="18" x2="12" y2="10" />
            <line x1="18" y1="18" x2="18" y2="6" />
          </svg>
        </NavItem>

        {/* PROFILE */}
        <NavItem
          $active={screen === 'profile'}
          onClick={() => onNavigate('profile')}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}
