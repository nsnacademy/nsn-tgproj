import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Header,
  Title,
  SectionTitle,
  Hint,
  Form,
  Field,
  Label,
  Input,
  Textarea,
  CheckboxRow,
  OptionCard,
  Footer,
  BackButton,
  NextButton,
  RewardRow,
  AddButton,
  SummaryBox,
  SummaryRow,
} from './styles';

type Props = {
  onNavigate: (
    screen:
      | 'home'
      | 'create'
      | 'create-flow'
      | 'create-flow-free'
      | 'create-flow-paid'
  ) => void;
};

type ReportMode = 'simple' | 'result';

export function CreateFlowFree({ onNavigate }: Props) {
  /* === VIEW === */
  const [isPreview, setIsPreview] = useState(false);

  /* 🔒 ДОБАВЛЕНО: защита от повторной публикации */
  const [submitting, setSubmitting] = useState(false);

  /* === BASIC === */
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');

  /* === CHAT === */
  const [chatLink, setChatLink] = useState('');

  /* === TIMING === */
  const [startMode, setStartMode] = useState<'now' | 'date'>('now');
  const [startDate, setStartDate] = useState('');
  const [durationDays, setDurationDays] = useState('');

  /* === REPORTING === */
  const [reportMode, setReportMode] =
    useState<ReportMode>('simple');
  const [metricName, setMetricName] = useState('');
  const [hasProof, setHasProof] = useState(false);
  const [proofs, setProofs] = useState<string[]>([]);

  /* === GOAL === */
  const [hasGoal, setHasGoal] = useState(false);
  const [goalValue, setGoalValue] = useState('');

  /* === LIMITS === */
  const [hasLimit, setHasLimit] = useState(false);
  const [limitPerDay, setLimitPerDay] = useState('1');

  /* === RATING === */
  const [hasRating, setHasRating] = useState(false);
  const [rewards, setRewards] = useState([
    { place: 1, value: '' },
    { place: 2, value: '' },
    { place: 3, value: '' },
  ]);

  /* === HELPERS === */
  const toggleProof = (type: string) => {
    setProofs((prev) =>
      prev.includes(type)
        ? prev.filter((p) => p !== type)
        : [...prev, type]
    );
  };

  /* === AUTO LOGIC === */
  useEffect(() => {
    if (reportMode === 'simple') {
      setHasLimit(true);
      setLimitPerDay('1');
      setHasGoal(false);
      setGoalValue('');
      setHasProof(false);
      setProofs([]);
    }
  }, [reportMode]);

  /* === VALIDATION === */
  const reportValid =
    reportMode === 'simple' ||
    (reportMode === 'result' &&
      metricName.trim().length > 0 &&
      (!hasGoal || goalValue.trim().length > 0) &&
      (!hasProof || proofs.length > 0));

  const canContinue =
    title.trim().length > 2 &&
    description.trim().length > 5 &&
    durationDays.trim().length > 0 &&
    reportValid;

  /* ========================================================= */

  async function publishChallenge() {
    if (submitting) return; // ⛔ защита от повторного клика
    setSubmitting(true);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      alert('Telegram user not found');
      setSubmitting(false);
      return;
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .single();

    if (userError || !user) {
      console.error(userError);
      alert('User not found in database');
      setSubmitting(false);
      return;
    }

    const payload = {
      creator_id: user.id,

      title,
      description,
      rules: rules || null,

      chat_link: chatLink || null,

      start_mode: startMode,
      start_date: startMode === 'date' ? startDate : null,
      duration_days: Number(durationDays),

      report_mode: reportMode,
      metric_name: reportMode === 'result' ? metricName : null,

      has_goal: hasGoal,
      goal_value: hasGoal ? Number(goalValue) : null,

      has_proof: hasProof,
      proof_types: hasProof ? proofs : null,

      has_limit: hasLimit,
      limit_per_day: hasLimit ? Number(limitPerDay) : null,

      has_rating: hasRating,
    };

    const { data: challenge, error } = await supabase
      .from('challenges')
      .insert(payload)
      .select('id')
      .single();

    if (error || !challenge) {
      console.error(error);
      alert('Ошибка при создании вызова');
      setSubmitting(false);
      return;
    }

    const { error: participantError } = await supabase
      .from('participants')
      .insert({
        user_id: user.id,
        challenge_id: challenge.id,
      });

    if (participantError) {
      console.error(participantError);
      alert('Вызов создан, но не удалось добавить участника');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onNavigate('home');
  }

  /* ==================== PREVIEW ==================== */

  if (isPreview) {
    return (
      <SafeArea>
        <Header>
          <Title>Предпросмотр вызова</Title>
        </Header>

        <Form>
          <SectionTitle>Основная информация</SectionTitle>
          <SummaryBox>
            <SummaryRow><span>Название</span><b>{title}</b></SummaryRow>
            <SummaryRow><span>Описание</span><b>{description}</b></SummaryRow>
            {rules && (
              <SummaryRow><span>Условия</span><b>{rules}</b></SummaryRow>
            )}
          </SummaryBox>

          <SectionTitle>Сроки</SectionTitle>
          <SummaryBox>
            <SummaryRow>
              <span>Старт</span>
              <b>{startMode === 'now' ? 'Сразу' : startDate}</b>
            </SummaryRow>
            <SummaryRow>
              <span>Длительность</span>
              <b>{durationDays} дней</b>
            </SummaryRow>
          </SummaryBox>

          <SectionTitle>Отчётность</SectionTitle>
          <SummaryBox>
            <SummaryRow>
              <span>Формат</span>
              <b>{reportMode === 'simple' ? 'Отметка' : 'Результат'}</b>
            </SummaryRow>
          </SummaryBox>
        </Form>

        {chatLink && (
          <SummaryBox>
            <SummaryRow>
              <span>Чат вызова</span>
              <b>{chatLink}</b>
            </SummaryRow>
          </SummaryBox>
        )}

        <Footer>
          <BackButton onClick={() => setIsPreview(false)}>
            Назад
          </BackButton>
          <NextButton onClick={publishChallenge} disabled={submitting}>
            {submitting ? 'Публикация…' : 'Опубликовать'}
          </NextButton>
        </Footer>
      </SafeArea>
    );
  }

  /* ==================== FORM ==================== */
  

  return (
    <SafeArea>
      <Header>
        <Title>Бесплатный вызов</Title>
      </Header>

      <Form>
        <SectionTitle>Основная информация</SectionTitle>

        <Field>
          <Label>Название вызова *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Hint>Короткое и понятное название</Hint>
        </Field>

        <Field>
          <Label>Описание *</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <Hint>
            Что нужно делать и как считается результат
          </Hint>
        </Field>

        <Field>
          <Label>Условия (опционально)</Label>
          <Textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            rows={3}
          />
        </Field>

        <SectionTitle>Сроки вызова</SectionTitle>

        <OptionCard
          active={startMode === 'now'}
          onClick={() => setStartMode('now')}
        >
          Начать сразу
          <small>После публикации</small>
        </OptionCard>

        <OptionCard
          active={startMode === 'date'}
          onClick={() => setStartMode('date')}
        >
          Начать в дату
          <small>Запланированный старт</small>
        </OptionCard>

        {startMode === 'date' && (
          <>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Hint>До этой даты можно вступать</Hint>
          </>
        )}



        <Field>
          <Label>Длительность (дней) *</Label>
          <Input
            type="number"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
          />
          <Hint>Когда вызов завершится автоматически</Hint>
        </Field>

        <SectionTitle>Формат отчёта</SectionTitle>

        <OptionCard
          active={reportMode === 'simple'}
          onClick={() => setReportMode('simple')}
        >
          Отметка выполнения
          <small>Просто отметить, что сделал</small>
        </OptionCard>

        <OptionCard
          active={reportMode === 'result'}
          onClick={() => setReportMode('result')}
        >
          Результат
          <small>Ввод числа за день</small>
        </OptionCard>

        {reportMode === 'result' && (
          <>
            <Field>
              <Label>В чём считается результат *</Label>
              <Input
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                placeholder="Например: километры"
              />
              <Hint>
                Участники вводят число за день, система суммирует
              </Hint>
            </Field>

            <CheckboxRow onClick={() => setHasGoal(!hasGoal)}>
              <input type="checkbox" checked={hasGoal} readOnly />
              <span>Установить цель (опционально)</span>
            </CheckboxRow>

            {hasGoal && (
              <Field>
                <Label>Цель за весь период *</Label>
                <Input
                  type="number"
                  value={goalValue}
                  onChange={(e) => setGoalValue(e.target.value)}
                  placeholder={`Например: 100 ${metricName}`}
                />
                <Hint>
                  Цель — ориентир, а не ограничение
                </Hint>
              </Field>
            )}

            <CheckboxRow onClick={() => setHasProof(!hasProof)}>
              <input type="checkbox" checked={hasProof} readOnly />
              <span>Требовать подтверждение (опционально)</span>
            </CheckboxRow>

            {hasProof &&
              ['Фото/видео', 'Текст'].map((type) => (
                <CheckboxRow
                  key={type}
                  onClick={() => toggleProof(type)}
                >
                  <input
                    type="checkbox"
                    checked={proofs.includes(type)}
                    readOnly
                  />
                  <span>{type}</span>
                </CheckboxRow>
              ))}
          </>
        )}

        <SectionTitle>Ограничения</SectionTitle>

        <CheckboxRow onClick={() => setHasLimit(!hasLimit)}>
          <input type="checkbox" checked={hasLimit} readOnly />
          <span>Ограничить отчёты (опционально)</span>
        </CheckboxRow>

        {hasLimit && (
          <Field>
            <Label>Максимум отчётов в день *</Label>
            <Input
              type="number"
              value={limitPerDay}
              onChange={(e) => setLimitPerDay(e.target.value)}
            />
            <Hint>Защита от спама и накрутки</Hint>
          </Field>
        )}

        <SectionTitle>Рейтинг</SectionTitle>

        <CheckboxRow onClick={() => setHasRating(!hasRating)}>
          <input type="checkbox" checked={hasRating} readOnly />
          <span>Вести рейтинг (опционально)</span>
        </CheckboxRow>

        {hasRating &&
          rewards.map((r, i) => (
            <RewardRow key={r.place}>
              <span>{r.place} место</span>
              <Input
                value={r.value}
                onChange={(e) => {
                  const next = [...rewards];
                  next[i].value = e.target.value;
                  setRewards(next);
                }}
                placeholder="Награда"
              />
            </RewardRow>
          ))}

        {hasRating && (
          <AddButton
            onClick={() =>
              setRewards([
                ...rewards,
                { place: rewards.length + 1, value: '' },
              ])
            }
          >
            + Добавить место
          </AddButton>
        )}
      </Form>

      <Footer>
        <BackButton onClick={() => onNavigate('create-flow')}>
          Назад
        </BackButton>
        <NextButton
          disabled={!canContinue}
          onClick={() => setIsPreview(true)}
        >
          Далее
        </NextButton>
      </Footer>
    </SafeArea>
  );
}



















