import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Container,
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
} from './styles';

import { BottomNav, NavItem } from '../Home/styles';
import {
  getCurrentUser,
  checkIsCreator,
} from '../../shared/lib/supabase';

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
};

type SupabaseUser = {
  id: string;
  user_metadata?: {
    full_name?: string;
    username?: string;
  };
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
  const [editForm, setEditForm] = useState({
    bio: '',
    stack: '',
    experience: '',
    portfolio: '',
    telegram: '',
    email: '',
    role: 'developer' as 'developer' | 'designer' | 'manager' | 'other'
  });

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

  useEffect(() => {
    async function checkOwnProfile() {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;
      setIsOwnProfile(!userId || userId === currentUser.id);
    }
    checkOwnProfile();
  }, [userId]);

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser() as SupabaseUser | null;
      if (!currentUser) return;

      const targetUserId = userId || currentUser.id;

      const { data: userStats } = await supabase
        .from('users')
        .select(`
          username, 
          total_days, 
          total_challenges, 
          current_streak, 
          max_streak, 
          power_index
        `)
        .eq('id', targetUserId)
        .single();

      const { data: profileData } = await supabase
        .from('profiles')
        .select('bio, stack, experience, portfolio, telegram, email, role')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (userStats) {
        const newStats = {
          username: userStats.username || 'user',
          bio: profileData?.bio || '',
          stack: profileData?.stack || '',
          experience: profileData?.experience || '',
          portfolio: profileData?.portfolio || '',
          telegram: profileData?.telegram || '',
          email: profileData?.email || '',
          role: profileData?.role || 'developer',
          total_days: userStats.total_days || 0,
          total_challenges: userStats.total_challenges || 0,
          current_streak: userStats.current_streak || 0,
          max_streak: userStats.max_streak || 0,
          power_index: userStats.power_index || 0,
          total_calls: Math.round((userStats.total_challenges || 0) * 1.5),
          monthly_active: Math.min(30, Math.round((userStats.total_days || 0) * 0.7)),
          weekly_growth: 12,
        };
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
    }

    loadData();
  }, [userId]);

  useEffect(() => {
    async function checkAccess() {
      const user = await getCurrentUser();
      if (!user) {
        setIsCreator(false);
        return;
      }
      const creator = await checkIsCreator(user.id);
      setIsCreator(creator);
    }
    checkAccess();
  }, []);

  const onToggleAdmin = () => {
    if (locked || !isCreator) return;
    localStorage.setItem('adminMode', 'true');
    setAdminMode(true);
    setLocked(true);
    setTimeout(() => {
      onNavigate('admin');
      setLocked(false);
    }, 250);
  };

  useEffect(() => {
    if (screen === 'profile') {
      localStorage.setItem('adminMode', 'false');
      setAdminMode(false);
    }
  }, [screen]);

  const handleSave = async () => {
    if (!stats) return;
    
    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: currentUser.id,
        bio: editForm.bio,
        stack: editForm.stack,
        experience: editForm.experience,
        portfolio: editForm.portfolio,
        telegram: editForm.telegram,
        email: editForm.email,
        role: editForm.role,
        updated_at: new Date()
      });

    if (!error) {
      setStats({
        ...stats,
        bio: editForm.bio,
        stack: editForm.stack,
        experience: editForm.experience,
        portfolio: editForm.portfolio,
        telegram: editForm.telegram,
        email: editForm.email,
        role: editForm.role,
      });
      setIsEditing(false);
    }
  };

  if (!stats) {
    return (
      <SafeArea>
        <Container>
          <Text>Загрузка...</Text>
        </Container>
      </SafeArea>
    );
  }

  const monthPercent = Math.round((stats.monthly_active / 30) * 100);
  const callsPercent = stats.total_days > 0 
    ? Math.round((stats.total_calls / stats.total_days) * 100) - 100 
    : 0;

  const currentHints = hints[editForm.role];

  return (
    <SafeArea>
      <Container>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Title>Профиль</Title>
          <Toggle $active={adminMode} $disabled={!isCreator} onClick={onToggleAdmin}>
            <ToggleKnob $active={adminMode} />
          </Toggle>
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div style={{ marginTop: 20 }}>
          {/* Только username */}
          <UserHandle style={{ fontSize: 24, marginBottom: 16 }}>@{stats.username}</UserHandle>

          {/* Индекс дисциплины из БД */}
          <IndexBadge>
            <IndexValue>⚡ {Math.round(stats.power_index)}</IndexValue>
            <IndexPercent>· выше чем 78%</IndexPercent>
          </IndexBadge>

          {isEditing ? (
            /* РЕДАКТИРОВАНИЕ */
            <EditForm>
              <CategoryTabs>
                <CategoryTab 
                  $active={editForm.role === 'developer'} 
                  onClick={() => setEditForm({...editForm, role: 'developer'})}
                >
                  Разработчик
                </CategoryTab>
                <CategoryTab 
                  $active={editForm.role === 'designer'} 
                  onClick={() => setEditForm({...editForm, role: 'designer'})}
                >
                  Дизайнер
                </CategoryTab>
                <CategoryTab 
                  $active={editForm.role === 'manager'} 
                  onClick={() => setEditForm({...editForm, role: 'manager'})}
                >
                  Менеджер
                </CategoryTab>
                <CategoryTab 
                  $active={editForm.role === 'other'} 
                  onClick={() => setEditForm({...editForm, role: 'other'})}
                >
                  Другое
                </CategoryTab>
              </CategoryTabs>

              <EditRow>
                <EditLabel>О себе</EditLabel>
                <HintText>{currentHints.bio}</HintText>
                <EditTextArea 
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="Начните писать..."
                />
              </EditRow>

              <EditRow>
                <EditLabel>Навыки и инструменты</EditLabel>
                <HintText>{currentHints.stack}</HintText>
                <EditInput 
                  value={editForm.stack}
                  onChange={(e) => setEditForm({...editForm, stack: e.target.value})}
                  placeholder="Например: React, TypeScript, Figma..."
                />
              </EditRow>

              <EditRow>
                <EditLabel>Опыт</EditLabel>
                <HintText>{currentHints.experience}</HintText>
                <EditInput 
                  value={editForm.experience}
                  onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
                  placeholder="Ваш опыт"
                />
              </EditRow>

              <EditRow>
                <EditLabel>Портфолио</EditLabel>
                <HintText>{currentHints.portfolio}</HintText>
                <EditInput 
                  value={editForm.portfolio}
                  onChange={(e) => setEditForm({...editForm, portfolio: e.target.value})}
                  placeholder="Ссылка на портфолио"
                />
              </EditRow>

              <EditRow>
                <EditLabel>Telegram</EditLabel>
                <HintText>Для связи с вами</HintText>
                <EditInput 
                  value={editForm.telegram}
                  onChange={(e) => setEditForm({...editForm, telegram: e.target.value})}
                  placeholder="@username"
                />
              </EditRow>

              <EditRow>
                <EditLabel>Email</EditLabel>
                <HintText>Для рабочих контактов</HintText>
                <EditInput 
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
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
              {/* О себе */}
              {stats.bio && <UserBio>{stats.bio}</UserBio>}
              {stats.stack && <UserStack>{stats.stack}</UserStack>}
              {stats.experience && <UserStats>Опыт: {stats.experience}</UserStats>}
              {stats.portfolio && <UserStats>Портфолио: {stats.portfolio}</UserStats>}

              <SectionDivider />

              {/* СТАТИСТИКА */}
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

              {/* Активность */}
              <ActivityBar>
                <ActivityFill $width={monthPercent} />
              </ActivityBar>
              <ActivityLabel>
                {stats.monthly_active}/30 дней · {stats.total_calls} вызовов 
                {callsPercent > 0 && ` (+${callsPercent}%)`}
              </ActivityLabel>

              {/* Динамика */}
              {stats.weekly_growth > 0 && (
                <ActivityLabel style={{ marginTop: 8, color: '#4caf50' }}>
                  ▲ +{stats.weekly_growth}% за неделю
                </ActivityLabel>
              )}

              <SectionDivider />

              {/* КОНТАКТЫ */}
              {isOwnProfile ? (
                /* СВОЙ ПРОФИЛЬ */
                <>
                  <SectionTitle>Контакты</SectionTitle>
                  <ContactSection>
                    {stats.telegram && (
                      <ContactItem>
                        <ContactLabel>Telegram</ContactLabel>
                        <ContactValue>{stats.telegram}</ContactValue>
                      </ContactItem>
                    )}
                    {stats.email && (
                      <ContactItem>
                        <ContactLabel>Email</ContactLabel>
                        <ContactValue>{stats.email}</ContactValue>
                      </ContactItem>
                    )}
                    <EditButton onClick={() => setIsEditing(true)}>✎ Редактировать профиль</EditButton>
                  </ContactSection>
                </>
              ) : (
                /* ЧУЖОЙ ПРОФИЛЬ */
                <>
                  <SectionTitle>Контакты</SectionTitle>
                  <ContactSection>
                    {stats.telegram && (
                      <ContactItem>
                        <ContactLabel>Telegram</ContactLabel>
                        <ContactValue>{stats.telegram}</ContactValue>
                      </ContactItem>
                    )}
                    {stats.email && (
                      <ContactItem>
                        <ContactLabel>Email</ContactLabel>
                        <ContactValue>{stats.email}</ContactValue>
                      </ContactItem>
                    )}
                  </ContactSection>

                  <InviteButton>
                    ПРИГЛАСИТЬ В ПРОЕКТ
                  </InviteButton>
                </>
              )}
            </>
          )}

          <SectionDivider />

          {/* ACCESS INFO */}
          {isCreator === false && (
            <Text style={{ marginTop: 8, fontSize: 12, color: '#666', textAlign: 'center' }}>
              Админ-режим только для создателя
            </Text>
          )}
        </div>
      </Container>

      {/* BOTTOM NAV */}
      <BottomNav>
        <NavItem $active={screen === 'home'} onClick={() => onNavigate('home')}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>
        <NavItem $active={screen === 'create'} onClick={() => onNavigate('create')}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </NavItem>
        <NavItem $active={false}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="18" x2="6" y2="14" /><line x1="12" y1="18" x2="12" y2="10" /><line x1="18" y1="18" x2="18" y2="6" />
          </svg>
        </NavItem>
        <NavItem $active={screen === 'profile'} onClick={() => onNavigate('profile')}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}