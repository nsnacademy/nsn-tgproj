import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
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
  SkeletonCard,
  SkeletonLine,
  SkeletonBadge,
  SkeletonStats,
  SkeletonProgress,
} from './styles';

type Screen = 'home' | 'create' | 'challenge-progress' | 'profile';

type HomeProps = {
  screen: Screen;
  onNavigate: (screen: Screen, challengeId?: string, participantId?: string) => void;
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

// Кэш для данных home
const homeCache = new Map<
  string,
  { data: ChallengeItem[]; timestamp: number; tab: 'active' | 'completed' }
>();
const CACHE_TTL = 2 * 60 * 1000; // 2 минуты

// Скелетон компонент
const HomeSkeleton = () => (
  <>
    {[1, 2, 3].map((i) => (
      <SkeletonCard key={i}>
        <CardHeader>
          <CardTitleRow>
            <SkeletonLine width="60%" height={20} />
            <SkeletonBadge width={40} height={24} />
          </CardTitleRow>
          <SkeletonLine width="40%" height={16} style={{ marginTop: 8 }} />
        </CardHeader>

        <SkeletonStats>
          <StatItem>
            <SkeletonLine width="30px" height={24} />
            <SkeletonLine width="50px" height={12} style={{ marginTop: 4 }} />
          </StatItem>
          <StatItem>
            <SkeletonLine width="30px" height={24} />
            <SkeletonLine width="50px" height={12} style={{ marginTop: 4 }} />
          </StatItem>
          <StatItem>
            <SkeletonLine width="60px" height={24} />
            <SkeletonLine width="40px" height={12} style={{ marginTop: 4 }} />
          </StatItem>
        </SkeletonStats>

        <SkeletonProgress>
          <ProgressInfo>
            <SkeletonLine width="70%" height={14} />
            <SkeletonLine width="40px" height={14} />
          </ProgressInfo>
          <SkeletonLine width="100%" height={6} style={{ margin: '12px 0' }} />
          <SkeletonLine width="40%" height={12} />
        </SkeletonProgress>

        <SkeletonLine width="100%" height={48} style={{ marginTop: 16, borderRadius: 30 }} />
      </SkeletonCard>
    ))}
  </>
);

export function Home({ screen, onNavigate, refreshKey }: HomeProps) {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ChallengeItem[]>([]);
  const [tgUser, setTgUser] = useState<any>(null);
  const mountedRef = useRef(true);
  const loadingRef = useRef(false);

  // Получаем Telegram user один раз
  useEffect(() => {
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
    setTgUser(user);
  }, []);

  // Мемоизация отфильтрованных списков
  const active = useMemo(() => items.filter((i) => !i.challenge_finished), [items]);
  const completed = useMemo(() => items.filter((i) => i.challenge_finished), [items]);
  const list = useMemo(() => (tab === 'active' ? active : completed), [tab, active, completed]);

  // Функция расчета дней (мемоизирована)
  const calculateDayInfo = useCallback((item: ChallengeItem) => {
    const start = new Date(item.start_at);
    const today = new Date();

    const startUTC = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
    const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

    const diffDays = Math.floor((todayUTC - startUTC) / (1000 * 60 * 60 * 24));

    let currentDay;
    if (diffDays < 0) {
      currentDay = 1;
    } else {
      currentDay = Math.min(item.duration_days, diffDays + 1);
    }

    const progressValue = Number(item.user_progress ?? 0);
    const goalValue = Number(item.goal_value ?? 0);

    const progressPercent = item.has_goal && goalValue > 0
      ? Math.min(100, Math.round((progressValue / goalValue) * 100))
      : Math.min(100, Math.round((progressValue / item.duration_days) * 100));

    return { diffDays, currentDay, progressPercent };
  }, []);

  // Функция загрузки данных
  const loadData = useCallback(async (force = false) => {
    if (!tgUser || loadingRef.current) return;

    const cacheKey = `home_${tgUser.id}`;
    
    // Проверка кэша (если не force)
    if (!force) {
      const cached = homeCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setItems(cached.data);
        setLoading(false);
        return;
      }
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      // Получаем пользователя из БД
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', tgUser.id)
        .single();

      if (userError || !user) {
        setItems([]);
        return;
      }

      // Автозавершение просроченных вызовов
      await supabase.rpc('finish_expired_challenges');

      // Получаем данные
      const { data, error } = await supabase.rpc('get_home_challenges', {
        p_user_id: user.id,
      });

      if (error) {
        console.error('[HOME] rpc error', error);
        setItems([]);
        return;
      }

      // Сохраняем в кэш
      homeCache.set(cacheKey, {
        data: data ?? [],
        timestamp: Date.now(),
        tab,
      });

      if (mountedRef.current) {
        setItems(data ?? []);
      }
    } catch (error) {
      console.error('[HOME] error', error);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      loadingRef.current = false;
    }
  }, [tgUser, tab]);

  // Загрузка при монтировании и изменении refreshKey
  useEffect(() => {
    mountedRef.current = true;
    
    if (screen === 'home' && tgUser) {
      loadData();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [screen, refreshKey, tgUser, loadData]);

  // Предзагрузка данных для неактивной вкладки
  useEffect(() => {
    if (screen === 'home' && items.length === 0 && tgUser) {
      // Тихо грузим в фоне
      loadData();
    }
  }, [screen, items.length, tgUser, loadData]);

  // Pull-to-refresh (опционально)
  useEffect(() => {
    let touchStart = 0;
    let touchEnd = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.targetTouches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEnd = e.targetTouches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (touchStart - touchEnd > 150 && window.scrollY === 0) {
        // Свайп вниз для обновления
        loadData(true);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [loadData]);

  const handleTabChange = useCallback((newTab: 'active' | 'completed') => {
    setTab(newTab);
  }, []);

  // Исправленная функция handleCardClick - убрали неиспользуемый параметр finished
  const handleCardClick = useCallback(
    (challengeId: string, participantId: string) => {
      onNavigate('challenge-progress', challengeId, participantId);
    },
    [onNavigate]
  );

  return (
    <SafeArea>
      <FixedHeaderWrapper>
        <HeaderSpacer />
        <Header>
          <StatusLabel>Состояние</StatusLabel>
          <StatusTitle>
            {loading
              ? 'Загрузка...'
              : tab === 'active'
              ? active.length === 0
                ? 'Нет активных вызовов'
                : `Активные вызовы (${active.length})`
              : completed.length === 0
              ? 'Нет завершённых вызовов'
              : `Завершённые вызовы (${completed.length})`}
          </StatusTitle>
        </Header>

        <Tabs>
          <Tab $active={tab === 'active'} onClick={() => handleTabChange('active')}>
            Активные {!loading && active.length > 0 && `(${active.length})`}
          </Tab>
          <Tab $active={tab === 'completed'} onClick={() => handleTabChange('completed')}>
            Завершённые {!loading && completed.length > 0 && `(${completed.length})`}
          </Tab>
        </Tabs>
      </FixedHeaderWrapper>

      <HeaderOffset />

      <HomeContainer>
        <CenterWrapper>
          {loading ? (
            <HomeSkeleton />
          ) : list.length === 0 ? (
            <EmptyText>
              {tab === 'active'
                ? 'У вас пока нет активных вызовов'
                : 'Завершённых вызовов пока нет'}
            </EmptyText>
          ) : (
            list.map((item) => {
              const { diffDays, currentDay, progressPercent } = calculateDayInfo(item);

              const getStatusText = () => {
                if (item.challenge_finished) {
                  return item.user_completed ? 'Успешно завершён' : 'Завершён';
                }
                if (diffDays < 0) return 'Скоро начнётся';
                if (progressPercent >= 100) return 'Выполняется';
                return 'В процессе';
              };

              const isDisabled = diffDays < 0;

              return (
                <Card key={item.participant_id}>
                  <CardHeader>
                    <CardTitleRow>
                      <CardTitle>{item.title}</CardTitle>
                      {typeof item.rating_place === 'number' && item.rating_place <= 3 && (
                        <StatusBadge $place={item.rating_place}>#{item.rating_place}</StatusBadge>
                      )}
                    </CardTitleRow>

                    <ChallengeTypeBadge>
                      {item.has_goal ? 'Специальная цель' : 'Ежедневный вызов'}
                    </ChallengeTypeBadge>
                  </CardHeader>

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
                      <StatValue>{item.challenge_finished ? 'Завершён' : getStatusText()}</StatValue>
                      <StatLabel>статус</StatLabel>
                    </StatItem>
                  </CardStats>

                  <ProgressWrapper>
                    <ProgressHeader>
                      <ProgressInfo>
                        <ProgressText>
                          {item.has_goal
                            ? `Прогресс: ${item.user_progress ?? 0} из ${item.goal_value ?? 0}`
                            : `Выполнено: ${item.user_progress ?? 0} из ${item.duration_days} дней`}
                        </ProgressText>
                        <ProgressText $highlight>{progressPercent}%</ProgressText>
                      </ProgressInfo>

                      <ProgressBar>
                        <ProgressFill
                          style={{
                            width: `${progressPercent}%`,
                            opacity: item.challenge_finished ? 0.7 : 1,
                          }}
                        />
                      </ProgressBar>

                      <DaysInfo>
                        {diffDays < 0 ? (
                          <>Старт {new Date(item.start_at).toLocaleDateString('ru-RU')}</>
                        ) : (
                          <>
                            День {currentDay} из {item.duration_days}
                          </>
                        )}
                        {item.challenge_finished && (
                          <span style={{ marginLeft: '8px', opacity: 0.7 }}>
                            • {item.user_completed ? '✓' : '✗'}
                          </span>
                        )}
                      </DaysInfo>
                    </ProgressHeader>
                  </ProgressWrapper>

                  {!item.challenge_finished ? (
                    <PrimaryButton
                      onClick={() => handleCardClick(item.challenge_id, item.participant_id)}
                      disabled={isDisabled}
                      style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      {isDisabled
                        ? 'Доступно с ' + new Date(item.start_at).toLocaleDateString('ru-RU')
                        : progressPercent >= 100
                        ? 'Посмотреть результат'
                        : 'Продолжить вызов'}
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      onClick={() => handleCardClick(item.challenge_id, item.participant_id)}
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

        <NavItem $active={false} onClick={() => {}}>
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