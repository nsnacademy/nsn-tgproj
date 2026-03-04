import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  FixedHeader,
  HeaderTitle,
  HeaderSubtitle,
  ScrollContent,
  FormSection,
  FormTitle,
  InputField,
  InputLabel,
  Input,
  Textarea,
  CheckboxRow,
  OptionCard,
  OptionIcon,
  OptionContent,
  OptionTitle,
  OptionDescription,
  InfoBox,
  InfoIcon,
  InfoText,
  Footer,
  FooterRow,
  Button,
  ButtonText,
  RewardRow,
  AddButton,
  Hint,
} from './styles';

type Props = {
  onNavigate: (
    screen:
      | 'home'
      | 'create'
      | 'create-flow'
      | 'create-flow-free'
      | 'create-flow-paid'
      | 'challenge-progress',  // ✅ добавлено
    challengeId?: string,       // ✅ добавлено
    participantId?: string      // ✅ добавлено
  ) => void;
};

type ReportMode = 'simple' | 'result';

export function CreateFlowFree({ onNavigate }: Props) {
  /* === VIEW === */
  const [isPreview, setIsPreview] = useState(false);
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
  const [reportMode, setReportMode] = useState<ReportMode>('simple');
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
    if (submitting) return;
    setSubmitting(true);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      setSubmitting(false);
      return;
    }

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .single();

    if (!user) {
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

    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .insert(payload)
      .select('id')
      .single();

    if (challengeError || !challenge) {
      console.error('[publishChallenge] error creating challenge:', challengeError);
      setSubmitting(false);
      return;
    }

    if (hasRating) {
      const prizesPayload = rewards
        .filter(r => r.value.trim().length > 0)
        .map(r => ({
          challenge_id: challenge.id,
          place: r.place,
          title: r.value,
          description: null,
        }));

      if (prizesPayload.length > 0) {
        await supabase
          .from('challenge_prizes')
          .insert(prizesPayload);
      }
    }

    /* === ADD CREATOR AS PARTICIPANT === */
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .insert({
        user_id: user.id,
        challenge_id: challenge.id,
      })
      .select('id')
      .single();

    if (participantError && participantError.code !== '23505') {
      console.warn('[publishChallenge] participant insert error', participantError);
    }

    setSubmitting(false);

    // ✅ Перенаправляем сразу на экран прогресса, если вызов начинается сейчас
    if (startMode === 'now' && participant) {
      onNavigate('challenge-progress', challenge.id, participant.id);
    } else {
      onNavigate('home');
    }
  }

  /* ==================== PREVIEW ==================== */
  if (isPreview) {
    return (
      <SafeArea>
        <FixedHeader>
          <HeaderTitle>Предпросмотр вызова</HeaderTitle>
          <HeaderSubtitle>Бесплатный вызов</HeaderSubtitle>
        </FixedHeader>

        <ScrollContent>
          <FormSection>
            <FormTitle>Основная информация</FormTitle>
            <InfoBox>
              <InfoIcon>📋</InfoIcon>
              <InfoText>
                <strong>{title}</strong>
                <br />
                {description}
                {rules && <><br /><br />Условия: {rules}</>}
              </InfoText>
            </InfoBox>

            <FormTitle>Сроки</FormTitle>
            <InfoBox>
              <InfoIcon>📅</InfoIcon>
              <InfoText>
                Старт: {startMode === 'now' ? 'Сразу' : startDate}
                <br />
                Длительность: {durationDays} дней
              </InfoText>
            </InfoBox>

            <FormTitle>Отчётность</FormTitle>
            <InfoBox>
              <InfoIcon>📊</InfoIcon>
              <InfoText>
                {reportMode === 'simple' 
                  ? 'Отметка выполнения' 
                  : `Результат (${metricName})`}
                {hasGoal && <><br />Цель: {goalValue}</>}
                {hasLimit && <><br />Лимит: {limitPerDay} в день</>}
                {hasProof && <><br />Подтверждение: {proofs.join(', ')}</>}
              </InfoText>
            </InfoBox>

            {hasRating && (
              <>
                <FormTitle>Рейтинг и награды</FormTitle>
                <InfoBox>
                  <InfoIcon>🏆</InfoIcon>
                  <InfoText>
                    {rewards.filter(r => r.value).map(r => (
                      <div key={r.place}>{r.place} место: {r.value}</div>
                    ))}
                  </InfoText>
                </InfoBox>
              </>
            )}

            {chatLink && (
              <>
                <FormTitle>Чат</FormTitle>
                <InfoBox>
                  <InfoIcon>💬</InfoIcon>
                  <InfoText>{chatLink}</InfoText>
                </InfoBox>
              </>
            )}
          </FormSection>
        </ScrollContent>

        <Footer>
          <FooterRow>
            <Button variant="secondary" onClick={() => setIsPreview(false)}>
              <ButtonText>Назад</ButtonText>
            </Button>
            <Button 
              variant="primary" 
              onClick={publishChallenge}
              disabled={submitting}
            >
              <ButtonText>
                {submitting ? 'Публикация…' : 'Опубликовать'}
              </ButtonText>
            </Button>
          </FooterRow>
        </Footer>
      </SafeArea>
    );
  }

  /* ==================== FORM ==================== */
  return (
    <SafeArea>
      <FixedHeader>
        <HeaderTitle>Бесплатный вызов</HeaderTitle>
        <HeaderSubtitle>Заполните информацию о вызове</HeaderSubtitle>
      </FixedHeader>

      <ScrollContent>
        <FormSection>
          <FormTitle>Основная информация</FormTitle>
          
          <InputField>
            <InputLabel>Название вызова *</InputLabel>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Например: Марафон по бегу"
            />
          </InputField>

          <InputField>
            <InputLabel>Описание *</InputLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Что нужно делать участнику?"
            />
          </InputField>

          <InputField>
            <InputLabel>Условия (опционально)</InputLabel>
            <Textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows={3}
              placeholder="Правила участия"
            />
          </InputField>

          <InputField>
            <InputLabel>Чат вызова (опционально)</InputLabel>
            <Input
              value={chatLink}
              onChange={(e) => setChatLink(e.target.value)}
              placeholder="https://t.me/название_чата"
            />
            <Hint>
              Чат будет доступен только участникам после вступления
            </Hint>
          </InputField>
        </FormSection>

        <FormSection>
          <FormTitle>Сроки вызова</FormTitle>

          <OptionCard
            $active={startMode === 'now'}
            onClick={() => setStartMode('now')}
          >
            <OptionIcon $color="#667eea">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </OptionIcon>
            <OptionContent>
              <OptionTitle>Начать сразу</OptionTitle>
              <OptionDescription>После публикации</OptionDescription>
            </OptionContent>
          </OptionCard>

          <OptionCard
            $active={startMode === 'date'}
            onClick={() => setStartMode('date')}
          >
            <OptionIcon $color="#4CAF50">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </OptionIcon>
            <OptionContent>
              <OptionTitle>Начать в дату</OptionTitle>
              <OptionDescription>Запланированный старт</OptionDescription>
            </OptionContent>
          </OptionCard>

          {startMode === 'date' && (
            <InputField>
              <InputLabel>Дата старта</InputLabel>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </InputField>
          )}

          <InputField>
            <InputLabel>Длительность (дней) *</InputLabel>
            <Input
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              placeholder="30"
            />
          </InputField>
        </FormSection>

        <FormSection>
          <FormTitle>Формат отчёта</FormTitle>

          <OptionCard
            $active={reportMode === 'simple'}
            onClick={() => setReportMode('simple')}
          >
            <OptionIcon $color="#FFD700">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </OptionIcon>
            <OptionContent>
              <OptionTitle>Отметка выполнения</OptionTitle>
              <OptionDescription>Просто отметить, что сделал</OptionDescription>
            </OptionContent>
          </OptionCard>

          <OptionCard
            $active={reportMode === 'result'}
            onClick={() => setReportMode('result')}
          >
            <OptionIcon $color="#4CAF50">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 20L22 20" />
                <path d="M4 16L7 9" />
                <path d="M10 16L14 6" />
                <path d="M16 16L20 8" />
              </svg>
            </OptionIcon>
            <OptionContent>
              <OptionTitle>Результат</OptionTitle>
              <OptionDescription>Ввод числа за день</OptionDescription>
            </OptionContent>
          </OptionCard>

          {reportMode === 'result' && (
            <>
              <InputField>
                <InputLabel>В чём считается результат *</InputLabel>
                <Input
                  value={metricName}
                  onChange={(e) => setMetricName(e.target.value)}
                  placeholder="Например: километры"
                />
              </InputField>

              <OptionCard
                $active={hasGoal}
                onClick={() => setHasGoal(!hasGoal)}
              >
                <OptionIcon $color="#FF6B6B">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </OptionIcon>
                <OptionContent>
                  <OptionTitle>Установить цель</OptionTitle>
                  <OptionDescription>Опционально</OptionDescription>
                </OptionContent>
              </OptionCard>

              {hasGoal && (
                <InputField>
                  <InputLabel>Цель за весь период *</InputLabel>
                  <Input
                    type="number"
                    value={goalValue}
                    onChange={(e) => setGoalValue(e.target.value)}
                    placeholder={`Например: 100 ${metricName}`}
                  />
                </InputField>
              )}

              <OptionCard
                $active={hasProof}
                onClick={() => setHasProof(!hasProof)}
              >
                <OptionIcon $color="#667eea">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10.5" />
                    <polyline points="16 2 22 8 16 8" />
                    <line x1="10" y1="14" x2="21" y2="14" />
                    <line x1="10" y1="18" x2="18" y2="18" />
                    <polyline points="3 8 7 8 7 12" />
                  </svg>
                </OptionIcon>
                <OptionContent>
                  <OptionTitle>Требовать подтверждение</OptionTitle>
                  <OptionDescription>Опционально</OptionDescription>
                </OptionContent>
              </OptionCard>

              {hasProof && ['Фото/видео', 'Текст'].map((type) => (
                <CheckboxRow
                  key={type}
                  onClick={() => toggleProof(type)}
                  $checked={proofs.includes(type)}
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
        </FormSection>

        <FormSection>
          <FormTitle>Ограничения</FormTitle>

          <OptionCard
            $active={hasLimit}
            onClick={() => setHasLimit(!hasLimit)}
          >
            <OptionIcon $color="#FF6B6B">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </OptionIcon>
            <OptionContent>
              <OptionTitle>Ограничить отчёты</OptionTitle>
              <OptionDescription>Опционально</OptionDescription>
            </OptionContent>
          </OptionCard>

          {hasLimit && (
            <InputField>
              <InputLabel>Максимум отчётов в день *</InputLabel>
              <Input
                type="number"
                value={limitPerDay}
                onChange={(e) => setLimitPerDay(e.target.value)}
                min="1"
              />
            </InputField>
          )}
        </FormSection>

        <FormSection>
          <FormTitle>Рейтинг и награды</FormTitle>

          <OptionCard
            $active={hasRating}
            onClick={() => setHasRating(!hasRating)}
          >
            <OptionIcon $color="#FFD700">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </OptionIcon>
            <OptionContent>
              <OptionTitle>Вести рейтинг</OptionTitle>
              <OptionDescription>С наградами для победителей</OptionDescription>
            </OptionContent>
          </OptionCard>

          {hasRating && rewards.map((r, i) => (
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
        </FormSection>
      </ScrollContent>

      <Footer>
        <FooterRow>
          <Button variant="secondary" onClick={() => onNavigate('create-flow')}>
            <ButtonText>Назад</ButtonText>
          </Button>
          <Button
            variant="primary"
            disabled={!canContinue}
            onClick={() => setIsPreview(true)}
          >
            <ButtonText>Далее</ButtonText>
          </Button>
        </FooterRow>
      </Footer>
    </SafeArea>
  );
}