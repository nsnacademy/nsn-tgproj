import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Header,
  BackButton,
  HeaderTitle,
  RatingTag,
  Content,
  ProgressBlock,
  ProgressBar,
  ProgressFill,
  ProgressMainText,
  ProgressSubText,
  Section,
  SectionTitle,
  ConditionList,
  ConditionItem,
  ParticipantsRow,
  ParticipantIcon,
  RatingList,
  RatingItem,
  ActionBlock,
  PrimaryButton,
  DisabledButton,
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
  const [todayDone, setTodayDone] = useState(false);

  const [totalValue, setTotalValue] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(0);

  const [rating, setRating] = useState<RatingRow[]>([]);
  const [myPlace, setMyPlace] = useState<number | null>(null);
  const [valueToPrize, setValueToPrize] = useState<number | null>(null);

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

    const approvedReports =
      reports?.filter(r => r.status === 'approved') || [];

    setTodayDone(!!todayReport);

    const done = approvedReports.filter(r => r.is_done);
    const total =
      approvedReports.reduce(
        (acc, r) => acc + Number(r.value || 0),
        0
      );

    setDoneDays(done.length);
    setTotalValue(total);

    const start = new Date(challengeData.start_at);
    const now = new Date();
    const day =
      Math.floor(
        (now.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    setCurrentDay(Math.max(1, day));

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

  if (loading || !challenge) return <SafeArea />;

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

  return (
    <SafeArea>
      <Header>
        <BackButton onClick={onBack}>←</BackButton>
        <HeaderTitle>{challenge.title}</HeaderTitle>
        {challenge.has_rating && <RatingTag>#rating</RatingTag>}
      </Header>

      <Content>
        <ProgressBlock>
          <ProgressBar>
            <ProgressFill style={{ width: `${progressPercent}%` }} />
          </ProgressBar>

          {challenge.report_mode === 'result' ? (
            <ProgressMainText>
              {totalValue} / {challenge.goal_value}{' '}
              {challenge.metric_name}
            </ProgressMainText>
          ) : (
            <ProgressMainText>
              Выполнено дней: {doneDays} из{' '}
              {challenge.duration_days}
            </ProgressMainText>
          )}

          <ProgressSubText>
            День {currentDay} из {challenge.duration_days}
          </ProgressSubText>
        </ProgressBlock>

        {(challenge.rules || challenge.has_limit) && (
          <Section>
            <SectionTitle>Условия</SectionTitle>
            <ConditionList>
              {challenge.rules && (
                <ConditionItem>{challenge.rules}</ConditionItem>
              )}
              {challenge.has_limit && (
                <ConditionItem>
                  Не более {challenge.limit_per_day} отчёта в день
                </ConditionItem>
              )}
            </ConditionList>
          </Section>
        )}

        <Section>
          <SectionTitle>Участие</SectionTitle>
          <ParticipantsRow>
            <ParticipantIcon>👤</ParticipantIcon>
            {participantsCount}
          </ParticipantsRow>
        </Section>

        {challenge.has_rating && rating.length > 0 && (
          <Section>
            <SectionTitle>Рейтинг</SectionTitle>
            <RatingList>
              {rating.map(r => (
                <RatingItem key={r.place}>
                  <span>
                    {r.place}. {r.username}
                    {r.prize_title && ' 🏆'}
                  </span>
                  <span>{r.value}</span>
                </RatingItem>
              ))}
            </RatingList>
          </Section>
        )}

        {challenge.has_rating &&
          myPlace &&
          valueToPrize !== null && (
            <Section>
              <ProgressSubText>
                ⬇️ До призового места: {valueToPrize}{' '}
                {challenge.metric_name}
              </ProgressSubText>
            </Section>
          )}
      </Content>

      <ActionBlock>
        {todayDone ? (
          <DisabledButton>Ожидает проверки</DisabledButton>
        ) : (
          <PrimaryButton
            onClick={() =>
              onOpenReport({
                challengeId,
                participantId,
                reportMode: challenge.report_mode,
                metricName: challenge.metric_name,
              })
            }
          >
            Перейти к отчёту
          </PrimaryButton>
        )}
      </ActionBlock>
    </SafeArea>
  );
}
