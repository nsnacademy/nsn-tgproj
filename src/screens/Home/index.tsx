import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  FixedHeaderWrapper,
  HeaderSpacer,
  Header,
  StatusLabel,
  StatusTitle,
  InfoButton,
  ModalOverlay,
  ModalContent,
  ModalClose,
  ModalTitle,
  ModalDescription,
  ModalSection,
  ModalSectionHeader,
  ModalSectionIcon,
  ModalSectionTitle,
  ModalSectionText,
  ModalList,
  ModalListItem,
  ModalFooter,
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
  ParticipantsBadge,
  DayPercentRow,
  DayLabel,
  DayValue,
  PercentValue,
  ProgressBar,
  ProgressFill,
  Divider,
  StatsRow,
  StatItem as StatBlock,
  StatIcon,
  StatContent,
  StatMain,
  StatSub,
  ReportBlock,
  ReportIcon,
  ReportText,
  ReportBadge,
  BottomNav,
  NavItem,
  PrimaryButton,
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

// Текст для модального окна
const INFO_TEXT = {
  title: "nsndsc",
  description: "Платформа для дисциплины и достижения целей через вызовы.",
  
  sections: [
    {
      icon: "○",
      title: "Участие в вызовах",
      text: "Присоединяйтесь к активным вызовам или создавайте свои. Доступны бесплатные, платные и по условию варианты входа."
    },
    {
      icon: "📈",
      title: "Индекс дисциплины",
      text: "Каждый выполненный день приносит вам индекс. Чем больше вызовов в день, тем выше множитель."
    },
    {
      icon: "🔥",
      title: "Система стриков",
      text: "При ежедневном выполнении растет стрик. За достижение 7, 14, 21 и 30 дней начисляются крупные бонусы."
    },
    {
      icon: "🏆",
      title: "Награды создателям",
      text: "Создатели получают бонусы за успешные вызовы: за каждого участника, дошедшего до конца, и за длительность вызова."
    },
    {
      icon: "💬",
      title: "Чат вызова",
      text: "У каждого вызова есть чат, доступный только участникам после вступления."
    }
  ],

  stats: [
    "1 отчет в день — +1.0 индекса",
    "2 отчета в день — +1.5 за каждый",
    "3 отчета в день — +1.7 за каждый",
    "4+ отчета в день — +0.2 за каждый дополнительный"
  ],

  creatorBonus: [
    "Отличный участник (≥80% отчетов): +1.0",
    "Хороший участник (50-79% отчетов): +0.5",
    "Бонус за длительность: от +2 до +25",
    "Бонус за успех вызова: до +15"
  ],

  footer: "Начните свой путь к дисциплине уже сегодня."
};

export function Home({ screen, onNavigate, refreshKey }: HomeProps) {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ChallengeItem[]>([]);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  async function load() {
    console.log('[HOME] load called');

    setLoading(true);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      console.log('[HOME] no tg user');
      setItems([]);
      setLoading(false);
      return;
    }

    console.log('[HOME] tg user:', tgUser);

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .single();

    if (userError) {
      console.log('[HOME] user error:', userError);
    }

    if (!user) {
      console.log('[HOME] no user found');
      setItems([]);
      setLoading(false);
      return;
    }

    console.log('[HOME] found user:', user);

    /* 🔥 ВАЖНО: автозавершение просроченных вызовов */
    console.log('[HOME] calling finish_expired_challenges');
    await supabase.rpc('finish_expired_challenges');

    /* 🔥 теперь грузим Home */
    console.log('[HOME] calling get_home_challenges for user:', user.id);
    const { data, error } = await supabase.rpc('get_home_challenges', {
      p_user_id: user.id,
    });

    if (error) {
      console.error('[HOME] rpc error', error);
      setItems([]);
      setLoading(false);
      return;
    }

    console.log('[HOME] items from rpc:', data);
    console.log('[HOME] number of items:', data?.length || 0);
    
    if (data && data.length > 0) {
      data.forEach((item: ChallengeItem, index: number) => {
        console.log(`[HOME] Item ${index + 1}:`, {
          title: item.title,
          start_at: item.start_at,
          duration_days: item.duration_days,
          challenge_finished: item.challenge_finished,
          user_progress: item.user_progress
        });
      });
    }
    
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (screen === 'home') {
      load();
    }
  }, [screen, refreshKey]);

  // Закрытие модалки по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isInfoOpen) {
        setIsInfoOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isInfoOpen]);

  const active = items.filter(i => !i.challenge_finished);
  const completed = items.filter(i => i.challenge_finished);
  const list = tab === 'active' ? active : completed;

  return (
    <SafeArea>
      <FixedHeaderWrapper>
        <HeaderSpacer />
        <Header>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1px'
          }}>
            <StatusLabel>Состояние</StatusLabel>
            <InfoButton onClick={() => setIsInfoOpen(true)}>?</InfoButton>
          </div>
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
              
              const startUTC = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
              const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
              
              const diffDays = Math.floor((todayUTC - startUTC) / (1000 * 60 * 60 * 24));
              
              let currentDay;
              if (diffDays < 0) {
                currentDay = 1;
              } else {
                currentDay = Math.min(item.duration_days, diffDays + 1);
              }

              const progressPercent = item.has_goal && goalValue > 0
                ? Math.min(100, Math.round((progressValue / goalValue) * 100))
                : Math.min(
                    100,
                    Math.round((progressValue / item.duration_days) * 100)
                  );

              // Для демо используем фиксированные значения как на скриншоте
              // В реальном приложении здесь будут данные из item
              
              return (
                <Card key={item.participant_id}>
                  <CardHeader>
                    <CardTitleRow>
                      <CardTitle>
                        🔥 {item.title}
                      </CardTitle>
                      <ParticipantsBadge>
                        🔥 {item.participants_count} участника
                      </ParticipantsBadge>
                    </CardTitleRow>
                  </CardHeader>

                  {/* День и процент над баром */}
                  <DayPercentRow>
                    <DayLabel>
                      День <DayValue>{currentDay} / {item.duration_days}</DayValue>
                    </DayLabel>
                    <PercentValue>{progressPercent}%</PercentValue>
                  </DayPercentRow>

                  {/* Прогресс бар */}
                  <ProgressBar>
                    <ProgressFill 
                      style={{ 
                        width: `${progressPercent}%`,
                        background: 'linear-gradient(90deg, #a78bfa, #c4b5fd)',
                        boxShadow: '0 0 8px rgba(167,139,250,0.6)'
                      }} 
                    />
                  </ProgressBar>

                  <Divider />

                  {/* Статистика выполнения */}
                  <StatsRow>
                    <StatBlock>
                      <StatIcon $color="#1dbf73">✔</StatIcon>
                      <StatContent>
                        <StatMain>
                          Выполнено: <strong>{progressValue}</strong>
                        </StatMain>
                        <StatSub>из {currentDay}</StatSub>
                      </StatContent>
                    </StatBlock>

                    <StatBlock>
                      <StatIcon $color="#f5b300">⏱</StatIcon>
                      <StatContent>
                        <StatMain>
                          4 на проверке
                        </StatMain>
                      </StatContent>
                    </StatBlock>
                  </StatsRow>

                  <Divider />

                  {/* Отчет сегодня */}
                  <ReportBlock>
                    <ReportIcon>📷</ReportIcon>
                    <ReportText>
                      <strong>Отчет сегодня:</strong> фото + 5.2 км
                      <ReportBadge>
                        <span style={{ color: '#34d399' }}>✔</span> отправлен
                      </ReportBadge>
                    </ReportText>
                  </ReportBlock>

                  {/* Кнопка действия */}
                  {!item.challenge_finished ? (
                    <PrimaryButton
                      onClick={() =>
                        onNavigate(
                          'challenge-progress',
                          item.challenge_id,
                          item.participant_id
                        )
                      }
                      disabled={diffDays < 0}
                      style={diffDays < 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      {diffDays < 0 ? 'Доступно с ' + new Date(item.start_at).toLocaleDateString('ru-RU') : 
                       progressPercent >= 100 ? 'Посмотреть результат' : 'Добавить результат'}
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

      {/* Модальное окно с информацией */}
      <ModalOverlay $isOpen={isInfoOpen} onClick={() => setIsInfoOpen(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalClose onClick={() => setIsInfoOpen(false)}>✕</ModalClose>
          
          <ModalTitle>{INFO_TEXT.title}</ModalTitle>
          <ModalDescription>{INFO_TEXT.description}</ModalDescription>

          {INFO_TEXT.sections.map((section, idx) => (
            <ModalSection key={idx}>
              <ModalSectionHeader>
                <ModalSectionIcon>{section.icon}</ModalSectionIcon>
                <ModalSectionTitle>{section.title}</ModalSectionTitle>
              </ModalSectionHeader>
              <ModalSectionText>{section.text}</ModalSectionText>
            </ModalSection>
          ))}

          <ModalSection>
            <ModalSectionHeader>
              <ModalSectionIcon>⚡</ModalSectionIcon>
              <ModalSectionTitle>Индекс дисциплины</ModalSectionTitle>
            </ModalSectionHeader>
            <ModalList>
              {INFO_TEXT.stats.map((item, idx) => (
                <ModalListItem key={idx}>{item}</ModalListItem>
              ))}
            </ModalList>
          </ModalSection>

          <ModalSection>
            <ModalSectionHeader>
              <ModalSectionIcon>🎯</ModalSectionIcon>
              <ModalSectionTitle>Бонусы создателям</ModalSectionTitle>
            </ModalSectionHeader>
            <ModalList>
              {INFO_TEXT.creatorBonus.map((item, idx) => (
                <ModalListItem key={idx}>{item}</ModalListItem>
              ))}
            </ModalList>
          </ModalSection>

          <ModalFooter>{INFO_TEXT.footer}</ModalFooter>
        </ModalContent>
      </ModalOverlay>

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