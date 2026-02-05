import { useState } from 'react';

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
  RadioRow,
  Footer,
  BackButton,
  NextButton,
  InlineGroup,
  SmallInput,
  RewardRow,
  AddButton,
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

export function CreateFlowFree({ onNavigate }: Props) {
  /* === BASIC === */
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');

  /* === TIMING === */
  const [startMode, setStartMode] = useState<'now' | 'date'>('now');
  const [startDate, setStartDate] = useState('');
  const [durationDays, setDurationDays] = useState('');

  /* === REPORT TYPE === */
  const [confirmMode, setConfirmMode] =
    useState<'check' | 'proof' | 'metric' | 'metric-proof'>('check');

  const [proofs, setProofs] = useState<string[]>([]);

  /* === METRIC === */
  const [metricName, setMetricName] = useState('');
  const [metricUnit, setMetricUnit] = useState('');

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

  const toggleProof = (type: string) => {
    setProofs((prev) =>
      prev.includes(type)
        ? prev.filter((p) => p !== type)
        : [...prev, type]
    );
  };

  const canContinue =
    title.trim().length > 2 &&
    description.trim().length > 5 &&
    durationDays.trim().length > 0 &&
    (confirmMode === 'metric' || confirmMode === 'metric-proof'
      ? metricName.trim().length > 0
      : true);

  return (
    <SafeArea>
      <Header>
        <Title>Бесплатный вызов</Title>
      </Header>

      <Form>
        {/* === BASIC INFO === */}
        <SectionTitle>Основная информация</SectionTitle>

        <Field>
          <Label>Название вызова</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: 100 км за месяц"
          />
        </Field>

        <Field>
          <Label>Описание</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Что нужно делать и как считается результат"
            rows={4}
          />
        </Field>

        <Field>
          <Label>Условия (опционально)</Label>
          <Textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="Например: отчёт каждый день"
            rows={3}
          />
        </Field>

        {/* === TIMING === */}
        <SectionTitle>Сроки вызова</SectionTitle>

        <RadioRow active={startMode === 'now'} onClick={() => setStartMode('now')}>
          Начать сразу после публикации
        </RadioRow>

        <RadioRow
          active={startMode === 'date'}
          onClick={() => setStartMode('date')}
        >
          Начать в конкретную дату
        </RadioRow>

        {startMode === 'date' && (
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        )}

        <Field>
          <Label>Длительность (в днях)</Label>
          <Input
            type="number"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            placeholder="Например: 30"
          />
        </Field>

        {/* === REPORTING === */}
        <SectionTitle>Как участники отчитываются</SectionTitle>

        <RadioRow
          active={confirmMode === 'check'}
          onClick={() => setConfirmMode('check')}
        >
          Просто отмечают выполнение
        </RadioRow>
        {confirmMode === 'check' && (
          <Hint>
            Подходит для привычек и ежедневных задач без проверки
          </Hint>
        )}

        <RadioRow
          active={confirmMode === 'proof'}
          onClick={() => setConfirmMode('proof')}
        >
          Отправляют подтверждение
        </RadioRow>
        {confirmMode === 'proof' && (
          <>
            <Hint>
              Подходит, если важно визуальное подтверждение выполнения
            </Hint>

            {['Фото/видео', 'Текст'].map((type) => (
              <CheckboxRow key={type} onClick={() => toggleProof(type)}>
                <input type="checkbox" checked={proofs.includes(type)} readOnly />
                <span>{type}</span>
              </CheckboxRow>
            ))}
          </>
        )}

        <RadioRow
          active={confirmMode === 'metric'}
          onClick={() => setConfirmMode('metric')}
        >
          Вводят измеряемый результат
        </RadioRow>
        {confirmMode === 'metric' && (
          <>
            <Hint>
              Подходит для количественных вызовов: бег, тренировки, время
            </Hint>

            <Field>
              <Label>Что вводят участники</Label>
              <Input
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                placeholder="Например: километры"
              />
            </Field>

            <InlineGroup>
              <SmallInput
                placeholder="Ед."
                value={metricUnit}
                onChange={(e) => setMetricUnit(e.target.value)}
              />
            </InlineGroup>

            <Hint>
              Значения суммируются автоматически за весь период вызова
            </Hint>
          </>
        )}

        <RadioRow
          active={confirmMode === 'metric-proof'}
          onClick={() => setConfirmMode('metric-proof')}
        >
          Измерение + подтверждение
        </RadioRow>
        {confirmMode === 'metric-proof' && (
          <>
            <Hint>
              Подходит для длительных и проверяемых вызовов, например бега
            </Hint>

            <Field>
              <Label>Что вводят участники</Label>
              <Input
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                placeholder="Например: километры"
              />
            </Field>

            <InlineGroup>
              <SmallInput
                placeholder="Ед."
                value={metricUnit}
                onChange={(e) => setMetricUnit(e.target.value)}
              />
            </InlineGroup>

            {['Фото/видео'].map((type) => (
              <CheckboxRow key={type} onClick={() => toggleProof(type)}>
                <input type="checkbox" checked={proofs.includes(type)} readOnly />
                <span>{type}</span>
              </CheckboxRow>
            ))}

            <Hint>
              Результаты суммируются, подтверждение помогает избежать обмана
            </Hint>
          </>
        )}

        {/* === LIMITS === */}
        <SectionTitle>Ограничения</SectionTitle>

        <CheckboxRow onClick={() => setHasLimit(!hasLimit)}>
          <input type="checkbox" checked={hasLimit} readOnly />
          <span>Ограничить количество отчётов</span>
        </CheckboxRow>

        {hasLimit && (
          <Field>
            <Label>Максимум отчётов в день</Label>
            <Input
              type="number"
              value={limitPerDay}
              onChange={(e) => setLimitPerDay(e.target.value)}
            />
          </Field>
        )}

        {/* === RATING === */}
        <SectionTitle>Рейтинг и награды</SectionTitle>

        <CheckboxRow onClick={() => setHasRating(!hasRating)}>
          <input type="checkbox" checked={hasRating} readOnly />
          <span>Вести рейтинг участников</span>
        </CheckboxRow>

        {hasRating &&
          rewards.map((reward, index) => (
            <RewardRow key={reward.place}>
              <span>{reward.place} место</span>
              <Input
                value={reward.value}
                onChange={(e) => {
                  const next = [...rewards];
                  next[index].value = e.target.value;
                  setRewards(next);
                }}
                placeholder="Награда (опционально)"
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

        <NextButton disabled={!canContinue}>
          Далее
        </NextButton>
      </Footer>
    </SafeArea>
  );
}
