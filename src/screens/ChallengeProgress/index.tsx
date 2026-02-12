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
  PrizeOverlay,
  PrizeCard,
  PrizeHeader,
  PrizeTitle,
  PrizeClose,
  PrizeContent,
  PrizeIcon,
  PrizeInfo,
  PrizeName,
  PrizeDescription,
  PrizePlace,
  PrizePlaceBadge,
  PrizeUser,
  PrizeStats,
  PrizeStat,
  PrizeStatValue,
  PrizeStatLabel,
} from './styles';

type Props = {
  challengeId: string;
  participantId: string;
  onBack: () => void;
  onOpenReport: (data: {
    challengeId: string;
    participantId: string;
    reportDate: string;
    reportMode: 'simple' | 'result';
    metricName: string | null;
  }) => void;
};



type ChallengeData = {
  title: string;
  rules: string | null;
  report_mode: 'simple' | 'result';
  metric_name: string | null;

  has_proof: boolean;
  proof_types: string[] | null;

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
  prize_description?: string | null;
};

export default function ChallengeProgress({
  challengeId,
  participantId,
  onBack,
  onOpenReport,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [challengeFinished, setChallengeFinished] = useState(false);
  const [userCompleted, setUserCompleted] = useState(false);

  const [challenge, setChallenge] = useState<ChallengeData | null>(null);

  const [currentDay, setCurrentDay] = useState(1);
  const [doneDays, setDoneDays] = useState(0);

  const [totalValue, setTotalValue] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(0);

  const [rating, setRating] = useState<RatingRow[]>([]);
  const [myPlace, setMyPlace] = useState<number | null>(null);
  const [valueToPrize, setValueToPrize] = useState<number | null>(null);

  const [todayStatus, setTodayStatus] =
  useState<'none' | 'pending' | 'approved' | 'rejected'>('none');

  const [reportDate, setReportDate] = useState<string>(''); // ✅ ДОБАВИТЬ

 


  const [rejectionReason, setRejectionReason] =
  useState<string | null>(null);


  const [remainingDays, setRemainingDays] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<RatingRow | null>(null);
  const [showPrize, setShowPrize] = useState(false);

  async function load() {
    setLoading(true);

    const { data: challengeData } = await supabase
  .from('challenges')
  .select(`
    title,
    rules,
    report_mode,
    metric_name,
    has_proof,
    proof_types,
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

    const { data: participant } = await supabase
  .from('participants')
  .select('challenge_finished, user_completed')
  .eq('id', participantId)
  .single();

if (participant) {
  setChallengeFinished(participant.challenge_finished);
  setUserCompleted(participant.user_completed);
}


    const { count } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId);

    setParticipantsCount(count || 0);

    const { data: reports } = await supabase
  .from('reports')
  .select('id, value, is_done, report_date, status, rejection_reason')
  .eq('participant_id', participantId)
  .eq('challenge_id', challengeId);



    



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

    // ⬇️ ВАЖНО: используем calculatedDay, а НЕ currentDay
const reportDayDate = new Date(challengeData.start_at);
reportDayDate.setDate(
  reportDayDate.getDate() + (calculatedDay - 1)
);

const reportDate = reportDayDate
  .toISOString()
  .slice(0, 10);

  setReportDate(reportDate); // ✅ ВАЖНО


const todayReport = reports?.find(
  r => r.report_date === reportDate
);

console.log('[PROGRESS] calculatedDay:', calculatedDay);
console.log('[PROGRESS] reportDate:', reportDate);
console.log('[PROGRESS] todayReport:', todayReport);



if (!todayReport) {
  setTodayStatus('none');
  setRejectionReason(null);
} else if (todayReport.status === 'pending') {
  setTodayStatus('pending');
  setRejectionReason(null);
} else if (todayReport.status === 'approved') {
  setTodayStatus('approved');
  setRejectionReason(null);
} else if (todayReport.status === 'rejected') {
  setTodayStatus('rejected');
  setRejectionReason(todayReport.rejection_reason || null);
}


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
}, [challengeId, participantId]);


  const handlePrizeClick = (user: RatingRow) => {
    setSelectedPrize(user);
    setShowPrize(true);
  };

  const closePrize = () => {
    setShowPrize(false);
    setTimeout(() => setSelectedPrize(null), 300);
  };

  if (loading) {
    return (
      <SafeArea>
        <Header>
          <BackButton onClick={onBack}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
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
          <BackButton onClick={onBack}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
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

  

  const getProgressText = () => {
    if (challenge.report_mode === 'result') {
      return `${totalValue} из ${challenge.goal_value} ${challenge.metric_name || ''}`;
    }
    return `${doneDays} из ${challenge.duration_days} дней`;
  };

  const getPrizeIcon = (place: number) => {
    switch(place) {
      case 1: return (
        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="24" cy="24" r="22" stroke="#FFD700" />
          <path d="M12 24l8 8 12-16" stroke="#FFD700" />
        </svg>
      );
      case 2: return (
        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="24" cy="24" r="22" stroke="#C0C0C0" />
          <path d="M12 24l8 8 12-16" stroke="#C0C0C0" />
        </svg>
      );
      case 3: return (
        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="24" cy="24" r="22" stroke="#CD7F32" />
          <path d="M12 24l8 8 12-16" stroke="#CD7F32" />
        </svg>
      );
      default: return (
        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="24" cy="24" r="22" />
          <path d="M12 24l8 8 12-16" />
        </svg>
      );
    }
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
              
              {!challengeFinished && (
  <TodayStatus>
    <StatusBadge $status={todayStatus}>
      {todayStatus === 'none' && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="7" />
            <path d="M8 4v4l2 2" />
          </svg>
          Сегодня не отмечено
        </span>
      )}

      {todayStatus === 'pending' && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="7" />
            <path d="M8 4v4l2 2" />
          </svg>
          Ожидает проверки
        </span>
      )}

      {todayStatus === 'approved' && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="7" />
            <path d="M6 9l2 2 4-4" />
          </svg>
          Сегодня выполнено
        </span>
      )}

      {todayStatus === 'rejected' && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="7" />
            <path d="M5 5l6 6M11 5l-6 6" />
          </svg>
          Отчёт отклонён
        </span>
      )}
    </StatusBadge>

    {todayStatus === 'rejected' && rejectionReason && (
      <div
        style={{
          marginTop: 10,
          padding: 12,
          borderRadius: 12,
          background: 'rgba(255, 80, 80, 0.12)',
          color: '#ff6b6b',
          fontSize: 14,
          lineHeight: 1.4,
        }}
      >
        <strong>Причина отклонения:</strong><br />
        {rejectionReason}
      </div>
    )}
  </TodayStatus>
)}


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
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="2" width="14" height="14" rx="2" />
                        <line x1="8" y1="2" x2="8" y2="16" />
                        <line x1="2" y1="8" x2="16" y2="8" />
                      </svg>
                    </span>
                    Не более {challenge.limit_per_day} отчёта в день
                  </ConditionItem>
                )}
                {challenge.report_mode === 'result' && challenge.has_goal && (
                  <ConditionItem>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="9" cy="9" r="7" />
                        <path d="M9 6v6" />
                        <path d="M6 9h6" />
                      </svg>
                    </span>
                    Цель: {challenge.goal_value} {challenge.metric_name}
                  </ConditionItem>
                )}
                <ConditionItem>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="14" height="14" rx="2" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="3" y1="10" x2="17" y2="10" />
                      <line x1="10" y1="14" x2="14" y2="14" />
                    </svg>
                  </span>
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
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="8" cy="6" r="3" />
                    <path d="M2 14c1.5-2 3.5-3 6-3s4.5 1 6 3" />
                  </svg>
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
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 2v10M2 7h10" />
                        </svg>
                        Ваше место: <strong>#{myPlace}</strong>
                      </span>
                    </RatingSubtitle>
                  )}
                </div>
                {valueToPrize !== null && valueToPrize > 0 && (
                  <span style={{ fontSize: '12px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12,2 22,12 2,12" transform="translate(-1,-1) scale(0.5)" />
                    </svg>
                    До приза: +{valueToPrize}
                  </span>
                )}
              </RatingHeader>

              <RatingList>
                {rating.slice(0, 5).map(r => (
                  <RatingItem 
                    key={r.place} 
                    $highlight={r.place === myPlace}
                    onClick={() => handlePrizeClick(r)}
                    $clickable={!!r.prize_title}
                  >
                    <RatingPlace>
                      <PlaceBadge $place={r.place}>
                        {r.place}
                        {r.prize_title && (
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}>
                            <polygon points="12,2 22,12 2,12" transform="translate(-1,-1) scale(0.5)" />
                          </svg>
                        )}
                      </PlaceBadge>
                    </RatingPlace>
                    
                    <RatingUser>
                      {r.username}
                      {r.place === myPlace && (
                        <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="5" cy="5" r="4" />
                            <path d="M3 5l1.5 1.5L7 3" />
                          </svg>
                          Вы
                        </span>
                      )}
                    </RatingUser>
                    
                    <RatingValue>
                      {r.value} {challenge.metric_name || ''}
                      {r.prize_title && (
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '6px', opacity: 0.5 }}>
                          <path d="M6 3v6M3 6h6" />
                        </svg>
                      )}
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
  {challengeFinished ? (
    // 🏁 ВЫЗОВ ЗАВЕРШЁН
    <DisabledButton>
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="10" cy="10" r="8" />
          <path d="M6 10l3 3 5-5" />
        </svg>
        {userCompleted ? 'Вызов успешно завершён' : 'Вызов завершён'}
      </span>
    </DisabledButton>
  ) : todayStatus === 'none' || todayStatus === 'rejected' ? (
    // ▶️ МОЖНО ОТПРАВЛЯТЬ ОТЧЁТ
    <PrimaryButton
      $variant={challenge.report_mode}
      onClick={() =>
        onOpenReport({
          challengeId,
          participantId,
          reportDate,
          reportMode: challenge.report_mode,
          metricName: challenge.metric_name,
        })
      }
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {challenge.report_mode === 'result' ? (
          <>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="14" height="14" rx="2" />
              <line x1="8" y1="3" x2="8" y2="17" />
            </svg>
            Добавить результат
          </>
        ) : (
          <>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="10" cy="10" r="8" />
              <path d="M6 10l2 2 4-4" />
            </svg>
            Отметить выполнение
          </>
        )}
      </span>
    </PrimaryButton>
  ) : todayStatus === 'pending' ? (
    // ⏳ НА ПРОВЕРКЕ
    <DisabledButton>
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="10" cy="10" r="8" />
          <path d="M10 6v4l2 2" />
        </svg>
        Ожидает проверки
      </span>
    </DisabledButton>
  ) : (
    // ✅ СЕГОДНЯ ВЫПОЛНЕНО
    <DisabledButton>
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="10" cy="10" r="8" />
          <path d="M6 10l3 3 5-5" />
        </svg>
        Сегодня выполнено
      </span>
    </DisabledButton>
  )}
</ActionBlock>


      {/* Оверлей с наградой */}
      {showPrize && selectedPrize && (
        <PrizeOverlay $show={showPrize} onClick={closePrize}>
          <PrizeCard onClick={(e) => e.stopPropagation()}>
            <PrizeHeader>
              <PrizeTitle>Награда</PrizeTitle>
              <PrizeClose onClick={closePrize}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </PrizeClose>
            </PrizeHeader>
            
            <PrizeContent>
              <PrizeIcon>
                {getPrizeIcon(selectedPrize.place)}
              </PrizeIcon>
              
              <PrizeInfo>
                <PrizePlace>
                  <PrizePlaceBadge $place={selectedPrize.place}>
                    Место #{selectedPrize.place}
                  </PrizePlaceBadge>
                </PrizePlace>
                
                <PrizeUser>{selectedPrize.username}</PrizeUser>
                
                <PrizeName>
                  {selectedPrize.prize_title || `Награда за ${selectedPrize.place} место`}
                </PrizeName>
                
                <PrizeDescription>
                  {selectedPrize.prize_description || `Поздравляем с ${selectedPrize.place} местом в рейтинге!`}
                </PrizeDescription>
                
                <PrizeStats>
                  <PrizeStat>
                    <PrizeStatValue>{selectedPrize.value}</PrizeStatValue>
                    <PrizeStatLabel>Результат</PrizeStatLabel>
                  </PrizeStat>
                  
                  <PrizeStat>
                    <PrizeStatValue>#{selectedPrize.place}</PrizeStatValue>
                    <PrizeStatLabel>Место</PrizeStatLabel>
                  </PrizeStat>
                  
                  <PrizeStat>
                    <PrizeStatValue>
                      {selectedPrize.place === 1 ? '🥇' : 
                       selectedPrize.place === 2 ? '🥈' : 
                       selectedPrize.place === 3 ? '🥉' : '🏅'}
                    </PrizeStatValue>
                    <PrizeStatLabel>Тип награды</PrizeStatLabel>
                  </PrizeStat>
                </PrizeStats>
              </PrizeInfo>
            </PrizeContent>
          </PrizeCard>
        </PrizeOverlay>
      )}
    </SafeArea>
  );
}