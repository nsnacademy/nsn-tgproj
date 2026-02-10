import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  FixedHeaderWrapper,
  HeaderSpacer,
  Header,
  StatusLabel,
  StatusTitle,
  Tabs,
  Tab,
  HeaderOffset,
  HomeContainer,
  CenterWrapper,
  EmptyText,
  Card,
  CardTitleRow,
  CardTitle,
  ProgressWrapper,
  ProgressBar,
  ProgressFill,
  ProgressText,
  PrimaryButton,
  BottomNav,
  NavItem,
} from './styles';

type HomeProps = {
  onNavigate: (
    screen: 'home' | 'create' | 'challenge-progress',
    challengeId?: string,
    participantId?: string
  ) => void;
  refreshKey: number;
};

type ChallengeItem = {
  participant_id: string;
  challenge_id: string;

  title: string;
  start_at: string;
  end_at: string | null;
  duration_days: number;

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

  async function load() {
    console.log('=== HOME LOAD START ===');
    setLoading(true);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      console.warn('[HOME] no tgUser');
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
      console.warn('[HOME] no user in db');
      setItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc('get_home_challenges', {
      p_user_id: user.id,
    });

    if (error) {
      console.error('[HOME] rpc error', error);
      setItems([]);
      setLoading(false);
      return;
    }

    console.log('[HOME] raw rpc data', data);
    setItems(data ?? []);
    setLoading(false);
    console.log('=== HOME LOAD END ===');
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  const active = items.filter(i => !i.challenge_finished);
  const completed = items.filter(i => i.challenge_finished);
  const list = tab === 'active' ? active : completed;

  return (
    <SafeArea>
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
          <Tab $active={tab === 'completed'} onClick={() => setTab('completed')}>
            Завершённые
          </Tab>
        </Tabs>
      </FixedHeaderWrapper>

      <HeaderOffset />

      <HomeContainer>
        <CenterWrapper>
          {loading ? (
            <EmptyText>Загрузка…</EmptyText>
          ) : list.length === 0 ? (
            <EmptyText>Нет вызовов</EmptyText>
          ) : (
            list.map(item => {
              const progressValue = Number(item.user_progress ?? 0);
              const goalValue = Number(item.goal_value ?? 0);

              const start = new Date(item.start_at);
              const today = new Date();

              const currentDay = Math.min(
                item.duration_days,
                Math.max(
                  1,
                  Math.floor(
                    (today.getTime() - start.getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1
                )
              );

              let progressPercent = 0;
              let progressLabel = '';

              if (item.has_goal && goalValue > 0) {
                // RESULT MODE
                progressPercent = Math.min(
                  100,
                  Math.round((progressValue / goalValue) * 100)
                );
                progressLabel = `${progressValue} / ${goalValue}`;
              } else {
                // SIMPLE MODE
                progressPercent = Math.min(
                  100,
                  Math.round(
                    (progressValue / item.duration_days) * 100
                  )
                );
                progressLabel = `Выполнено: ${progressValue}`;
              }

              console.log('[HOME] progress normalized', {
                title: item.title,
                has_goal: item.has_goal,
                progressValue,
                goalValue,
                progressPercent,
                currentDay,
              });

              return (
                <Card key={item.participant_id}>
                  <CardTitleRow>
                    <CardTitle>{item.title}</CardTitle>
                  </CardTitleRow>

                  <ProgressWrapper>
                    <ProgressBar>
                      <ProgressFill
                        style={{ width: `${progressPercent}%` }}
                      />
                    </ProgressBar>

                    <ProgressText>{progressLabel}</ProgressText>

                    <ProgressText style={{ opacity: 0.45 }}>
                      День {currentDay} из {item.duration_days}
                    </ProgressText>
                  </ProgressWrapper>

                  {!item.challenge_finished && (
                    <PrimaryButton
                      onClick={() =>
                        onNavigate(
                          'challenge-progress',
                          item.challenge_id,
                          item.participant_id
                        )
                      }
                    >
                      Перейти к отчёту
                    </PrimaryButton>
                  )}
                </Card>
              );
            })
          )}
        </CenterWrapper>
      </HomeContainer>

      <BottomNav>
        <NavItem $active>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>

        <NavItem onClick={() => onNavigate('create')}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </NavItem>

        <NavItem>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="18" x2="6" y2="14" />
            <line x1="12" y1="18" x2="12" y2="10" />
            <line x1="18" y1="18" x2="18" y2="6" />
          </svg>
        </NavItem>

        <NavItem>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}
