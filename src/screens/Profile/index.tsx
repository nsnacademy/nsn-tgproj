import { useEffect, useState } from 'react';
import { checkIsCreator, getCurrentUser, supabase } from '../../shared/lib/supabase';
import {
  SafeArea,
  Container,
  Header,
  Title,
  Toggle,
  ToggleKnob,
  UserName,
  UserHandle,
  Power,
  PowerValue,
  PowerStatus,
  PowerInfo,
  PowerToday,
  PopupOverlay,
  Popup,
  PopupClose,
  PopupTitle,
  PopupText,
  StatsRow,
  StatBlock,
  StatValue,
  StatLabel,
  Calendar,
  CalendarHeader,
  WeekDays,
  CalendarGrid,
  DayCell,
  CalendarFooter,
  Legend,
  LegendDot,
  StatsDetails,
  StatsTitle,
  StatsItem,
  Progress,
  ProgressBar,
  ProgressFill,
  ProgressText,
  AdminNote,
  BottomNav,
  NavItem,
} from './styles';

type ProfileScreen = 'home' | 'create' | 'profile' | 'admin';

type ProfileProps = {
  screen: ProfileScreen;
  onNavigate: (screen: ProfileScreen) => void;
};

type UserStats = {
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  total_days: number;
  total_challenges: number;
  current_streak: number;
  max_streak: number;
  power_index: number;
};

type SupabaseUser = {
  id: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    username?: string;
  };
};

export default function Profile({ screen, onNavigate }: ProfileProps) {
  const [adminMode, setAdminMode] = useState(() => {
    const saved = localStorage.getItem('adminMode');
    return saved === 'true';
  });
  
  const [locked, setLocked] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser() as SupabaseUser | null;
      if (!currentUser) return;

      const { data: userStats } = await supabase
        .from('users')
        .select('username, total_days, total_challenges, current_streak, max_streak, power_index')
        .eq('id', currentUser.id)
        .single();

      if (userStats) {
        setStats({
          username: userStats.username,
          full_name: currentUser.user_metadata?.full_name || null,
          avatar_url: currentUser.user_metadata?.avatar_url || null,
          total_days: userStats.total_days || 0,
          total_challenges: userStats.total_challenges || 0,
          current_streak: userStats.current_streak || 0,
          max_streak: userStats.max_streak || 0,
          power_index: userStats.power_index || 0,
        });
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 35);
      
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('date')
        .eq('user_id', currentUser.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

      const active = new Set(logs?.map(log => log.date) || []);
      setActiveDays(active);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function checkAccess() {
      const user = await getCurrentUser() as SupabaseUser | null;
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

  const getStatusText = (index: number) => {
    if (index >= 100) return '🔥';
    if (index >= 50) return '📈';
    if (index >= 20) return '🌱';
    return '💤';
  };

  // Calendar
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Пример данных для календаря
  const activeDaysArray = [1,2,5,6,7,8,11,12,13,14,15,18,19,20,21,22,25,26,27,28,29,30,31];
  const streakDaysArray = [25,26,27,28,29,30,31];

  const getDayClass = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (streakDaysArray.includes(day)) return 'streak';
    if (activeDaysArray.includes(day) || activeDays.has(dateStr)) return 'active';
    return '';
  };

  const calculateProgress = () => {
    const activeCount = activeDaysArray.length;
    return Math.round((activeCount / 35) * 100);
  };

  return (
    <SafeArea>
      <Container>
        {/* Header */}
        <Header>
          <Title>Профиль</Title>
          <Toggle $active={adminMode} $disabled={!isCreator} onClick={onToggleAdmin}>
            <ToggleKnob $active={adminMode} />
          </Toggle>
        </Header>

        {stats && (
          <>
            {/* User */}
            <div style={{ marginBottom: 16 }}>
              <UserName>{stats.full_name || 'Пользователь'}</UserName>
              <UserHandle>@{stats.username}</UserHandle>
            </div>

            {/* Power */}
            <Power>
              <PowerValue>{Math.round(stats.power_index)}</PowerValue>
              <PowerStatus>{getStatusText(stats.power_index)}</PowerStatus>
              <PowerInfo onClick={() => setShowInfo(true)}>i</PowerInfo>
              <PowerToday>+3</PowerToday>
            </Power>

            {/* Info Popup */}
            {showInfo && (
              <>
                <PopupOverlay onClick={() => setShowInfo(false)} />
                <Popup>
                  <PopupClose onClick={() => setShowInfo(false)}>✕</PopupClose>
                  <PopupTitle>Индекс силы</PopupTitle>
                  <PopupText>Рассчитывается по формуле:</PopupText>
                  <PopupText>• Дни ×0.5<br/>• Рекорд ×1<br/>• Вызовы ×2<br/>• Активность за 30 дней</PopupText>
                  <PopupText>Чем регулярнее вы участвуете, тем выше индекс</PopupText>
                </Popup>
              </>
            )}

            {/* Stats row */}
            <StatsRow>
              <StatBlock>
                <StatValue>{stats.total_days}</StatValue>
                <StatLabel>дней</StatLabel>
              </StatBlock>
              <StatBlock>
                <StatValue>{stats.current_streak}</StatValue>
                <StatLabel>стрик</StatLabel>
              </StatBlock>
              <StatBlock>
                <StatValue>{stats.max_streak}</StatValue>
                <StatLabel>рекорд</StatLabel>
              </StatBlock>
              <StatBlock>
                <StatValue>{stats.total_challenges}</StatValue>
                <StatLabel>вызовов</StatLabel>
              </StatBlock>
            </StatsRow>

            {/* Calendar */}
            <Calendar>
              <CalendarHeader>
                <span>{monthNames[month]} {year}</span>
                <span>35 дней</span>
              </CalendarHeader>
              <WeekDays>
                {weekDays.map(day => <span key={day}>{day}</span>)}
              </WeekDays>
              <CalendarGrid>
                {Array.from({ length: startOffset }).map((_, i) => (
                  <DayCell key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayClass = getDayClass(day);
                  return (
                    <DayCell key={day} $type={dayClass}>
                      {day}
                    </DayCell>
                  );
                })}
              </CalendarGrid>
              <CalendarFooter>
                <Legend><LegendDot /> был день</Legend>
                <Legend><LegendDot $active /> стрик</Legend>
              </CalendarFooter>
            </Calendar>

            {/* Stats details */}
            <StatsDetails>
              <StatsTitle>Индекс {Math.round(stats.power_index)}</StatsTitle>
              <StatsItem>
                <span>Дни ({stats.total_days})</span>
                <span>{Math.round(stats.total_days * 0.5)}</span>
              </StatsItem>
              <StatsItem>
                <span>Рекорд ({stats.max_streak})</span>
                <span>{stats.max_streak}</span>
              </StatsItem>
              <StatsItem>
                <span>Вызовы ({stats.total_challenges})</span>
                <span>{stats.total_challenges * 2}</span>
              </StatsItem>
              <StatsItem>
                <span>30 дней активных</span>
                <span>{activeDaysArray.length}</span>
              </StatsItem>
              <StatsItem>
                <span>Баллов за месяц</span>
                <span>80</span>
              </StatsItem>
              <Progress>
                <ProgressBar>
                  <ProgressFill $width={calculateProgress()} />
                </ProgressBar>
                <ProgressText>+12% за неделю</ProgressText>
              </Progress>
            </StatsDetails>

            {/* Admin note */}
            {isCreator === false && (
              <AdminNote>Админ-режим только для создателя</AdminNote>
            )}
          </>
        )}
      </Container>

      {/* Bottom nav */}
      <BottomNav>
        <NavItem $active={screen === 'home'} onClick={() => onNavigate('home')}>
          <svg viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
        </NavItem>
        <NavItem $active={screen === 'create'} onClick={() => onNavigate('create')}>
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
        </NavItem>
        <NavItem $active={false}>
          <svg viewBox="0 0 24 24"><line x1="6" y1="18" x2="6" y2="14" /><line x1="12" y1="18" x2="12" y2="10" /><line x1="18" y1="18" x2="18" y2="6" /></svg>
        </NavItem>
        <NavItem $active={screen === 'profile'} onClick={() => onNavigate('profile')}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" /></svg>
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}