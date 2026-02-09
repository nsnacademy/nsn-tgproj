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
};

type ChallengeData = {
  title: string;
  description: string;
  rules: string | null;

  report_mode: 'simple' | 'result';
  metric_name: string | null;

  has_goal: boolean;
  goal_value: number | null;

  has_limit: boolean;
  limit_per_day: number | null;

  has_rating: boolean;
  chat_link: string | null;

  duration_days: number;
  start_at: string;
};

export default function ChallengeProgress({
  challengeId,
  participantId,
  onBack,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);

  const [currentDay, setCurrentDay] = useState(1);
  const [doneDays, setDoneDays] = useState(0);
  const [todayDone, setTodayDone] = useState(false);

  const [totalValue, setTotalValue] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(0);

  const [rating, setRating] = useState<
    { username: string; value: number }[]
  >([]);

  async function load() {
    setLoading(true);

    /* === CHALLENGE === */
    const { data: challengeData } = await supabase
      .from('challenges')
      .select(
        `
        title,
        description,
        rules,
        report_mode,
        metric_name,
        has_goal,
        goal_value,
        has_limit,
        limit_per_day,
        has_rating,
        chat_link,
        duration_days,
        start_at
      `
      )
      .eq('id', challengeId)
      .single();

    setChallenge(challengeData);

    /* === PARTICIPANTS COUNT === */
    const { count } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId);

    setParticipantsCount(count || 0);

    /* === DONE DAYS === */
    const { data: done } = await supabase
      .from('reports')
      .select('id')
      .eq('participant_id', participantId)
      .eq('is_done', true);

    setDoneDays(done?.length || 0);

    /* === TODAY === */
    const { data: today } = await supabase
      .from('reports')
      .select('is_done')
      .eq('participant_id', participantId)
      .eq('report_date', new Date().toISOString().slice(0, 10))
      .maybeSingle();

    setTodayDone(!!today?.is_done);

    /* === TOTAL VALUE (for result mode) === */
    const { data: sum } = await supabase
      .from('reports')
      .select('value')
      .eq('participant_id', participantId);

    const total =
      sum?.reduce((acc, r) => acc + Number(r.value || 0), 0) || 0;

    setTotalValue(total);

    /* === CURRENT DAY === */
    if (challengeData?.start_at) {
      const start = new Date(challengeData.start_at);
      const today = new Date();
      const day =
        Math.floor(
          (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

      setCurrentDay(Math.max(1, day));
    }

    /* === RATING === */
    if (challengeData?.has_rating) {
      const { data: ratingData } = await supabase.rpc(
        'get_challenge_rating',
        { p_challenge_id: challengeId }
      );

      setRating(
        ratingData?.map((r: any) => ({
          username: r.username,
          value: r.total_value || r.done_days,
        })) || []
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading || !challenge) {
    return <SafeArea />;
  }

  const progressPercent =
    challenge.report_mode === 'result' && challenge.has_goal
      ? Math.min(
          100,
          Math.round((totalValue / (challenge.goal_value || 1)) * 100)
        )
      : Math.min(
          100,
          Math.round((doneDays / challenge.duration_days) * 100)
        );

  return (
    <SafeArea>
      {/* HEADER */}
      <Header>
        <BackButton onClick={onBack}>←</BackButton>
        <HeaderTitle>{challenge.title}</HeaderTitle>
        {challenge.has_rating && <RatingTag>#rating</RatingTag>}
      </Header>

      <Content>
        {/* PROGRESS */}
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
              Выполнено дней: {doneDays} из {challenge.duration_days}
            </ProgressMainText>
          )}

          <ProgressSubText>
            День {currentDay} из {challenge.duration_days}
          </ProgressSubText>
        </ProgressBlock>

        {/* CONDITIONS */}
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

        {/* PARTICIPANTS */}
        <Section>
          <SectionTitle>Участие</SectionTitle>
          <ParticipantsRow>
            <ParticipantIcon>👤</ParticipantIcon>
            {participantsCount}
          </ParticipantsRow>
        </Section>

        {/* RATING */}
        {challenge.has_rating && (
          <Section>
            <SectionTitle>Рейтинг</SectionTitle>
            <RatingList>
              {rating.map((r, i) => (
                <RatingItem key={i}>
                  <span>{r.username}</span>
                  <span>{r.value}</span>
                </RatingItem>
              ))}
            </RatingList>
          </Section>
        )}
      </Content>

      {/* ACTION */}
      <ActionBlock>
        {todayDone ? (
          <DisabledButton>Отчёт отправлен</DisabledButton>
        ) : (
          <PrimaryButton>Перейти к отчёту</PrimaryButton>
        )}
      </ActionBlock>
    </SafeArea>
  );
}
