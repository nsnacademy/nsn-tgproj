import { useEffect, useState, useCallback, useMemo, useRef, type JSX } from 'react';
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
  SearchIcon,
  ClearButton,
  ActionButton,
  List,
  Card,
  CardHeader,
  CardTitle,
  CardMeta,
  CardContent,
  CardRow,
  CardBadge,
  EntryBadge,
  PriceTag,
  Status,
  StatusBadge,
  MoreButton,
  ConditionButton,
  EmptyState,
  EmptyIcon,
  EmptyText,
  EmptySubtext,
  SkeletonCard,
  SkeletonLine,
  SkeletonBadge,
} from './styles';

/* =========================
   TYPES
========================= */

export type Screen =
  | 'home'
  | 'create'
  | 'profile'
  | 'challenge-details'
  | 'challenge-paid'
  | 'challenge-condition'
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
  creator_username: string | null;
  is_finished: boolean;
  entry_type: 'free' | 'paid' | 'condition';
  entry_price: number | null;
  entry_currency: string | null;
  entry_condition: string | null;
  contact_info: string | null;
  payment_method: string | null;
  payment_description: string | null;
};

type Challenge = {
  id: string;
  title: string;
  username: string;
  reportType: string;
  reportIcon: JSX.Element;
  duration: number;
  status: 'Идёт' | 'Скоро';
  statusIcon: JSX.Element;
  entryType: 'free' | 'paid' | 'condition';
  entryPrice?: number;
  entryCurrency?: string;
  entryCondition?: string;
  contactInfo?: string;
  paymentMethod?: string;
  paymentDescription?: string;
};

// Кэш для данных
const createCache = new Map<string, { data: Challenge[]; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 минуты

// Иконки (мемоизированы)
const reportIcons = {
  simple: (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="7" cy="7" r="6" />
      <path d="M4 7l2 2 3-3" />
    </svg>
  ),
  result: (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="10" height="10" rx="2" />
      <line x1="7" y1="4" x2="7" y2="10" />
      <line x1="4" y1="7" x2="10" y2="7" />
    </svg>
  ),
};

const statusIcons = {
  soon: (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="6" r="5" />
      <path d="M6 3v3l2 2" />
    </svg>
  ),
  active: (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="6" r="5" />
      <path d="M6 3v3l2 2" />
    </svg>
  ),
};

// Скелетон компонент
const CreateSkeleton = () => (
  <>
    {[1, 2, 3].map((i) => (
      <SkeletonCard key={i}>
        <CardHeader>
          <div style={{ flex: 1 }}>
            <SkeletonLine width="70%" height={20} style={{ marginBottom: 8 }} />
            <SkeletonLine width="40%" height={14} />
          </div>
          <SkeletonBadge width={60} height={24} />
        </CardHeader>

        <CardContent>
          <CardRow style={{ marginBottom: 12 }}>
            <SkeletonLine width="80px" height={24} style={{ borderRadius: 12 }} />
            <SkeletonLine width="100px" height={24} style={{ borderRadius: 12 }} />
            <SkeletonLine width="60px" height={24} style={{ borderRadius: 12 }} />
          </CardRow>
          <SkeletonLine width="120px" height={20} />
        </CardContent>

        <SkeletonLine width="100%" height={40} style={{ marginTop: 16, borderRadius: 20 }} />
      </SkeletonCard>
    ))}
  </>
);

/* =========================
   COMPONENT
========================= */

export function Create({ screen, onNavigate }: CreateProps) {
  const [query, setQuery] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const loadingRef = useRef(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* =========================
     LOAD DATA
  ========================= */

  const loadData = useCallback(async (force = false) => {
    if (loadingRef.current) return;

    // Проверка кэша (если не force)
    if (!force) {
      const cached = createCache.get('challenges');
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setChallenges(cached.data);
        setLoading(false);
        return;
      }
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('challenges_with_creator')
        .select(`
          id,
          title,
          report_mode,
          duration_days,
          start_mode,
          start_date,
          creator_username,
          is_finished,
          entry_type,
          entry_price,
          entry_currency,
          entry_condition,
          contact_info,
          payment_method,
          payment_description
        `)
        .eq('is_finished', false);

      if (error) {
        console.error('[CREATE] load error', error);
        return;
      }

      if (!data) return;

      const mapped: Challenge[] = data.map((c: ChallengeFromDB) => {
        const isFuture =
          c.start_mode === 'date' &&
          c.start_date &&
          new Date(c.start_date) > new Date();

        return {
          id: c.id,
          title: c.title,
          username: c.creator_username ?? 'unknown',
          reportType: c.report_mode === 'simple' ? 'Ежедневный' : 'Целевой',
          reportIcon: reportIcons[c.report_mode],
          duration: c.duration_days,
          status: isFuture ? 'Скоро' : 'Идёт',
          statusIcon: isFuture ? statusIcons.soon : statusIcons.active,
          entryType: c.entry_type,
          entryPrice: c.entry_price ?? undefined,
          entryCurrency: c.entry_currency ?? undefined,
          entryCondition: c.entry_condition ?? undefined,
          contactInfo: c.contact_info ?? undefined,
          paymentMethod: c.payment_method ?? undefined,
          paymentDescription: c.payment_description ?? undefined,
        };
      });

      // Сохраняем в кэш
      createCache.set('challenges', {
        data: mapped,
        timestamp: Date.now(),
      });

      if (mountedRef.current) {
        setChallenges(mapped);
      }
    } catch (error) {
      console.error('[CREATE] error', error);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    if (screen === 'create') {
      loadData();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [screen, loadData]);

  // Очистка поиска при переключении экрана
  useEffect(() => {
    if (screen !== 'create') {
      setQuery('');
    }
  }, [screen]);

  /* =========================
     FILTER (мемоизирован)
  ========================= */

  const filtered = useMemo(() => {
    if (!query) return challenges;
    return challenges.filter(c =>
      c.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [challenges, query]);

  /* =========================
     HANDLERS (мемоизированы)
  ========================= */

  const handleCardClick = useCallback((challenge: Challenge) => {
    if (challenge.entryType === 'free') {
      onNavigate('challenge-details', challenge.id);
    } else if (challenge.entryType === 'paid') {
      onNavigate('challenge-paid', challenge.id);
    } else if (challenge.entryType === 'condition') {
      onNavigate('challenge-condition', challenge.id);
    }
  }, [onNavigate]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    searchInputRef.current?.focus();
  }, []);

  const handleFocus = useCallback(() => setKeyboardOpen(true), []);
  const handleBlur = useCallback(() => setKeyboardOpen(false), []);

  const handleCreateFlow = useCallback(() => {
    onNavigate('create-flow');
  }, [onNavigate]);

  const getEntryBadge = useCallback((type: 'free' | 'paid' | 'condition') => {
    switch (type) {
      case 'paid':
        return { text: '💰 Платный', color: '#FFD700' };
      case 'condition':
        return { text: '🔒 По условию', color: '#9B59B6' };
      default:
        return null;
    }
  }, []);

  /* =========================
     RENDER
  ========================= */

  return (
    <SafeArea>
      {/* FIXED TOP */}
      <FixedTop>
        <TopBar>
          <SearchField $active={keyboardOpen || query.length > 0}>
            <SearchIcon>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="8" r="6" />
                <line x1="13" y1="13" x2="17" y2="17" />
              </svg>
            </SearchIcon>

            <SearchInput
              ref={searchInputRef}
              value={query}
              onChange={handleSearchChange}
              placeholder="Поиск вызовов"
              onFocus={handleFocus}
              onBlur={handleBlur}
              $hasValue={query.length > 0}
            />

            {query && (
              <ClearButton onClick={handleClearSearch}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="8" cy="8" r="6" />
                  <line x1="5" y1="5" x2="11" y2="11" />
                  <line x1="11" y1="5" x2="5" y2="11" />
                </svg>
              </ClearButton>
            )}
          </SearchField>

          <ActionButton onClick={handleCreateFlow}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="6" x2="12" y2="18" />
              <line x1="6" y1="12" x2="18" y2="12" />
            </svg>
          </ActionButton>
        </TopBar>
      </FixedTop>

      <TopOffset />

      <ScrollContainer>
        <List>
          {loading ? (
            <CreateSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="24" cy="24" r="22" />
                  <line x1="12" y1="12" x2="36" y2="36" />
                  <line x1="36" y1="12" x2="12" y2="36" />
                </svg>
              </EmptyIcon>
              <EmptyText>Ничего не найдено</EmptyText>
              <EmptySubtext>Попробуйте изменить запрос</EmptySubtext>
            </EmptyState>
          ) : (
            filtered.map(c => {
              const entryBadge = getEntryBadge(c.entryType);
              
              return (
                <Card 
                  key={c.id} 
                  $entryType={c.entryType}
                  onClick={() => handleCardClick(c)}
                >
                  <CardHeader>
                    <div>
                      <CardTitle>{c.title}</CardTitle>
                      <CardMeta>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="7" cy="5" r="3" />
                            <path d="M2 14c1-2 3-3 5-3s4 1 5 3" />
                          </svg>
                          @{c.username}
                        </span>
                      </CardMeta>
                    </div>
                    
                    <Status>
                      <StatusBadge $status={c.status === 'Идёт' ? 'active' : 'soon'}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {c.statusIcon}
                          {c.status}
                        </span>
                      </StatusBadge>
                    </Status>
                  </CardHeader>

                  <CardContent>
                    <CardRow>
                      {entryBadge && (
                        <EntryBadge $color={entryBadge.color}>
                          {entryBadge.text}
                        </EntryBadge>
                      )}
                      
                      <CardBadge>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {c.reportIcon}
                          {c.reportType}
                        </span>
                      </CardBadge>
                      
                      <CardBadge>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="4" width="12" height="12" rx="2" />
                            <line x1="6" y1="2" x2="6" y2="6" />
                            <line x1="12" y1="2" x2="12" y2="6" />
                          </svg>
                          {c.duration} дней
                        </span>
                      </CardBadge>
                    </CardRow>

                    {c.entryType === 'paid' && c.entryPrice && c.entryCurrency && (
                      <PriceTag>
                        {c.entryPrice} {c.entryCurrency.toUpperCase()}
                      </PriceTag>
                    )}
                  </CardContent>

                  {c.entryType === 'free' ? (
                    <MoreButton>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Подробнее
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 3l6 6-6 6" />
                        </svg>
                      </span>
                    </MoreButton>
                  ) : (
                    <ConditionButton $entryType={c.entryType}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        К условиям
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 3l6 6-6 6" />
                        </svg>
                      </span>
                    </ConditionButton>
                  )}
                </Card>
              );
            })
          )}
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