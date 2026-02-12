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
};

export function ChallengeDetails({ challengeId, onNavigateHome }: Props) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  const [accepted, setAccepted] = useState(false);
  const [joining, setJoining] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  // 🔥 НОВОЕ
  const [participantsCount, setParticipantsCount] = useState(0);

  /* ================= LOAD ================= */

  useEffect(() => {
    async function load() {
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

      // 1️⃣ грузим челлендж
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
        username: data.users?.[0]?.username ?? 'unknown',
      });

      // 2️⃣ считаем участников (ГЛОБАЛЬНО ДЛЯ ЧЕЛЛЕНДЖА)
      const { count } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId);

      setParticipantsCount(count ?? 0);

      // 3️⃣ проверка: уже участвует?
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

  /* ================= JOIN ================= */

  const limitReached =
    challenge.has_limit &&
    challenge.limit_per_day !== null &&
    participantsCount >= challenge.limit_per_day;

  async function joinChallenge() {
    if (!accepted || joining || alreadyJoined || limitReached) return;

    setJoining(true);

    const tg = window.Telegram?.WebApp;
    const initData = tg?.initDataUnsafe as {
      user?: { id: number };
      start_param?: string;
    };

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

    // если уже есть
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

    // invite_id если пришёл по ссылке
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
      console.error(error);
      setJoining(false);
      return;
    }

    const { data: participant } = await supabase
      .from('participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .single();

    setJoining(false);

    if (participant) {
      window.dispatchEvent(
        new CustomEvent('navigate-to-progress', {
          detail: {
            challengeId,
            participantId: participant.id,
          },
        })
      );
    }
  }

  /* ================= RENDER ================= */

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
        <Row><b>Участники:</b>{' '}
          {challenge.has_limit && challenge.limit_per_day
            ? `${participantsCount} / ${challenge.limit_per_day}`
            : participantsCount}
        </Row>

        {limitReached && (
          <Row style={{ color: '#ff4d4f' }}>
            Лимит участников достигнут
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
