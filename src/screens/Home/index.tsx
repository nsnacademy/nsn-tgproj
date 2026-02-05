import { useState } from 'react';

import {
  SafeArea,
  HomeContainer,
  Header,
  StatusLabel,
  StatusTitle,
  Tabs,
  Tab,
  CenterWrapper,
  EmptyText,
  BottomNav,
  NavItem,
} from './styles';

/* 👇 ПРОПСЫ ДЛЯ НАВИГАЦИИ */
type HomeProps = {
  onNavigate: (screen: 'home' | 'create') => void;
};

export function Home({ onNavigate }: HomeProps) {
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  return (
    <SafeArea>
      <HomeContainer>
        {/* HEADER */}
        <Header>
          <StatusLabel>Состояние</StatusLabel>
          <StatusTitle>
            {tab === 'active'
              ? 'Нет активных вызовов'
              : 'Нет завершённых вызовов'}
          </StatusTitle>
        </Header>

        {/* TABS */}
        <Tabs>
          <Tab $active={tab === 'active'} onClick={() => setTab('active')}>
            Активные вызовы
          </Tab>

          <Tab
            $active={tab === 'completed'}
            onClick={() => setTab('completed')}
          >
            Завершенные вызовы
          </Tab>
        </Tabs>

        {/* CENTER */}
        <CenterWrapper>
          {tab === 'active' ? (
            <EmptyText>
              Создайте новый вызов или
              <br />
              присоединитесь к существующему
            </EmptyText>
          ) : (
            <EmptyText>
              У вас пока нет
              <br />
              завершённых вызовов
            </EmptyText>
          )}
        </CenterWrapper>
      </HomeContainer>

      {/* BOTTOM NAV */}
      <BottomNav>
        {/* HOME */}
        <NavItem $active>
          <svg width="24" height="24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>

        {/* CREATE */}
        <NavItem onClick={() => onNavigate('create')}>
          <svg width="24" height="24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </NavItem>

        {/* SIGNAL */}
        <NavItem>
          <svg width="24" height="24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round">
            <line x1="6" y1="18" x2="6" y2="14" />
            <line x1="12" y1="18" x2="12" y2="10" />
            <line x1="18" y1="18" x2="18" y2="6" />
          </svg>
        </NavItem>

        {/* PROFILE */}
        <NavItem>
          <svg width="24" height="24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}
