import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  TopBar,
  SearchField,
  SearchInput,
  ClearButton,
  ActionButton,
  BottomNav,
  NavItem,

  /* 👇 НОВОЕ */
  List,
  Card,
  CardTitle,
  CardMeta,
  CardFooter,
  Status,
} from './styles';

/* 👇 ОБНОВЛЁННЫЙ ТИП НАВИГАЦИИ */
type CreateProps = {
  onNavigate: (screen: 'home' | 'create' | 'create-flow') => void;
};

type Challenge = {
  id: string;
  title: string;
  report_mode: 'simple' | 'result';
  duration_days: number;
  start_date: string | null;
  username: string;
};

export function Create({ onNavigate }: CreateProps) {
  const [query, setQuery] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  /* === DEBOUNCE ПОИСКА === */
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);

    return () => clearTimeout(id);
  }, [query]);

  /* === LOAD CHALLENGES === */
  useEffect(() => {
    async function loadChallenges() {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          id,
          title,
          report_mode,
          duration_days,
          start_date,
          users (
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setChallenges(
          data.map((c: any) => ({
            id: c.id,
            title: c.title,
            report_mode: c.report_mode,
            duration_days: c.duration_days,
            start_date: c.start_date,
            username: c.users?.username ?? 'unknown',
          }))
        );
      }
    }

    loadChallenges();
  }, []);

  const filtered = challenges.filter((c) =>
    c.title.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <SafeArea>
      {/* === TOP BAR === */}
      <TopBar>
        <SearchField $active={keyboardOpen || query.length > 0}>
          {/* SEARCH ICON */}
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="8" r="6" />
            <line x1="13" y1="13" x2="17" y2="17" />
          </svg>

          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск вызовов"
            onFocus={() => setKeyboardOpen(true)}
            onBlur={() => setKeyboardOpen(false)}
          />

          {query.length > 0 && (
            <ClearButton
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setQuery('')}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="3" x2="11" y2="11" />
                <line x1="11" y1="3" x2="3" y2="11" />
              </svg>
            </ClearButton>
          )}
        </SearchField>

        <ActionButton onClick={() => onNavigate('create-flow')}>
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="11" y1="4" x2="11" y2="18" />
            <line x1="4" y1="11" x2="18" y2="11" />
          </svg>
        </ActionButton>
      </TopBar>

      {/* === CHALLENGES LIST === */}
      <List>
        {filtered.map((c) => {
          const status = getStatus(c.start_date, c.duration_days);

          return (
            <Card key={c.id} onClick={() => console.log('OPEN', c.id)}>
              <CardTitle>{c.title}</CardTitle>

              <CardMeta>
                <span>@{c.username}</span>
                <span>
                  {c.report_mode === 'simple'
                    ? 'Отметка'
                    : 'Результат'}
                </span>
              </CardMeta>

              <CardFooter>
                <span>{c.duration_days} дней</span>
                <Status>{status}</Status>
              </CardFooter>
            </Card>
          );
        })}
      </List>

      {/* === BOTTOM NAV === */}
      <BottomNav $hidden={keyboardOpen}>
        <NavItem onClick={() => onNavigate('home')}>
          {/* home icon */}
        </NavItem>

        <NavItem $active>
          {/* create icon */}
        </NavItem>

        <NavItem>{/* signal */}</NavItem>
        <NavItem>{/* profile */}</NavItem>
      </BottomNav>
    </SafeArea>
  );
}

/* === STATUS LOGIC === */
function getStatus(startDate: string | null, duration: number) {
  const now = new Date();
  const start = startDate ? new Date(startDate) : now;
  const end = new Date(start);
  end.setDate(end.getDate() + duration);

  if (now < start) return 'Скоро';
  if (now > end) return 'Завершён';
  return 'Идёт';
}
