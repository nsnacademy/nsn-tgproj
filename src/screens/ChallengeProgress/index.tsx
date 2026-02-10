import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Header,
  BackButton,
  HeaderTitle,
  HeaderRight,
  RatingBadge,
  Content,
  ProgressCard,
  ProgressInfo,
  ProgressStats,
  StatItem,
  StatValue,
  StatLabel,
  ProgressSection,
  ProgressBarWrapper,
  ProgressBar,
  ProgressFill,
  ProgressText,
  ProgressPercentage,
  Section,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  ConditionList,
  ConditionItem,
  ParticipantsSection,
  ParticipantCount,
  ParticipantAvatars,
  Avatar,
  RatingSection,
  RatingHeader,
  RatingTitle,
  RatingSubtitle,
  RatingList,
  RatingItem,
  RatingPlace,
  PlaceBadge,
  RatingUser,
  RatingValue,
  ActionBlock,
  PrimaryButton,
  DisabledButton,
  LoadingState,
  TodayStatus,
  StatusBadge,
  ChallengeRules,
  RulesContent,
} from './styles';

type Props = {
  challengeId: string;
  participantId: string;
  onBack: () => void;
  onOpenReport: (data: {
    challengeId: string;
    participantId: string;
    reportMode: 'simple' | 'result';
    metricName?: string | null;
  }) => void;
};

type ChallengeData = {
  title: string;
  rules: string | null;
  report_mode: 'simple' | 'result';
  metric_name: string | null;
  has_goal: boolean;
  goal_value: number | null;
  has_limit: boolean;
  limit_per_day: number | null;
  has_rating: boolean;
  duration_days: number;
  start_at: string;
};

type RatingRow = {
  place: number;
  username: string;
  value: number;
  prize_title?: string | null;
};

export default function ChallengeProgress({
  challengeId,
  participantId,
  onBack,
  onOpenReport,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);

  const [currentDay, setCurrentDay] = useState(1);
  const [doneDays, setDoneDays] = useState(0);

  const [totalValue, setTotalValue] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(0);

  const [rating, setRating] = useState<RatingRow[]>([]);
  const [myPlace, setMyPlace] = useState<number | null>(null);
  const [valueToPrize, setValueToPrize] = useState<number | null>(null);

  const [todayStatus, setTodayStatus] =
    useState<'none' | 'pending' | 'approved'>('none');

  const [remainingDays, setRemainingDays] = useState(0);

  async function load() {
    setLoading(true);

    const { data: challengeData } = await supabase
      .from('challenges')
      .select(`
        title,
        rules,
        report_mode,
        metric_name,
        has_goal,
        goal_value,
        has_limit,
        limit_per_day,
        has_rating,
        duration_days,
        start_at
      `)
      .eq('id', challengeId)
      .single();

    if (!challengeData) {
      setLoading(false);
      return;
    }

    setChallenge(challengeData);

    const { count } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId);

    setParticipantsCount(count || 0);

    const { data: reports } = await supabase
      .from('reports')
      .select('value, is_done, report_date, status')
      .eq('participant_id', participantId)
      .eq('challenge_id', challengeId);

    const todayDate = new Date().toISOString().slice(0, 10);
    const todayReport = reports?.find(
      r => r.report_date === todayDate
    );

    if (!todayReport) {
      setTodayStatus('none');
    } else if (todayReport.status === 'pending') {
      setTodayStatus('pending');
    } else if (todayReport.status === 'approved') {
      setTodayStatus('approved');
    }

    const approvedReports =
      reports?.filter(r => r.status === 'approved') || [];

    const done = approvedReports.filter(r => r.is_done);
    const total = approvedReports.reduce(
      (acc, r) => acc + Number(r.value || 0),
      0
    );

    setDoneDays(done.length);
    setTotalValue(total);

    const start = new Date(challengeData.start_at);
    const today = new Date();

    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const calculatedDay = Math.min(
      challengeData.duration_days,
      Math.max(1, diffDays + 1)
    );

    setCurrentDay(calculatedDay);
    setRemainingDays(Math.max(0, challengeData.duration_days - calculatedDay));

    if (challengeData.has_rating) {
      const { data, error } = await supabase.rpc(
        'get_challenge_progress',
        {
          p_challenge_id: challengeId,
          p_participant_id: participantId,
        }
      );

      if (!error && data) {
        setRating(data.rating || []);
        setMyPlace(data.me?.place ?? null);
        setValueToPrize(data.me?.value_to_prize ?? null);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <SafeArea>
        <Header>
          <BackButton onClick={onBack}>←</BackButton>
          <HeaderTitle>Загрузка...</HeaderTitle>
        </Header>
        <Content>
          <LoadingState>Загрузка данных...</LoadingState>
        </Content>
      </SafeArea>
    );
  }

  if (!challenge) {
    return (
      <SafeArea>
        <Header>
          <BackButton onClick={onBack}>←</BackButton>
          <HeaderTitle>Вызов не найден</HeaderTitle>
        </Header>
        <Content>
          <LoadingState>Вызов не найден</LoadingState>
        </Content>
      </SafeArea>
    );
  }

  const progressPercent =
    challenge.report_mode === 'result' && challenge.has_goal
      ? Math.min(
          100,
          Math.round(
            (totalValue / (challenge.goal_value || 1)) * 100
          )
        )
      : Math.min(
          100,
          Math.round(
            (doneDays / challenge.duration_days) * 100
          )
        );

  const challengeType = challenge.report_mode === 'result' 
    ? 'Целевой вызов' 
    : 'Ежедневный вызов';

  const getButtonText = () => {
    if (todayStatus === 'approved') return 'Уже выполнено сегодня';
    if (challenge.report_mode === 'result') return 'Добавить результат';
    return 'Отметить день';
  };

  const getProgressText = () => {
    if (challenge.report_mode === 'result') {
      return `${totalValue} из ${challenge.goal_value} ${challenge.metric_name || ''}`;
    }
    return `${doneDays} из ${challenge.duration_days} дней`;
  };

  return (
    <SafeArea>
       <Header>
      <BackButton onClick={onBack}>
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </BackButton>
      <HeaderTitle>{challenge.title}</HeaderTitle>
      <HeaderRight>
        {challenge.has_rating && (
          <RatingBadge $highlight={!!myPlace && myPlace <= 3}>
  {myPlace ? `#${myPlace}` : 'Рейтинг'}
</RatingBadge>

        )}
      </HeaderRight>
    </Header>

      <Content>
        {/* Прогресс-карточка */}
        <ProgressCard>
          <ProgressInfo>
            <ProgressStats>
              <StatItem>
                <StatValue>{currentDay}</StatValue>
                <StatLabel>Текущий день</StatLabel>
              </StatItem>
              
              <StatItem>
                <StatValue>
                  {challenge.report_mode === 'result' 
                    ? challenge.has_goal 
                      ? challenge.goal_value 
                      : '—'
                    : challenge.duration_days}
                </StatValue>
                <StatLabel>
                  {challenge.report_mode === 'result' 
                    ? 'Цель' 
                    : 'Всего дней'}
                </StatLabel>
              </StatItem>
              
              <StatItem>
                <StatValue>{remainingDays}</StatValue>
                <StatLabel>Осталось дней</StatLabel>
              </StatItem>
            </ProgressStats>

            <ProgressSection>
              <ProgressBarWrapper>
                <ProgressBar>
                  <ProgressFill 
                    style={{ 
                      width: `${progressPercent}%`,
                      background: progressPercent === 100 
                        ? 'linear-gradient(90deg, #4CAF50, #45a049)' 
                        : 'linear-gradient(90deg, #fff, rgba(255,255,255,0.9))'
                    }} 
                  />
                </ProgressBar>
                <ProgressPercentage>{progressPercent}%</ProgressPercentage>
              </ProgressBarWrapper>
              
              <ProgressText>{getProgressText()}</ProgressText>
              
              <TodayStatus>
                <StatusBadge $status={todayStatus}>
                  {todayStatus === 'none' && '💭 Сегодня не отмечено'}
                  {todayStatus === 'pending' && '⏳ Ожидает проверки'}
                  {todayStatus === 'approved' && '✅ Сегодня выполнено'}
                </StatusBadge>
              </TodayStatus>
            </ProgressSection>
          </ProgressInfo>
        </ProgressCard>

        {/* Правила и условия */}
        {(challenge.rules || challenge.has_limit) && (
          <Section>
            <SectionHeader>
              <SectionTitle>Правила вызова</SectionTitle>
              <SectionSubtitle>{challengeType}</SectionSubtitle>
            </SectionHeader>
            
            <ChallengeRules>
              {challenge.rules && (
                <RulesContent>{challenge.rules}</RulesContent>
              )}
              
              <ConditionList>
                {challenge.has_limit && (
                  <ConditionItem>
                    <span>📊</span>
                    Не более {challenge.limit_per_day} отчёта в день
                  </ConditionItem>
                )}
                {challenge.report_mode === 'result' && challenge.has_goal && (
                  <ConditionItem>
                    <span>🎯</span>
                    Цель: {challenge.goal_value} {challenge.metric_name}
                  </ConditionItem>
                )}
                <ConditionItem>
                  <span>📅</span>
                  Длительность: {challenge.duration_days} дней
                </ConditionItem>
              </ConditionList>
            </ChallengeRules>
          </Section>
        )}

        {/* Участники */}
        <Section>
          <SectionHeader>
            <SectionTitle>Участники</SectionTitle>
            <SectionSubtitle>{participantsCount} человек</SectionSubtitle>
          </SectionHeader>
          
          <ParticipantsSection>
            <ParticipantAvatars>
              {Array.from({ length: Math.min(5, participantsCount) }).map((_, i) => (
                <Avatar key={i} style={{ marginLeft: i > 0 ? '-8px' : '0' }}>
                  👤
                </Avatar>
              ))}
            </ParticipantAvatars>
            <ParticipantCount>
              {participantsCount} участников
            </ParticipantCount>
          </ParticipantsSection>
        </Section>

        {/* Рейтинг */}
        {challenge.has_rating && rating.length > 0 && (
          <Section>
            <RatingSection>
              <RatingHeader>
                <div>
                  <RatingTitle>Рейтинг участников</RatingTitle>
                  {myPlace && (
                    <RatingSubtitle>
                      Ваше место: <strong>#{myPlace}</strong>
                    </RatingSubtitle>
                  )}
                </div>
                {valueToPrize !== null && valueToPrize > 0 && (
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>
                    До приза: +{valueToPrize}
                  </span>
                )}
              </RatingHeader>

              <RatingList>
                {rating.slice(0, 5).map(r => (
                  <RatingItem key={r.place} $highlight={r.place === myPlace}>
                    <RatingPlace>
                      <PlaceBadge $place={r.place}>
                        {r.place}
                        {r.prize_title && ' 🏆'}
                      </PlaceBadge>
                    </RatingPlace>
                    
                    <RatingUser>
                      {r.username}
                      {r.place === myPlace && <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.6 }}>Вы</span>}
                    </RatingUser>
                    
                    <RatingValue>
                      {r.value} {challenge.metric_name || ''}
                    </RatingValue>
                  </RatingItem>
                ))}
              </RatingList>
            </RatingSection>
          </Section>
        )}
      </Content>

      {/* Кнопка действия */}
      <ActionBlock>
        {todayStatus === 'none' ? (
          <PrimaryButton
            onClick={() =>
              onOpenReport({
                challengeId,
                participantId,
                reportMode: challenge.report_mode,
                metricName: challenge.metric_name,
              })
            }
            $variant={challenge.report_mode}
          >
            <span style={{ fontSize: '18px', marginRight: '8px' }}>
              {challenge.report_mode === 'result' ? '📊' : '✅'}
            </span>
            {getButtonText()}
          </PrimaryButton>
        ) : todayStatus === 'pending' ? (
          <DisabledButton>
            <span style={{ fontSize: '18px', marginRight: '8px' }}>⏳</span>
            Ожидает проверки
          </DisabledButton>
        ) : (
          <DisabledButton>
            <span style={{ fontSize: '18px', marginRight: '8px' }}>✅</span>
            Сегодня выполнено
          </DisabledButton>
        )}
      </ActionBlock>
    </SafeArea>
  );
}