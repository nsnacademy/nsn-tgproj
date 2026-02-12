import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { BottomNav, NavItem } from '../Home/styles';

import {
  SafeArea,
  FixedTop,
  TopBar,
  TopOffset,
  ScrollContainer,
  SearchField,
  SearchInput,
  ClearButton,
  ActionButton,
  List,
  Card,
  CardHeader,
  CardTitle,
  CardMeta,
  CardRow,
  Status,
  MoreButton,
} from './styles';

/* =========================
   TYPES
========================= */

export type Screen =
  | 'home'
  | 'create'
  | 'profile'
  | 'challenge-details'
  | 'create-flow';

type CreateProps = {
  screen: Screen;
  onNavigate: (screen: Screen, id?: string) => void;
};

type ChallengeFromDB = {
  id: string;
  title: string;
  report_mode: 'simple' | 'result';
  duration_days: number;
  start_mode: 'now' | 'date';
  start_date: string | null;
  users: { username: string }[] | null;
};

type Challenge = {
  id: string;
  title: string;
  username: string;
  reportType: string;
  duration: number;
  status: 'Идёт' | 'Скоро';
  searchText: string; // 👈 добавлено
};

/* =========================
   DEBOUNCE
========================= */

function useDebounce<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/* =========================
   COMPONENT
========================= */

export function Create({ screen, onNavigate }: CreateProps) {
  const [query, setQuery] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        id,
        title,
        report_mode,
        duration_days,
        start_mode,
        start_date,
        users ( username )
      `);

    if (!data || error) return;

    const mapped: Challenge[] = data.map((c: ChallengeFromDB) => {
      const isFuture =
        c.start_mode === 'date' &&
        c.start_date &&
        new Date(c.start_date) > new Date();

      const reportLabel =
        c.report_mode === 'simple' ? 'отметка' : 'результат';

      const searchText = `
        ${c.title}
        ${reportLabel}
        ${c.duration_days} дней
      `.toLowerCase();

      return {
        id: c.id,
        title: c.title,
        username: c.users?.[0]?.username ?? 'unknown',
        reportType: reportLabel,
        duration: c.duration_days,
        status: isFuture ? 'Скоро' : 'Идёт',
        searchText,
      };
    });

    setChallenges(mapped);
  }

  /* =========================
     FILTER (KEYWORDS)
  ========================= */

  const words = debouncedQuery
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const filtered =
    words.length === 0
      ? challenges
      : challenges.filter(c =>
          words.every(word => c.searchText.includes(word))
        );

  /* =========================
     RENDER
  ========================= */

  return (
    <SafeArea>
      {/* FIXED TOP */}
      <FixedTop>
        <TopBar>
          <SearchField $active={keyboardOpen || query.length > 0}>
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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

            {query && (
              <ClearButton onClick={() => setQuery('')}>
                ✕
              </ClearButton>
            )}
          </SearchField>

          <ActionButton onClick={() => onNavigate('create-flow')}>
            +
          </ActionButton>
        </TopBar>
      </FixedTop>

      <TopOffset />

      {/* SCROLL */}
      <ScrollContainer>
        <List>
          {filtered.map(c => (
            <Card key={c.id}>
              <CardHeader>
                <div>
                  <CardTitle>{c.title}</CardTitle>
                  <CardMeta>
                    @{c.username} · {c.reportType}
                  </CardMeta>
                </div>
                <Status>{c.status}</Status>
              </CardHeader>

              <CardRow>
                Длительность: {c.duration} дней
              </CardRow>

              <MoreButton
                onClick={() =>
                  onNavigate('challenge-details', c.id)
                }
              >
                Подробнее
              </MoreButton>
            </Card>
          ))}
        </List>
      </ScrollContainer>

      {/* BOTTOM NAV */}
      <BottomNav>
        <NavItem
          $active={screen === 'home'}
          onClick={() => onNavigate('home')}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>

        <NavItem
          $active={screen === 'create' || screen === 'create-flow'}
          onClick={() => onNavigate('create')}
        >
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

        <NavItem
          $active={screen === 'profile'}
          onClick={() => onNavigate('profile')}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}
