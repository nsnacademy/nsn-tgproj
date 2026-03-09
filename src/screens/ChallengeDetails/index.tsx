import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Header,
  Title,
  Username,
  Content,
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

  /* ================= LOAD ================= */

  useEffect(() => {
    // 🔗 обработка start_param из Telegram
    const initData = window.Telegram?.WebApp?.initDataUnsafe as
      | { start_param?: string }
      | undefined;

    const startParam = initData?.start_param;

    // Проверяем только challenge_ ссылки, invite_ обрабатываются где-то еще
    if (startParam?.startsWith('challenge_')) {
      const idFromLink = startParam.replace('challenge_', '');

      if (idFromLink && idFromLink !== challengeId) {
        window.dispatchEvent(
          new CustomEvent('navigate-to-challenge', {
            detail: { challengeId: idFromLink },
          })
        );
        return; // ⛔ важно: НЕ грузим текущий challenge
      }
    }

    // 🔗 обработка invite ссылок
    if (startParam?.startsWith('invite_')) {
      const inviteCode = startParam.replace('invite_', '');
      
      // Загружаем инвайт асинхронно
      loadInvite(inviteCode);
      return; // ⛔ ждем результата loadInvite
    }

    async function loadInvite(code: string) {
      const { data } = await supabase
        .from('challenge_invites')
        .select('challenge_id')
        .eq('code', code)
        .single();

      if (!data) return;

      // Если полученный challenge_id отличается от текущего - навигируем
      if (data.challenge_id !== challengeId) {
        window.dispatchEvent(
          new CustomEvent('navigate-to-challenge', {
            detail: { challengeId: data.challenge_id },
          })
        );
      }
    }

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

      const creator = data.users as unknown as { username: string } | null;

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
        username: creator?.username ?? 'unknown',
      });

      /* === Награды === */
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

    // Запускаем загрузку только если нет редиректа
    if (!startParam?.startsWith('challenge_') && !startParam?.startsWith('invite_')) {
      load();
    } else if (startParam?.startsWith('invite_')) {
      // Для invite запускаем loadInvite, но не load, так как это вызовет редирект
      const inviteCode = startParam.replace('invite_', '');
      loadInvite(inviteCode);
    }
    // Для challenge_ редирект уже произошел выше, load не вызываем
  }, [challengeId]);

  if (loading || !challenge) {
    return <SafeArea />;
  }

  const limitReached =
    challenge.max_participants !== null &&
    participantsCount >= challenge.max_participants;

  /* ================= JOIN ================= */

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

  /* ================= UI ================= */

  return (
    <SafeArea>
      {/* HEADER */}
      <Header>
        <Title>{challenge.title}</Title>
        <Username>@{challenge.username}</Username>
      </Header>

      {/* CONTENT */}
      <Content>
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
            <b>Старт:</b>{' '}
            {challenge.start_mode === 'now'
              ? 'Сразу после публикации'
              : challenge.start_date}
          </Row>
          <Divider />
          <Row><b>Длительность:</b> {challenge.duration_days} дней</Row>
        </Card>

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
              </div>
            ))}
          </Card>
        )}

        <Card>
          <Row>
            <b>Участники:</b>{' '}
            {challenge.max_participants !== null
              ? `${participantsCount} / ${challenge.max_participants}`
              : participantsCount}
          </Row>
        </Card>

        {/* ✅ ЧАТ — ТОЛЬКО ИНФО */}
        <Card>
          <Row><b>Чат вызова:</b></Row>
          <Row style={{ opacity: 0.7 }}>
            {challenge.chat_link
              ? 'Чат вызова есть. Он появится после присоединения.'
              : 'Чат для этого вызова не создан.'}
          </Row>
        </Card>

        <CheckboxRow onClick={() => setAccepted(!accepted)}>
          <input type="checkbox" checked={accepted} readOnly />
          <span>Я ознакомился с условиями</span>
        </CheckboxRow>
      </Content>

      {/* FOOTER */}
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