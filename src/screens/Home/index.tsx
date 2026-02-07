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
  List,
  EmptyText,
  BottomNav,
  NavItem,
  Card,
  CardContent,
  CardTitleRow,
  CardTitle,
  CardRank,
  Details,
  Detail,
  DetailLabel,
  DetailValue,
  ProgressWrapper,
  ProgressHeader,
  ProgressLabel,
  ProgressPercentage,
  ProgressBar,
  ProgressFill,
  Participants,
  Avatars,
  Avatar,
  ParticipantsCount,
  PrimaryButton,
  FadeTop,
  FadeBottom,
  StatusBar,
  Time,
  StatusIcons,
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

// Генерация случайных цветов для прогресса
const generateColors = (): string => {
  const colors = [
    '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
    '#00BCD4', '#3F51B5', '#8BC34A', '#FF5722', '#673AB7'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Генерация аватаров
const generateAvatars = (count: number): Array<{ color: string; letter: string }> => {
  const avatars = [];
  const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];
  
  for (let i = 0; i < count; i++) {
    const color = colors[i % colors.length];
    const letter = String.fromCharCode(65 + i);
    avatars.push({ color, letter });
  }
  
  return avatars;
};

export function Home({ onNavigate, refreshKey }: HomeProps) {
  const [tab, setTab] = useState<'active' | 'completed' | 'popular'>('active');
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<ChallengeItem[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const listRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Обновление времени
  const updateTime = (): void => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    setCurrentTime(timeString);
  };

  async function load(): Promise<void> {
    console.log('[HOME] load() start');
    setLoading(true);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    console.log('[HOME] tgUser', tgUser);
    if (!tgUser) {
      setItems([]);
      setLoading(false);
      return;
    }

    // 1. USER
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .single();

    console.log('[HOME] user from db', user, userError);

    if (userError || !user) {
      setItems([]);
      setLoading(false);
      return;
    }

    // 2. PARTICIPANTS + CHALLENGES
    const { data, error } = await supabase
      .from('participants')
      .select(`
        id,
        challenge:challenge_id (
          id,
          title,
          is_finished,
          created_at,
          description
        )
      `)
      .eq('user_id', user.id);
    
    console.log('[HOME] participants raw', data, error);

    if (error || !data) {
      setItems([]);
      setLoading(false);
      return;
    }

    // 3. НОРМАЛИЗАЦИЯ
    const normalized: ChallengeItem[] = data
      .filter((p: any) => p.challenge)
      .map((p: any) => ({
        participant_id: p.id,
        challenge_id: p.challenge.id,
        title: p.challenge.title,
        is_finished: p.challenge.is_finished,
      }));

    console.log('[HOME] normalized items', normalized);

    setItems(normalized);
    setLoading(false);
  }

  useEffect(() => {
    console.log('[HOME] useEffect refreshKey', refreshKey);
    load();
    updateTime();
    
    // Обновление времени каждую минуту
    const timeInterval = setInterval(updateTime, 60000);
    
    return () => {
      clearInterval(timeInterval);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [refreshKey]);

  // Эффект фокуса при скролле
  useEffect(() => {
    const updateCardStyles = (): void => {
      if (!listRef.current) return;
      
      const cards = listRef.current.querySelectorAll('.card');
      if (cards.length === 0) return;

      const center = listRef.current.scrollTop + listRef.current.clientHeight / 2;

      cards.forEach((card: Element) => {
        const cardElement = card as HTMLElement;
        const cardCenter = cardElement.offsetTop + cardElement.offsetHeight / 2;
        const distance = Math.abs(cardCenter - center);
        const maxDistance = listRef.current!.clientHeight / 2;
        
        const ratio = Math.min(distance / maxDistance, 1);
        
        // Scale effect
        const scale = 1 - ratio * 0.05;
        cardElement.style.transform = `scale(${scale})`;
        
        // Opacity effect
        const opacity = 1 - ratio * 0.3;
        cardElement.style.opacity = opacity.toString();
        
        // Border effect for focused card
        if (ratio < 0.1) {
          cardElement.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          cardElement.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        } else {
          cardElement.style.borderColor = 'rgba(255, 255, 255, 0.05)';
          cardElement.style.boxShadow = 'none';
        }
      });
    };

    const handleScroll = (): void => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      
      scrollTimerRef.current = setTimeout(() => {
        requestAnimationFrame(updateCardStyles);
      }, 10);
    };

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
      
      // Initial update
      setTimeout(() => updateCardStyles(), 100);
      
      return () => {
        listElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [items]);

  const active = items.filter((i) => !i.is_finished);
  const completed = items.filter((i) => i.is_finished);
  const popular = [...active, ...completed]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(5, active.length + completed.length));

  const list = tab === 'active' ? active : tab === 'completed' ? completed : popular;

  // Статистика для карточек (заглушка, можно заменить реальными данными)
  const getChallengeStats = (index: number) => {
    const durations = [14, 21, 30, 7, 14, 21, 30, 14];
    const currentDays = [7, 14, 22, 3, 5, 18, 11, 9];
    const participants = [142, 89, 256, 78, 203, 167, 94, 312];
    const ranks = [5, 3, 1, 8, 2, 4, 7, 1];
    
    const i = index % 8;
    const progress = (currentDays[i] / durations[i]) * 100;
    
    return {
      duration: durations[i],
      currentDay: currentDays[i],
      participants: participants[i],
      rank: ranks[i],
      progress: Math.round(progress),
      color: generateColors(),
    };
  };

  const avatars = generateAvatars(3);

  return (
    <SafeArea>
      <StatusBar>
        <Time>{currentTime}</Time>
        <StatusIcons>
          <span>📶</span>
          <span>📡</span>
          <span>🔋</span>
        </StatusIcons>
      </StatusBar>

      <HomeContainer>
        {/* HEADER */}
        <Header>
          <StatusLabel>Состояние</StatusLabel>
          <StatusTitle>
            {tab === 'active'
              ? active.length === 0
                ? 'Нет активных вызовов'
                : 'Активные вызовы'
              : tab === 'completed'
              ? completed.length === 0
                ? 'Нет завершённых вызовов'
                : 'Завершённые вызовы'
              : 'Популярные вызовы'}
          </StatusTitle>
        </Header>

        {/* TABS */}
        <Tabs>
          <Tab $active={tab === 'active'} onClick={() => setTab('active')}>
            Активные
          </Tab>
          <Tab $active={tab === 'completed'} onClick={() => setTab('completed')}>
            Завершённые
          </Tab>
          <Tab $active={tab === 'popular'} onClick={() => setTab('popular')}>
            Популярные
          </Tab>
        </Tabs>

        {/* CONTENT */}
        <CenterWrapper>
          <FadeTop />
          
          <List ref={listRef}>
            {loading ? (
              <EmptyText>Загрузка…</EmptyText>
            ) : list.length === 0 ? (
              <EmptyText>
                {tab === 'active' ? (
                  <>
                    Создайте новый вызов или
                    <br />
                    присоединитесь к существующему
                  </>
                ) : tab === 'completed' ? (
                  <>
                    У вас пока нет
                    <br />
                    завершённых вызовов
                  </>
                ) : (
                  <>
                    Популярные вызовы
                    <br />
                    появятся здесь
                  </>
                )}
              </EmptyText>
            ) : (
              list.map((item, index) => {
                const stats = getChallengeStats(index);
                return (
                  <Card key={item.participant_id} className="card">
                    <CardContent>
                      {/* TITLE + RANK */}
                      <CardTitleRow>
                        <CardTitle>{item.title}</CardTitle>
                        <CardRank>#{stats.rank}</CardRank>
                      </CardTitleRow>

                      {/* DETAILS */}
                      <Details>
                        <Detail>
                          <DetailLabel>Длительность</DetailLabel>
                          <DetailValue>{stats.duration} дней</DetailValue>
                        </Detail>
                        <Detail>
                          <DetailLabel>Прогресс</DetailLabel>
                          <DetailValue>{stats.currentDay}/{stats.duration} дней</DetailValue>
                        </Detail>
                        <Detail>
                          <DetailLabel>Участники</DetailLabel>
                          <DetailValue>{stats.participants}</DetailValue>
                        </Detail>
                        <Detail>
                          <DetailLabel>Статус</DetailLabel>
                          <DetailValue>{item.is_finished ? '✅' : '⏳'}</DetailValue>
                        </Detail>
                      </Details>

                      {/* PROGRESS */}
                      <ProgressWrapper>
                        <ProgressHeader>
                          <ProgressLabel>Прогресс</ProgressLabel>
                          <ProgressPercentage>{stats.progress}%</ProgressPercentage>
                        </ProgressHeader>
                        <ProgressBar>
                          <ProgressFill 
                            style={{ 
                              width: `${stats.progress}%`,
                              background: stats.color 
                            }} 
                          />
                        </ProgressBar>
                        
                        {/* PARTICIPANTS AVATARS */}
                        <Participants>
                          <Avatars>
                            {avatars.map((avatar, idx) => (
                              <Avatar 
                                key={idx} 
                                style={{ 
                                  background: avatar.color,
                                  zIndex: avatars.length - idx
                                }}
                              >
                                {avatar.letter}
                              </Avatar>
                            ))}
                          </Avatars>
                          <ParticipantsCount>
                            +{stats.participants - 3} участников
                          </ParticipantsCount>
                        </Participants>
                      </ProgressWrapper>

                      {/* ACTION */}
                      {!item.is_finished && (
                        <PrimaryButton
                          onClick={() => {
                            console.log('go to report', item.participant_id);
                          }}
                        >
                          Перейти к отчёту
                        </PrimaryButton>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </List>
          
          <FadeBottom />
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