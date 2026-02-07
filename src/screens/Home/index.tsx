import { useEffect, useState } from 'react';
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
  Row,
} from './styles';

type HomeProps = {
  onNavigate: (screen: 'home' | 'create') => void;
};

type ChallengeItem = {
  participant_id: string;
  challenge_id: string;
  title: string;
  is_finished: boolean;
};

export function Home({ onNavigate }: HomeProps) {
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

    // 1. USER
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .single();

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
          is_finished
        )
      `)
      .eq('user_id', user.id);

    if (error || !data) {
      setItems([]);
      setLoading(false);
      return;
    }

    // 3. НОРМАЛИЗАЦИЯ
    const normalized: ChallengeItem[] = data
      .filter((p: any) => p.challenge) // ⬅️ КРИТИЧНО
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
}, []);


  const active = items.filter((i) => !i.is_finished);
  const completed = items.filter((i) => i.is_finished);

  const list = tab === 'active' ? active : completed;

  return (
    <SafeArea>
      <HomeContainer>
        {/* HEADER */}
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

        {/* TABS */}
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

        {/* CONTENT */}
        <CenterWrapper>
          {loading ? (
            <EmptyText>Загрузка…</EmptyText>
          ) : list.length === 0 ? (
            tab === 'active' ? (
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
            )
          ) : (
            list.map((item) => (
              <Card key={item.participant_id}>
                <Row><b>{item.title}</b></Row>
                <Row>
                  Статус: {item.is_finished ? 'Завершён' : 'Идёт'}
                </Row>

                {!item.is_finished && (
                  <Row>
                    <button>Отметить выполнение</button>
                  </Row>
                )}
              </Card>
            ))
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
