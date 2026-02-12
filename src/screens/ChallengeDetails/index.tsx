import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Header,
  Title,
  Username,
  Card,
  Row,
  Divider,
  CheckboxRow,
  Footer,
  BackButton,
  JoinButton,
} from './styles';

type Props = {
  challengeId: string;
  onNavigateHome: () => void;
};

type Challenge = {
  title: string;
  description: string;
  rules: string | null;

  start_mode: 'now' | 'date';
  start_date: string | null;
  duration_days: number;

  report_mode: 'simple' | 'result';
  metric_name: string | null;

  has_goal: boolean;
  goal_value: string | null;

  has_limit: boolean;
  limit_per_day: number | null;

  has_proof: boolean;
  proof_types: string[] | null;

  has_rating: boolean;
  username: string;

  max_participants: number | null;
};

export function ChallengeDetails({ challengeId, onNavigateHome }: Props) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  const [accepted, setAccepted] = useState(false);
  const [joining, setJoining] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  const [participantsCount, setParticipantsCount] = useState(0);

  /* ================= LOAD ================= */

  useEffect(() => {
    async function load() {
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

      const { data, error } = await supabase
        .from('challenges')
        .select(`
          title,
          description,
          rules,
          start_mode,
          start_date,
          duration_days,
          report_mode,
          metric_name,
          has_goal,
          goal_value,
          has_limit,
          limit_per_day,
          has_proof,
          proof_types,
          has_rating,
          max_participants,
          users:creator_id ( username )
        `)
        .eq('id', challengeId)
        .single();

      if (error || !data) {
        console.error(error);
        setLoading(false);
        return;
      }

      setChallenge({
        title: data.title,
        description: data.description,
        rules: data.rules,
        start_mode: data.start_mode,
        start_date: data.start_date,
        duration_days: data.duration_days,
        report_mode: data.report_mode,
        metric_name: data.metric_name,
        has_goal: data.has_goal,
        goal_value: data.goal_value,
        has_limit: data.has_limit,
        limit_per_day: data.limit_per_day,
        has_proof: data.has_proof,
        proof_types: data.proof_types,
        has_rating: data.has_rating,
        max_participants: data.max_participants,
        username: data.users?.[0]?.username ?? 'unknown',
      });

      const { count } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId);

      setParticipantsCount(count ?? 0);

      if (tgUser) {
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('telegram_id', tgUser.id)
          .single();

        if (user) {
          const { data: participant } = await supabase
            .from('participants')
            .select('id')
            .eq('user_id', user.id)
            .eq('challenge_id', challengeId)
            .maybeSingle();

          if (participant) {
            setAlreadyJoined(true);
            setAccepted(true);
          }
        }
      }

      setLoading(false);
    }

    load();
  }, [challengeId]);

  if (loading || !challenge) {
    return <SafeArea />;
  }

  /* ================= LIMIT ================= */

  const limitReached =
    challenge.max_participants !== null &&
    participantsCount >= challenge.max_participants;

  /* ================= JOIN ================= */

  async function joinChallenge() {
    if (!accepted || joining || alreadyJoined || limitReached) return;

    setJoining(true);

    const tg = window.Telegram?.WebApp;
    const initData = tg?.initDataUnsafe as
      | { user?: { id: number }; start_param?: string }
      | undefined;

    const tgUser = initData?.user;
    const startParam = initData?.start_param;

    if (!tgUser) {
      setJoining(false);
      return;
    }

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .single();

    if (!user) {
      setJoining(false);
      return;
    }

    const { data: existing } = await supabase
      .from('participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .maybeSingle();

    if (existing) {
      setAlreadyJoined(true);
      setJoining(false);

      window.dispatchEvent(
        new CustomEvent('navigate-to-progress', {
          detail: {
            challengeId,
            participantId: existing.id,
          },
        })
      );
      return;
    }

    let inviteId: string | null = null;

    if (startParam?.startsWith('invite_')) {
      const code = startParam.replace('invite_', '');

      const { data: invite } = await supabase
        .from('challenge_invites')
        .select('id')
        .eq('code', code)
        .eq('challenge_id', challengeId)
        .eq('is_active', true)
        .maybeSingle();

      if (invite) inviteId = invite.id;
    }

    const { error } = await supabase
      .from('participants')
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        invite_id: inviteId,
      });

    if (error) {
      console.error('[JOIN] insert error', error);
      setJoining(false);
      return;
    }

    // 🔴 ВАЖНО: получаем participantId
    const { data: participant, error: fetchError } = await supabase
      .from('participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .single();

    if (fetchError || !participant) {
      console.error('[JOIN] fetch participant error', fetchError);
      setJoining(false);
      return;
    }

    setJoining(false);

    window.dispatchEvent(
      new CustomEvent('navigate-to-progress', {
        detail: {
          challengeId,
          participantId: participant.id,
        },
      })
    );
  }

  /* ================= UI ================= */

  return (
    <SafeArea>
      <Header>
        <Title>{challenge.title}</Title>
        <Username>@{challenge.username}</Username>
      </Header>

      <Card>
        <Row><b>Описание:</b> {challenge.description}</Row>

        {challenge.rules && (
          <>
            <Divider />
            <Row><b>Условия:</b> {challenge.rules}</Row>
          </>
        )}
      </Card>

      <Card>
        <Row>
          <b>Участники:</b>{' '}
          {challenge.max_participants !== null
            ? `${participantsCount} / ${challenge.max_participants}`
            : participantsCount}
        </Row>

        {limitReached && (
          <Row style={{ color: '#ff6b6b' }}>
            Мест больше нет
          </Row>
        )}
      </Card>

      <CheckboxRow onClick={() => setAccepted(!accepted)}>
        <input type="checkbox" checked={accepted} readOnly />
        <span>Я ознакомился с условиями</span>
      </CheckboxRow>

      <Footer>
        <BackButton onClick={onNavigateHome}>Назад</BackButton>

        <JoinButton
          disabled={!accepted || joining || alreadyJoined || limitReached}
          onClick={joinChallenge}
        >
          {alreadyJoined
            ? 'Вы участвуете'
            : limitReached
            ? 'Мест нет'
            : joining
            ? 'Подключение…'
            : 'Присоединиться'}
        </JoinButton>
      </Footer>
    </SafeArea>
  );
}
