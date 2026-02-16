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
  CardHeader,
  CardTitleRow,
  CardTitle,
  CardStats,
  StatItem,
  StatValue,
  StatLabel,
  ProgressWrapper,
  ProgressHeader,
  ProgressInfo,
  ProgressBar,
  ProgressFill,
  ProgressText,
  DaysInfo,
  PrimaryButton,
  BottomNav,
  NavItem,
  StatusBadge,
  ChallengeTypeBadge,
} from './styles';

type Screen =
  | 'home'
  | 'create'
  | 'challenge-progress'
  | 'profile';

type HomeProps = {
  screen: Screen;
  onNavigate: (
    screen: Screen,
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

  rating_place?: number | null;
};

export function Home({ screen, onNavigate, refreshKey }: HomeProps) {

  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ChallengeItem[]>([]);

  async function load() {
    console.log('[HOME] load called');

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

/* 🔥 ВАЖНО: автозавершение просроченных вызовов */
await supabase.rpc('finish_expired_challenges');

/* 🔥 теперь грузим Home */
const { data, error } = await supabase.rpc('get_home_challenges', {
  p_user_id: user.id,
});


    if (error) {
      console.error('[HOME] rpc error', error);
      setItems([]);
      setLoading(false);
      return;
    }

    console.log('[HOME] items from rpc', data);
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
  if (screen === 'home') {
    load();
  }
}, [screen, refreshKey]);


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
                : `Активные вызовы (${active.length})`
              : completed.length === 0
              ? 'Нет завершённых вызовов'
              : `Завершённые вызовы (${completed.length})`}
          </StatusTitle>
        </Header>

        <Tabs>
          <Tab $active={tab === 'active'} onClick={() => setTab('active')}>
            Активные {active.length > 0 && `(${active.length})`}
          </Tab>
          <Tab $active={tab === 'completed'} onClick={() => setTab('completed')}>
            Завершённые {completed.length > 0 && `(${completed.length})`}
          </Tab>
        </Tabs>
      </FixedHeaderWrapper>

      <HeaderOffset />

      <HomeContainer>
        <CenterWrapper>
          {loading ? (
            <EmptyText>Загрузка…</EmptyText>
          ) : list.length === 0 ? (
            <EmptyText>
              {tab === 'active'
                ? 'У вас пока нет активных вызовов'
                : 'Завершённых вызовов пока нет'}
            </EmptyText>
          ) : (
            list.map(item => {
              const progressValue = Number(item.user_progress ?? 0);
              const goalValue = Number(item.goal_value ?? 0);

              const start = new Date(item.start_at);
              const today = new Date();
              start.setHours(0, 0, 0, 0);
              today.setHours(0, 0, 0, 0);

              const diffDays = Math.floor(
                (today.getTime() - start.getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              const currentDay = Math.min(
                item.duration_days,
                Math.max(1, diffDays + 1)
              );

              // 🔥 ЕДИНЫЙ ПРОЦЕНТ
              const progressPercent = item.has_goal && goalValue > 0
                ? Math.min(100, Math.round((progressValue / goalValue) * 100))
                : Math.min(
                    100,
                    Math.round((progressValue / item.duration_days) * 100)
                  );

              // Определяем статус вызова
              const getStatusText = () => {
                if (item.challenge_finished) {
                  return item.user_completed ? 'Успешно завершён' : 'Завершён';
                }
                if (progressPercent >= 100) return 'Выполняется';
                return 'В процессе';
              };

              return (
                <Card key={item.participant_id}>
                  {/* HEADER: TITLE + BADGES */}
                  <CardHeader>
                    <CardTitleRow>
                      <CardTitle>{item.title}</CardTitle>
                      {typeof item.rating_place === 'number' && item.rating_place <= 3 && (
                        <StatusBadge $place={item.rating_place}>
                          #{item.rating_place}
                        </StatusBadge>
                      )}
                    </CardTitleRow>
                    
                    <ChallengeTypeBadge>
                      {item.has_goal ? 'Специальная цель' : 'Ежедневный вызов'}
                    </ChallengeTypeBadge>
                  </CardHeader>

                  {/* STATS */}
                  <CardStats>
                    <StatItem>
                      <StatValue>{item.participants_count}</StatValue>
                      <StatLabel>участников</StatLabel>
                    </StatItem>
                    
                    <StatItem>
                      <StatValue>{item.duration_days}</StatValue>
                      <StatLabel>дней</StatLabel>
                    </StatItem>
                    
                    <StatItem>
                      <StatValue>
                        {item.challenge_finished ? 'Завершён' : getStatusText()}
                      </StatValue>
                      <StatLabel>статус</StatLabel>
                    </StatItem>
                  </CardStats>

                  {/* PROGRESS SECTION */}
                  <ProgressWrapper>
                    <ProgressHeader>
                      <ProgressInfo>
                        <ProgressText>
                          {item.has_goal
                            ? `Прогресс: ${progressValue} из ${goalValue}`
                            : `Выполнено: ${progressValue} из ${item.duration_days} дней`}
                        </ProgressText>
                        <ProgressText $highlight>{progressPercent}%</ProgressText>
                      </ProgressInfo>
                      
                      <ProgressBar>
                        <ProgressFill 
                          style={{ 
                            width: `${progressPercent}%`,
                            opacity: item.challenge_finished ? 0.7 : 1
                          }} 
                        />
                      </ProgressBar>

                      <DaysInfo>
                        День {currentDay} из {item.duration_days}
                        {item.challenge_finished && (
                          <span style={{ marginLeft: '8px', opacity: 0.7 }}>
                            • {item.user_completed ? '✓' : '✗'}
                          </span>
                        )}
                      </DaysInfo>
                    </ProgressHeader>
                  </ProgressWrapper>

                  {/* ACTION BUTTON */}
                  {!item.challenge_finished ? (
                    <PrimaryButton
                      onClick={() =>
                        onNavigate(
                          'challenge-progress',
                          item.challenge_id,
                          item.participant_id
                        )
                      }
                    >
                      {progressPercent >= 100 ? 'Посмотреть результат' : 'Продолжить вызов'}
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      onClick={() =>
                        onNavigate(
                          'challenge-progress',
                          item.challenge_id,
                          item.participant_id
                        )
                      }
                      $variant="outline"
                    >
                      Посмотреть результат
                    </PrimaryButton>
                  )}
                </Card>
              );
            })
          )}
        </CenterWrapper>
      </HomeContainer>

    <BottomNav>
  {/* HOME */}
  <NavItem
    $active={screen === 'home'}
    onClick={() => onNavigate('home')}
  >
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  </NavItem>

  {/* CREATE */}
  <NavItem
    $active={screen === 'create'}
    onClick={() => onNavigate('create')}
  >
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  </NavItem>

  {/* STATS */}
  <NavItem
    $active={false}
    onClick={() => {}}
  >
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </svg>
  </NavItem>
</BottomNav>
    </SafeArea>
  );
}