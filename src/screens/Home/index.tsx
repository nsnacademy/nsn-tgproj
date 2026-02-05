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

/* SVG (dev + prod) */
import homeIcon from '../../assets/icons/home.svg';
import searchIcon from '../../assets/icons/create.svg';
import plusIcon from '../../assets/icons/plus.svg';
import profileIcon from '../../assets/icons/profile.svg';

/* 👇 ПРОПСЫ ДЛЯ НАВИГАЦИИ */
type HomeProps = {
  onNavigate: (screen: 'home' | 'create') => void;
};

export function Home({ onNavigate }: HomeProps) {
  /* состояние табов */
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
          <Tab
            $active={tab === 'active'}
            onClick={() => setTab('active')}
          >
            Активные вызовы
          </Tab>

          <Tab
            $active={tab === 'completed'}
            onClick={() => setTab('completed')}
          >
            Завершенные вызовы
          </Tab>
        </Tabs>

        {/* CENTER CONTENT */}
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
        {/* HOME — АКТИВЕН */}
        <NavItem $active>
          <img src={homeIcon} alt="home" />
        </NavItem>

        {/* CREATE — ВТОРАЯ КНОПКА */}
        <NavItem onClick={() => onNavigate('create')}>
          <img src={plusIcon} alt="create" />
        </NavItem>

        <NavItem>
          <img src={searchIcon} alt="search" />
        </NavItem>

        <NavItem>
          <img src={profileIcon} alt="profile" />
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}