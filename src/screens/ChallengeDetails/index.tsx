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
  onBack: () => void;
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

export function ChallengeDetails({ challengeId, onBack }: Props) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);

  const [joining, setJoining] = useState(false);


  useEffect(() => {
    async function load() {
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

      setLoading(false);
    }

    load();
  }, [challengeId]);

  if (loading || !challenge) {
    return <SafeArea />;
  }

  async function joinChallenge() {
  if (!accepted || joining) return;
  setJoining(true);

  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!tgUser) {
    alert('Нет пользователя Telegram');
    setJoining(false);
    return;
  }

  // 1. получаем user.id
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('telegram_id', tgUser.id)
    .single();

  if (!user) {
    alert('Пользователь не найден');
    setJoining(false);
    return;
  }

  // 2. создаём participant
  const { error } = await supabase
    .from('participants')
    .insert({
      user_id: user.id,
      challenge_id: challengeId,
    });

  if (error) {
    alert(error.message);
    setJoining(false);
    return;
  }

  // 3. возвращаемся на Home
  onBack();
}


  /* ===== ВСПОМОГАТЕЛЬНАЯ ЛОГИКА ===== */

  const now = new Date();

  const startDate =
    challenge.start_mode === 'date' && challenge.start_date
      ? new Date(challenge.start_date)
      : null;

  const endDate =
    startDate
      ? new Date(
          startDate.getTime() +
            challenge.duration_days * 24 * 60 * 60 * 1000
        )
      : null;

  const status =
    startDate && startDate > now
      ? 'Скоро'
      : endDate && endDate < now
      ? 'Завершён'
      : 'Идёт';

  const startDateLabel =
    startDate &&
    startDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const reportExplanation =
    challenge.report_mode === 'simple'
      ? 'Каждый день нужно отметить выполнение'
      : 'Каждый день вводится число, результат суммируется';

  return (
    <SafeArea>
      {/* HEADER */}
      <Header>
        <Title>{challenge.title}</Title>
        <Username>@{challenge.username}</Username>
      </Header>

      {/* ОПИСАНИЕ */}
      <Card>
        <Row><b>Описание:</b> {challenge.description}</Row>

        {challenge.rules && (
          <>
            <Divider />
            <Row><b>Условия:</b> {challenge.rules}</Row>
          </>
        )}
      </Card>

      {/* ПАРАМЕТРЫ */}
      <Card>
        <Row><b>Статус:</b> {status}</Row>

        {startDateLabel && (
          <Row><b>Старт:</b> {startDateLabel}</Row>
        )}

        <Divider />

        <Row>
          <b>Тип отчёта:</b>{' '}
          {challenge.report_mode === 'simple'
            ? 'Отметка выполнения'
            : `Результат (${challenge.metric_name})`}
        </Row>

        <Row>{reportExplanation}</Row>

        <Divider />

        <Row>
          <b>Длительность:</b> {challenge.duration_days} дней
        </Row>

        {challenge.has_goal && (
          <Row><b>Цель:</b> {challenge.goal_value}</Row>
        )}

        {challenge.has_limit && (
          <Row><b>Лимит в день:</b> {challenge.limit_per_day}</Row>
        )}

        {challenge.has_proof && (
          <Row>
            <b>Подтверждение:</b>{' '}
            {challenge.proof_types?.join(', ')}
          </Row>
        )}

        <Row>
          <b>Рейтинг:</b>{' '}
          {challenge.has_rating ? 'Есть' : 'Нет'}
        </Row>
      </Card>

      {/* CHECK */}
      <CheckboxRow onClick={() => setAccepted(!accepted)}>
        <input type="checkbox" checked={accepted} readOnly />
        <span>Я ознакомился с условиями</span>
      </CheckboxRow>

      {/* FOOTER */}
      <Footer>
        <BackButton onClick={onBack}>Назад</BackButton>
        <JoinButton
  disabled={!accepted || joining}
  onClick={joinChallenge}
>
  {joining ? 'Подключение…' : 'Присоединиться'}
</JoinButton>

      </Footer>
    </SafeArea>
  );
}
