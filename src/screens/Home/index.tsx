import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

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
  Card,
  CardTitleRow,
  CardTitle,
  CardLabel,
  CardValue,
  ProgressWrapper,
  ProgressBar,
  ProgressFill,
  ProgressText,
  PrimaryButton,
  FixedHeaderWrapper,
  HeaderSpacer,
} from './styles';

type HomeProps = {
  onNavigate: (screen: 'home' | 'create') => void;
  refreshKey: number;
};

type ChallengeItem = {
  participant_id: string;
  challenge_id: string;

  title: string;
  start_at: string;
  end_at: string;

  has_goal: boolean;
  goal_value: number | null;
  user_progress: number | null;

  participants_count: number;

  user_completed: boolean;
  challenge_finished: boolean;
};

export function Home({ onNavigate, refreshKey }: HomeProps) {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ChallengeItem[]>([]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  async function load() {
    setLoading(true);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      setItems([]);
      setLoading(false);
      return;
    }

    // ✅ 1. Получаем UUID пользователя
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

    // ✅ 2. Передаём UUID в RPC
    const { data } = await supabase.rpc('get_home_challenges', {
      p_user_id: user.id,
    });

    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  const active = items.filter((i) => !i.challenge_finished);
  const completed = items.filter((i) => i.challenge_finished);
  const list = tab === 'active' ? active : completed;

  return (
    <SafeArea>
      {/* HEADER */}
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
            Активные
          </Tab>
          <Tab
            $active={tab === 'completed'}
            onClick={() => setTab('completed')}
          >
            Завершённые
          </Tab>
        </Tabs>
      </FixedHeaderWrapper>

      {/* LIST */}
      <HomeContainer ref={scrollRef}>
        <CenterWrapper>
          {loading ? (
            <EmptyText>Загрузка…</EmptyText>
          ) : list.length === 0 ? (
            <EmptyText>Нет вызовов</EmptyText>
          ) : (
            list.map((item) => {
              const progress =
                item.has_goal && item.goal_value
                  ? Math.min(
                      100,
                      Math.round(
                        ((item.user_progress ?? 0) / item.goal_value) * 100
                      )
                    )
                  : 0;

              return (
                <Card key={item.participant_id}>
                  <CardTitleRow>
                    <CardTitle>{item.title}</CardTitle>
                  </CardTitleRow>

                  <CardLabel>Длительность</CardLabel>
                  <CardValue>
                    До {new Date(item.end_at).toLocaleDateString()}
                  </CardValue>

                  <CardLabel>Участники</CardLabel>
                  <CardValue>{item.participants_count} человек</CardValue>

                  {item.has_goal && (
                    <ProgressWrapper>
                      <ProgressBar>
                        <ProgressFill style={{ width: `${progress}%` }} />
                      </ProgressBar>
                      <ProgressText>
                        {item.user_progress ?? 0} / {item.goal_value}
                      </ProgressText>
                    </ProgressWrapper>
                  )}

                  {!item.challenge_finished && (
                    <PrimaryButton>Перейти к отчёту</PrimaryButton>
                  )}
                </Card>
              );
            })
          )}
        </CenterWrapper>
      </HomeContainer>

      {/* BOTTOM NAV */}
      <BottomNav>
        <NavItem $active>
          <svg width="24" height="24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>

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

        <NavItem>
          <svg width="24" height="24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round">
            <line x1="6" y1="18" x2="6" y2="14" />
            <line x1="12" y1="18" x2="12" y2="10" />
            <line x1="18" y1="18" x2="18" y2="6" />
          </svg>
        </NavItem>

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
