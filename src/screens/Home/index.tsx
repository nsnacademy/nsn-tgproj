import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  FixedHeaderWrapper,
  HeaderSpacer,
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
  Card,
  CardTitleRow,
  CardTitle,
  CardRank,
  CardLabel,
  CardValue,
  ProgressWrapper,
  ProgressBar,
  ProgressFill,
  ProgressText,
  PrimaryButton,
  BottomNavSpacer,
} from './styles';

type HomeProps = {
  onNavigate: (screen: 'home' | 'create') => void;
  refreshKey: number;
};

type ChallengeItem = {
  participant_id: string;
  challenge_id: string;
  title: string;
  is_finished: boolean;
};

export function Home({ onNavigate, refreshKey }: HomeProps) {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ChallengeItem[]>([]);

  async function load() {
    setLoading(true);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .single();

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('participants')
      .select(
        `
        id,
        challenge:challenge_id (
          id,
          title,
          is_finished
        )
      `
      )
      .eq('user_id', user.id);

    if (!data) {
      setItems([]);
      setLoading(false);
      return;
    }

    const normalized: ChallengeItem[] = data
      .filter((p: any) => p.challenge)
      .map((p: any) => ({
        participant_id: p.id,
        challenge_id: p.challenge.id,
        title: p.challenge.title,
        is_finished: p.challenge.is_finished,
      }));

    setItems(normalized);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  /* ============================
     SCROLL FOCUS EFFECT (ONLY UI)
     ============================ */
  useEffect(() => {
    const container = document.querySelector(
      '[data-scroll-container]'
    ) as HTMLDivElement | null;

    if (!container) return;

    const onScroll = () => {
      const cards = Array.from(
        container.querySelectorAll('[data-card]')
      ) as HTMLDivElement[];

      const center =
        container.scrollTop + container.clientHeight / 2;

      cards.forEach((card) => {
        const cardCenter =
          card.offsetTop + card.offsetHeight / 2;

        const distance = Math.abs(cardCenter - center);
        const max = container.clientHeight / 2;
        const ratio = Math.min(distance / max, 1);

        const scale = 1 - ratio * 0.07;
        const opacity = 1 - ratio * 0.35;

        card.style.transform = `scale(${scale})`;
        card.style.opacity = `${opacity}`;

        if (ratio < 0.15) {
          card.style.boxShadow =
            '0 22px 48px rgba(0,0,0,0.65)';
          card.style.border =
            '1px solid rgba(255,255,255,0.28)';
        } else {
          card.style.boxShadow = 'none';
          card.style.border =
            '1px solid rgba(255,255,255,0.08)';
        }
      });
    };

    onScroll();
    container.addEventListener('scroll', onScroll);

    return () => container.removeEventListener('scroll', onScroll);
  }, [items.length, tab]);

  const active = items.filter((i) => !i.is_finished);
  const completed = items.filter((i) => i.is_finished);
  const list = tab === 'active' ? active : completed;

  return (
    <SafeArea>
      {/* FIXED HEADER */}
      <FixedHeaderWrapper>
        <HeaderSpacer />
        <Header>
          <StatusLabel>Состояние</StatusLabel>
          <StatusTitle>
            {tab === 'active'
              ? active.length === 0
                ? 'Нет активных вызовов'
                : 'Активные вызовы'
              : completed.length === 0
              ? 'Нет завершённых вызовов'
              : 'Завершённые вызовы'}
          </StatusTitle>
        </Header>

        <Tabs>
          <Tab $active={tab === 'active'} onClick={() => setTab('active')}>
            Активные вызовы
          </Tab>
          <Tab
            $active={tab === 'completed'}
            onClick={() => setTab('completed')}
          >
            Завершённые вызовы
          </Tab>
        </Tabs>
      </FixedHeaderWrapper>

      {/* SCROLLABLE */}
      <HomeContainer>
        <CenterWrapper data-scroll-container>
          {loading ? (
            <EmptyText>Загрузка…</EmptyText>
          ) : list.length === 0 ? (
            <EmptyText>Нет вызовов</EmptyText>
          ) : (
            list.map((item) => (
              <Card key={item.participant_id} data-card>
                <CardTitleRow>
                  <CardTitle>{item.title}</CardTitle>
                  <CardRank>#12</CardRank>
                </CardTitleRow>

                <CardLabel>Длительность</CardLabel>
                <CardValue>До 31 августа</CardValue>

                <CardLabel>Участники</CardLabel>
                <CardValue>89 человек</CardValue>

                <ProgressWrapper>
                  <ProgressBar>
                    <ProgressFill style={{ width: '11%' }} />
                  </ProgressBar>
                  <ProgressText>3.2 / 30 км</ProgressText>
                </ProgressWrapper>

                {!item.is_finished && (
                  <PrimaryButton>
                    Перейти к отчёту
                  </PrimaryButton>
                )}
              </Card>
            ))
          )}
        </CenterWrapper>

        <BottomNavSpacer />
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
