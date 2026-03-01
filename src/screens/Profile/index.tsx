import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Container,
  HeaderContent,
  FixedHeader,
  ScrollContent,
  Title,
  Text,
  Toggle,
  ToggleKnob,
  UserHandle,
  UserBio,
  UserStack,
  UserStats,
  StatsRow,
  StatItem,
  StatNumber,
  StatLabel,
  IndexBadge,
  IndexValue,
  IndexPercent,
  ActivityBar,
  ActivityFill,
  ActivityLabel,
  ContactSection,
  ContactItem,
  ContactLabel,
  ContactValue,
  CopyIcon,
  EditButton,
  InviteButton,
  SectionDivider,
  SectionTitle,
  EditForm,
  EditRow,
  EditLabel,
  EditInput,
  EditTextArea,
  SaveButton,
  CancelButton,
  HintText,
  CategoryTabs,
  CategoryTab,
  PortfolioLink,
} from './styles';

import { BottomNav, NavItem } from '../Home/styles';
import { getCurrentUser, checkIsCreator } from '../../shared/lib/supabase';

type ProfileScreen = 'home' | 'create' | 'profile' | 'admin';

type ProfileProps = {
  screen: ProfileScreen;
  onNavigate: (screen: ProfileScreen) => void;
  userId?: string;
};

type UserStats = {
  username: string;
  bio: string;
  stack: string;
  experience: string;
  portfolio: string;
  telegram: string;
  email: string;
  role: 'developer' | 'designer' | 'manager' | 'other';
  total_days: number;
  total_challenges: number;
  current_streak: number;
  max_streak: number;
  power_index: number;
  total_calls: number;
  monthly_active: number;
  weekly_growth: number;
  percentile?: number;
  rank?: number;
  total_users?: number;
  hashtag?: string;
};

type SupabaseUser = {
  id: string;
  user_metadata?: {
    full_name?: string;
    username?: string;
  };
};

// Кэш для данных профиля
const profileCache = new Map<string, { data: UserStats; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

// Функция для генерации хештега на основе индекса
const getHashtag = (index: number): string => {
  if (index >= 100) return '#хардкор';
  if (index >= 50) return '#дисциплина';
  if (index >= 25) return '#впути';
  if (index >= 10) return '#новичок';
  return '#старт';
};

// Подсказки для разных ролей
const hints = {
  developer: {
    bio: 'Напишите о себе: стек, опыт, какие проекты интересны',
    stack: 'Укажите технологии через запятую: React, TypeScript, Node, Python...',
    experience: 'Например: 3 года в веб-разработке',
    portfolio: 'GitHub, GitLab, личный сайт',
  },
  designer: {
    bio: 'Расскажите о себе: специализация, стиль, инструменты',
    stack: 'Инструменты: Figma, Sketch, Adobe XD, Photoshop...',
    experience: 'Опыт работы в дизайне',
    portfolio: 'Behance, Dribbble, личное портфолио',
  },
  manager: {
    bio: 'Опишите опыт: какие проекты вели, команды, методологии',
    stack: 'Инструменты: Jira, Trello, Notion, Slack...',
    experience: 'Управленческий опыт',
    portfolio: 'Ссылки на проекты, кейсы',
  },
  other: {
    bio: 'Расскажите о себе и своих интересах',
    stack: 'Ваши навыки и компетенции',
    experience: 'Опыт работы',
    portfolio: 'Ссылки на работы',
  },
};

export default function Profile({ screen, onNavigate, userId }: ProfileProps) {
  const [adminMode, setAdminMode] = useState(() => {
    const saved = localStorage.getItem('adminMode');
    return saved === 'true';
  });

  const [locked, setLocked] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [editForm, setEditForm] = useState({
    bio: '',
    stack: '',
    experience: '',
    portfolio: '',
    telegram: '',
    email: '',
    role: 'developer' as 'developer' | 'designer' | 'manager' | 'other',
  });

  // Мемоизация вычисляемых значений
  const monthPercent = useMemo(
    () => (stats ? Math.min(100, (stats.monthly_active / 30) * 100) : 0),
    [stats?.monthly_active]
  );

  const callsPercent = useMemo(
    () => (stats?.total_days ? (stats.total_calls / stats.total_days) * 100 - 100 : 0),
    [stats?.total_calls, stats?.total_days]
  );

  const currentHints = useMemo(() => hints[editForm.role], [editForm.role]);

  const rankText = useMemo(
    () => (stats?.rank && stats?.total_users ? `${stats.rank} / ${stats.total_users}` : ''),
    [stats?.rank, stats?.total_users]
  );

  useEffect(() => {
    let mounted = true;

    async function checkOwnProfile() {
      const currentUser = await getCurrentUser();
      if (!currentUser || !mounted) return;
      setIsOwnProfile(!userId || userId === currentUser.id);
    }

    checkOwnProfile();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Функция для расчета недельного роста
  const calculateWeeklyGrowth = useCallback(async (targetUserId: string) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const { data: activities } = await supabase
        .from('challenges')
        .select('created_at')
        .eq('user_id', targetUserId)
        .gte('created_at', fourteenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (!activities || activities.length < 7) {
        return 0;
      }

      const now = new Date();
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));

      const lastWeek = activities.filter(
        (a) => new Date(a.created_at) >= oneWeekAgo
      ).length;

      const previousWeek = activities.filter(
        (a) => new Date(a.created_at) < oneWeekAgo
      ).length;

      if (previousWeek === 0) return lastWeek > 0 ? 100 : 0;

      const growth = Math.round(((lastWeek - previousWeek) / previousWeek) * 100);
      return Math.max(-100, Math.min(1000, growth));
    } catch (error) {
      console.error('Error calculating weekly growth:', error);
      return 0;
    }
  }, []);

  // Загрузка данных с реальным расчетом роста
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setIsLoading(true);

      const currentUser = (await getCurrentUser()) as SupabaseUser | null;
      if (!currentUser || !mounted) {
        setIsLoading(false);
        return;
      }

      const targetUserId = userId || currentUser.id;
      const cacheKey = `profile_${targetUserId}`;

      const cached = profileCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        if (mounted) {
          setStats(cached.data);
          setEditForm({
            bio: cached.data.bio,
            stack: cached.data.stack,
            experience: cached.data.experience,
            portfolio: cached.data.portfolio,
            telegram: cached.data.telegram,
            email: cached.data.email,
            role: cached.data.role,
          });
          setIsLoading(false);
        }
        return;
      }

      try {
        const [allUsersResult, userStatsResult, profileResult, weeklyGrowth] = await Promise.all([
          supabase
            .from('users')
            .select('power_index', { count: 'exact', head: true })
            .order('power_index', { ascending: false }),

          supabase
            .from('users')
            .select(
              `
              username, 
              total_days, 
              total_challenges, 
              current_streak, 
              max_streak, 
              power_index
            `
            )
            .eq('id', targetUserId)
            .single(),

          supabase
            .from('profiles')
            .select('bio, stack, experience, portfolio, telegram, email, role')
            .eq('user_id', targetUserId)
            .maybeSingle(),

          calculateWeeklyGrowth(targetUserId),
        ]);

        if (!mounted) return;

        if (userStatsResult.data) {
          let percentile = 50;
          let rank = 0;
          const totalUsers = allUsersResult.count || 1;

          if (totalUsers > 0) {
            rank =
              Math.floor((100 - userStatsResult.data.power_index) * totalUsers) / 100 + 1;
            rank = Math.max(1, Math.min(totalUsers, rank));
            percentile = Math.round(((totalUsers - rank) / totalUsers) * 100);
          }

          const newStats = {
            username: userStatsResult.data.username || 'user',
            bio: profileResult.data?.bio || '',
            stack: profileResult.data?.stack || '',
            experience: profileResult.data?.experience || '',
            portfolio: profileResult.data?.portfolio || '',
            telegram: profileResult.data?.telegram || '',
            email: profileResult.data?.email || '',
            role: profileResult.data?.role || 'developer',
            total_days: userStatsResult.data.total_days || 0,
            total_challenges: userStatsResult.data.total_challenges || 0,
            current_streak: userStatsResult.data.current_streak || 0,
            max_streak: userStatsResult.data.max_streak || 0,
            power_index: userStatsResult.data.power_index || 0,
            total_calls: userStatsResult.data.total_challenges || 0,
            monthly_active: Math.min(30, userStatsResult.data.total_days || 0),
            weekly_growth: weeklyGrowth,
            percentile,
            rank: Math.round(rank),
            total_users: totalUsers,
            hashtag: getHashtag(userStatsResult.data.power_index || 0),
          };

          profileCache.set(cacheKey, { data: newStats, timestamp: Date.now() });

          setStats(newStats);
          setEditForm({
            bio: newStats.bio,
            stack: newStats.stack,
            experience: newStats.experience,
            portfolio: newStats.portfolio,
            telegram: newStats.telegram,
            email: newStats.email,
            role: newStats.role,
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [userId, calculateWeeklyGrowth]);

  useEffect(() => {
    let mounted = true;

    async function checkAccess() {
      const user = await getCurrentUser();
      if (!user || !mounted) {
        setIsCreator(false);
        return;
      }
      const creator = await checkIsCreator(user.id);
      if (mounted) {
        setIsCreator(creator);
      }
    }

    checkAccess();

    return () => {
      mounted = false;
    };
  }, []);

  const onToggleAdmin = useCallback(() => {
    if (locked || !isCreator) return;
    localStorage.setItem('adminMode', 'true');
    setAdminMode(true);
    setLocked(true);
    setTimeout(() => {
      onNavigate('admin');
      setLocked(false);
    }, 250);
  }, [locked, isCreator, onNavigate]);

  useEffect(() => {
    if (screen === 'profile') {
      localStorage.setItem('adminMode', 'false');
      setAdminMode(false);
    }
  }, [screen]);

  const handleSave = useCallback(async () => {
    if (!stats) return;

    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      let result;

      if (existingProfile) {
        result = await supabase
          .from('profiles')
          .update({
            bio: editForm.bio,
            stack: editForm.stack,
            experience: editForm.experience,
            portfolio: editForm.portfolio,
            telegram: editForm.telegram,
            email: editForm.email,
            role: editForm.role,
            updated_at: new Date(),
          })
          .eq('user_id', currentUser.id);
      } else {
        result = await supabase
          .from('profiles')
          .insert({
            user_id: currentUser.id,
            bio: editForm.bio,
            stack: editForm.stack,
            experience: editForm.experience,
            portfolio: editForm.portfolio,
            telegram: editForm.telegram,
            email: editForm.email,
            role: editForm.role,
            updated_at: new Date(),
          });
      }

      if (result.error) {
        console.error('Save error:', result.error);
        alert('Ошибка при сохранении: ' + result.error.message);
      } else {
        const cacheKey = `profile_${currentUser.id}`;
        const updatedStats = {
          ...stats,
          bio: editForm.bio,
          stack: editForm.stack,
          experience: editForm.experience,
          portfolio: editForm.portfolio,
          telegram: editForm.telegram,
          email: editForm.email,
          role: editForm.role,
        };
        profileCache.set(cacheKey, { data: updatedStats, timestamp: Date.now() });

        setStats(updatedStats);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Ошибка при сохранении');
    }
  }, [stats, editForm]);

  const handleCopy = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handlePortfolioClick = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [userId]);

  if (isLoading && !stats) {
    return (
      <SafeArea>
        <Container>
          <Text>Загрузка...</Text>
        </Container>
      </SafeArea>
    );
  }

  if (!stats) {
    return (
      <SafeArea>
        <Container>
          <Text>Профиль не найден</Text>
        </Container>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <FixedHeader>
        <HeaderContent>
          <Title>Профиль</Title>
          <Toggle $active={adminMode} $disabled={!isCreator} onClick={onToggleAdmin}>
            <ToggleKnob $active={adminMode} />
          </Toggle>
        </HeaderContent>
        <UserHandle style={{ fontSize: 24, marginBottom: 8 }}>@{stats.username}</UserHandle>
        <IndexBadge style={{ marginTop: 0 }}>
          <IndexValue>⚡ {stats.power_index.toFixed(1)}</IndexValue>
          <IndexPercent>· {rankText}</IndexPercent>
        </IndexBadge>
      </FixedHeader>

      <ScrollContent ref={scrollRef}>
        <Container>
          {isEditing ? (
            <EditForm>
              <CategoryTabs>
                <CategoryTab
                  $active={editForm.role === 'developer'}
                  onClick={() => setEditForm({ ...editForm, role: 'developer' })}
                >
                  Разработчик
                </CategoryTab>
                <CategoryTab
                  $active={editForm.role === 'designer'}
                  onClick={() => setEditForm({ ...editForm, role: 'designer' })}
                >
                  Дизайнер
                </CategoryTab>
                <CategoryTab
                  $active={editForm.role === 'manager'}
                  onClick={() => setEditForm({ ...editForm, role: 'manager' })}
                >
                  Менеджер
                </CategoryTab>
                <CategoryTab
                  $active={editForm.role === 'other'}
                  onClick={() => setEditForm({ ...editForm, role: 'other' })}
                >
                  Другое
                </CategoryTab>
              </CategoryTabs>

              <EditRow>
                <EditLabel>О себе</EditLabel>
                <HintText>{currentHints.bio}</HintText>
                <EditTextArea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Начните писать..."
                />
              </EditRow>

              <EditRow>
                <EditLabel>Навыки и инструменты</EditLabel>
                <HintText>{currentHints.stack}</HintText>
                <EditInput
                  value={editForm.stack}
                  onChange={(e) => setEditForm({ ...editForm, stack: e.target.value })}
                  placeholder="Например: React, TypeScript, Figma..."
                />
              </EditRow>

              <EditRow>
                <EditLabel>Опыт</EditLabel>
                <HintText>{currentHints.experience}</HintText>
                <EditInput
                  value={editForm.experience}
                  onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                  placeholder="Ваш опыт"
                />
              </EditRow>

              <EditRow>
                <EditLabel>Портфолио</EditLabel>
                <HintText>{currentHints.portfolio}</HintText>
                <EditInput
                  value={editForm.portfolio}
                  onChange={(e) => setEditForm({ ...editForm, portfolio: e.target.value })}
                  placeholder="Ссылка на портфолио"
                />
              </EditRow>

              <EditRow>
                <EditLabel>Telegram</EditLabel>
                <HintText>Для связи с вами</HintText>
                <EditInput
                  value={editForm.telegram}
                  onChange={(e) => setEditForm({ ...editForm, telegram: e.target.value })}
                  placeholder="@username"
                />
              </EditRow>

              <EditRow>
                <EditLabel>Email</EditLabel>
                <HintText>Для рабочих контактов</HintText>
                <EditInput
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="email@mail.com"
                />
              </EditRow>

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <SaveButton onClick={handleSave}>Сохранить</SaveButton>
                <CancelButton onClick={() => setIsEditing(false)}>Отмена</CancelButton>
              </div>
            </EditForm>
          ) : (
            <>
              {stats.bio && <UserBio>{stats.bio}</UserBio>}
              {stats.stack && <UserStack>{stats.stack}</UserStack>}
              {stats.experience && <UserStats>Опыт: {stats.experience}</UserStats>}

              <SectionDivider />

              <SectionTitle>Показатели</SectionTitle>
              <StatsRow>
                <StatItem>
                  <StatNumber>{stats.total_days}</StatNumber>
                  <StatLabel>дней</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>{stats.current_streak}</StatNumber>
                  <StatLabel>подряд</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>{stats.max_streak}</StatNumber>
                  <StatLabel>рекорд</StatLabel>
                </StatItem>
              </StatsRow>

              <ActivityBar>
                <ActivityFill $width={monthPercent} />
              </ActivityBar>
              <ActivityLabel>
                {stats.monthly_active}/30 дней · {stats.total_calls} вызовов
                {callsPercent > 0 && ` (+${callsPercent.toFixed(1)}%)`}
              </ActivityLabel>

              {stats.weekly_growth !== 0 && (
                <ActivityLabel
                  style={{
                    marginTop: 8,
                    color: stats.weekly_growth > 0 ? '#4caf50' : '#f44336',
                  }}
                >
                  {stats.weekly_growth > 0 ? '▲' : '▼'} {Math.abs(stats.weekly_growth)}% за
                  неделю
                </ActivityLabel>
              )}

              <SectionDivider />

              {isOwnProfile ? (
                <>
                  <SectionTitle>Контакты и ссылки</SectionTitle>
                  <ContactSection>
                    {stats.portfolio && (
                      <ContactItem>
                        <ContactLabel>Портфолио</ContactLabel>
                        <ContactValue>
                          <PortfolioLink 
                            onClick={() => handlePortfolioClick(stats.portfolio)}
                            title="Открыть в новой вкладке"
                          >
                            {stats.portfolio.length > 30 
                              ? stats.portfolio.substring(0, 30) + '...' 
                              : stats.portfolio}
                          </PortfolioLink>
                          <CopyIcon
                            onClick={() => handleCopy(stats.portfolio, 'portfolio')}
                            title={copied === 'portfolio' ? 'Скопировано!' : 'Копировать ссылку'}
                          >
                            📋
                          </CopyIcon>
                        </ContactValue>
                      </ContactItem>
                    )}
                    {stats.telegram && (
                      <ContactItem>
                        <ContactLabel>Telegram</ContactLabel>
                        <ContactValue>
                          {stats.telegram}
                          <CopyIcon
                            onClick={() => handleCopy(stats.telegram, 'telegram')}
                            title={copied === 'telegram' ? 'Скопировано!' : 'Копировать'}
                          >
                            📋
                          </CopyIcon>
                        </ContactValue>
                      </ContactItem>
                    )}
                    {stats.email && (
                      <ContactItem>
                        <ContactLabel>Email</ContactLabel>
                        <ContactValue>
                          {stats.email}
                          <CopyIcon
                            onClick={() => handleCopy(stats.email, 'email')}
                            title={copied === 'email' ? 'Скопировано!' : 'Копировать'}
                          >
                            📋
                          </CopyIcon>
                        </ContactValue>
                      </ContactItem>
                    )}
                    <EditButton onClick={() => setIsEditing(true)}>
                      ✎ Редактировать профиль
                    </EditButton>
                  </ContactSection>
                </>
              ) : (
                <>
                  <SectionTitle>Контакты и ссылки</SectionTitle>
                  <ContactSection>
                    {stats.portfolio && (
                      <ContactItem>
                        <ContactLabel>Портфолио</ContactLabel>
                        <ContactValue>
                          <PortfolioLink 
                            onClick={() => handlePortfolioClick(stats.portfolio)}
                            title="Открыть в новой вкладке"
                          >
                            {stats.portfolio.length > 30 
                              ? stats.portfolio.substring(0, 30) + '...' 
                              : stats.portfolio}
                          </PortfolioLink>
                          <CopyIcon
                            onClick={() => handleCopy(stats.portfolio, 'portfolio')}
                            title={copied === 'portfolio' ? 'Скопировано!' : 'Копировать ссылку'}
                          >
                            📋
                          </CopyIcon>
                        </ContactValue>
                      </ContactItem>
                    )}
                    {stats.telegram && (
                      <ContactItem>
                        <ContactLabel>Telegram</ContactLabel>
                        <ContactValue>
                          {stats.telegram}
                          <CopyIcon
                            onClick={() => handleCopy(stats.telegram, 'telegram')}
                            title={copied === 'telegram' ? 'Скопировано!' : 'Копировать'}
                          >
                            📋
                          </CopyIcon>
                        </ContactValue>
                      </ContactItem>
                    )}
                    {stats.email && (
                      <ContactItem>
                        <ContactLabel>Email</ContactLabel>
                        <ContactValue>
                          {stats.email}
                          <CopyIcon
                            onClick={() => handleCopy(stats.email, 'email')}
                            title={copied === 'email' ? 'Скопировано!' : 'Копировать'}
                          >
                            📋
                          </CopyIcon>
                        </ContactValue>
                      </ContactItem>
                    )}
                  </ContactSection>

                  <InviteButton>ПРИГЛАСИТЬ В ПРОЕКТ</InviteButton>
                </>
              )}

              <SectionDivider />

              {isCreator === false && (
                <Text
                  style={{ marginTop: 8, fontSize: 12, color: '#666', textAlign: 'center' }}
                >
                  Админ-режим только для создателя
                </Text>
              )}
            </>
          )}
        </Container>
      </ScrollContent>

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