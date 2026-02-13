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
  goal_value: number | null;

  has_limit: boolean;
  limit_per_day: number | null;

  has_proof: boolean;
  proof_types: string[] | null;

  has_rating: boolean;
  username: string;

  max_participants: number | null;
  chat_link: string | null;
};

type Prize = {
  place: number;
  title: string;
  description: string | null;
};

export function ChallengeDetails({ challengeId, onNavigateHome }: Props) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);

  const [accepted, setAccepted] = useState(false);
  const [joining, setJoining] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  const [participantsCount, setParticipantsCount] = useState(0);

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
          chat_link,
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
        chat_link: data.chat_link,
        username: data.users?.[0]?.username ?? 'unknown',
      });

      // 🔹 Награды
      if (data.has_rating) {
        const { data: prizesData } = await supabase
          .from('challenge_prizes')
          .select('place, title, description')
          .eq('challenge_id', challengeId)
          .order('place', { ascending: true });

        setPrizes(prizesData || []);
      }

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

  const limitReached =
    challenge.max_participants !== null &&
    participantsCount >= challenge.max_participants;

  async function joinChallenge() {
    if (!accepted || joining || alreadyJoined || limitReached) return;
    setJoining(true);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
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
          detail: { challengeId, participantId: existing.id },
        })
      );
      return;
    }

    await supabase.from('participants').insert({
      user_id: user.id,
      challenge_id: challengeId,
    });

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
          detail: { challengeId, participantId: participant.id },
        })
      );
    }
  }

  return (
    <SafeArea>
      <Header>
        <Title>{challenge.title}</Title>
        <Username>@{challenge.username}</Username>
      </Header>

      {/* Описание */}
      <Card>
        <Row><b>Описание:</b> {challenge.description}</Row>
        {challenge.rules && (
          <>
            <Divider />
            <Row><b>Условия:</b> {challenge.rules}</Row>
          </>
        )}
      </Card>

      {/* Сроки */}
      <Card>
        <Row>
          <b>Старт:</b>{' '}
          {challenge.start_mode === 'now'
            ? 'Сразу после публикации'
            : challenge.start_date}
        </Row>
        <Divider />
        <Row><b>Длительность:</b> {challenge.duration_days} дней</Row>
      </Card>

      {/* Формат */}
      <Card>
        <Row>
          <b>Формат:</b>{' '}
          {challenge.report_mode === 'simple'
            ? 'Ежедневная отметка'
            : `Результат (${challenge.metric_name})`}
        </Row>

        {challenge.has_goal && (
          <>
            <Divider />
            <Row>
              <b>Цель:</b> {challenge.goal_value} {challenge.metric_name}
            </Row>
          </>
        )}

        {challenge.has_limit && (
          <>
            <Divider />
            <Row><b>Лимит:</b> {challenge.limit_per_day} в день</Row>
          </>
        )}

        {challenge.has_proof && challenge.proof_types && (
          <>
            <Divider />
            <Row>
              <b>Подтверждение:</b> {challenge.proof_types.join(', ')}
            </Row>
          </>
        )}
      </Card>

      {/* Награды */}
      {challenge.has_rating && prizes.length > 0 && (
        <Card>
          <Row><b>Награды:</b></Row>

          {prizes.map((prize, index) => (
            <div key={prize.place}>
              {index > 0 && <Divider />}
              <Row>
                <b>
                  {prize.place === 1 && '🥇'}
                  {prize.place === 2 && '🥈'}
                  {prize.place === 3 && '🥉'}
                  {prize.place > 3 && `#${prize.place}`} место:
                </b>{' '}
                {prize.title}
              </Row>
              {prize.description && (
                <Row style={{ opacity: 0.7 }}>
                  {prize.description}
                </Row>
              )}
            </div>
          ))}
        </Card>
      )}

      {/* Участники */}
      <Card>
        <Row>
          <b>Участники:</b>{' '}
          {challenge.max_participants !== null
            ? `${participantsCount} / ${challenge.max_participants}`
            : participantsCount}
        </Row>

        {limitReached && (
          <Row style={{ color: '#ff6b6b' }}>Мест больше нет</Row>
        )}
      </Card>

      {/* Чат */}
      {challenge.chat_link && (
        <Card>
          <Row><b>Чат вызова:</b></Row>
          <JoinButton onClick={() => window.open(challenge.chat_link!, '_blank')}>
            Перейти в чат
          </JoinButton>
        </Card>
      )}

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
