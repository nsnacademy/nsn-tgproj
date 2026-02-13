import { useEffect, useState, type JSX } from 'react';
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

/* =========================
   COMPONENT
========================= */

export function Create({ screen, onNavigate }: CreateProps) {
  const [query, setQuery] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    if (screen === 'create') {
      load();
    }
  }, [screen]);

  async function load() {
    setLoading(true);
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

    if (!data || error) {
      console.error('[CREATE] load error', error);
      setLoading(false);
      return;
    }

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
        reportIcon:
          c.report_mode === 'simple' ? (
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="7" cy="7" r="6" />
              <path d="M4 7l2 2 3-3" />
            </svg>
          ) : (
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="10" height="10" rx="2" />
              <line x1="7" y1="4" x2="7" y2="10" />
              <line x1="4" y1="7" x2="10" y2="7" />
            </svg>
          ),

        duration: c.duration_days,
        status: isFuture ? 'Скоро' : 'Идёт',
        statusIcon: isFuture ? (
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="6" cy="6" r="5" />
            <path d="M6 3v3l2 2" />
          </svg>
        ) : (
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="6" cy="6" r="5" />
            <path d="M6 3v3l2 2" />
          </svg>
        ),

        entryType: c.entry_type,
        entryPrice: c.entry_price ?? undefined,
        entryCurrency: c.entry_currency ?? undefined,
        entryCondition: c.entry_condition ?? undefined,
        contactInfo: c.contact_info ?? undefined,
        paymentMethod: c.payment_method ?? undefined,
        paymentDescription: c.payment_description ?? undefined,
      };
    });

    setChallenges(mapped);
    setLoading(false);
  }

  /* =========================
     FILTER
  ========================= */

  const filtered = challenges.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  /* =========================
     HANDLERS
  ========================= */

  const handleCardClick = (challenge: Challenge) => {
    if (challenge.entryType === 'free') {
      onNavigate('challenge-details', challenge.id);
    } else if (challenge.entryType === 'paid') {
      onNavigate('challenge-paid', challenge.id);
    } else if (challenge.entryType === 'condition') {
      onNavigate('challenge-condition', challenge.id);
    }
  };

  const getEntryBadge = (type: 'free' | 'paid' | 'condition') => {
    switch (type) {
      case 'paid':
        return { text: '💰 Платный', color: '#FFD700' };
      case 'condition':
        return { text: '🔒 По условию', color: '#9B59B6' };
      default:
        return null;
    }
  };

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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск вызовов"
              onFocus={() => setKeyboardOpen(true)}
              onBlur={() => setKeyboardOpen(false)}
              $hasValue={query.length > 0}
            />

            {query && (
              <ClearButton onClick={() => setQuery('')}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="8" cy="8" r="6" />
                  <line x1="5" y1="5" x2="11" y2="11" />
                  <line x1="11" y1="5" x2="5" y2="11" />
                </svg>
              </ClearButton>
            )}
          </SearchField>

          <ActionButton onClick={() => onNavigate('create-flow')}>
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
            <EmptyState>
              <EmptyIcon>
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="24" cy="24" r="22" strokeOpacity="0.3" />
                  <path d="M24 10v14l8 8" strokeOpacity="0.5" />
                </svg>
              </EmptyIcon>
              <EmptyText>Загрузка вызовов...</EmptyText>
            </EmptyState>
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