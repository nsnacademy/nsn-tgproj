import { useState, useEffect } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  FixedHeader,
  
  HeaderTitle,
  HeaderSubtitle,
  ProgressBar,
  ProgressStep,
  StepIndicator,
  StepNumber,
  StepLabel,
  ScrollContent,
  OptionCard,
  OptionIcon,
  OptionContent,
  OptionTitle,
  OptionDescription,
  OptionBadge,
  FormSection,
  FormTitle,
  FormDescription,
  InputField,
  InputLabel,
  InputWrapper,
  Input,
  CurrencySelect,
  Textarea,
  ContactInput,
  InfoBox,
  InfoIcon,
  InfoText,
  
  Footer,
  FooterRow,
  Button,
  ButtonText,
  RewardRow,
  AddButton,
} from './styles';

import type { Screen } from '../../app/App';

type Props = {
  onNavigate: (
    next: Screen,
    challengeId?: string,
    participantId?: string
  ) => void;
};

type PaidFormData = {
  amount: string;
  currency: 'rub' | 'usd' | 'eur';
  contact: string;
  paymentMethod: 'transfer' | 'agreement' | 'link' | 'other';
  paymentDescription: string;
};

type ConditionFormData = {
  condition: string;
  contact: string;
  maxParticipants?: string;
  limitEnabled: boolean;
};

export function CreateFlowPaid({ onNavigate }: Props) {
  /* === VIEW === */
  const [isPreview, setIsPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [mode, setMode] = useState<'paid' | 'condition' | null>(null);
  const [step, setStep] = useState(1);
  
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
  const [reportMode, setReportMode] = useState<'simple' | 'result'>('simple');
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

  /* === PAYMENT/CONDITION FORMS === */
  const [paidForm, setPaidForm] = useState<PaidFormData>({
    amount: '',
    currency: 'rub',
    contact: '',
    paymentMethod: 'transfer',
    paymentDescription: ''
  });

  const [conditionForm, setConditionForm] = useState<ConditionFormData>({
    condition: '',
    contact: '',
    maxParticipants: '',
    limitEnabled: false
  });

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

  const isStepValid = () => {
    if (step === 1) {
      return mode !== null;
    }
    
    if (mode === 'paid') {
      return paidForm.amount && paidForm.contact;
    }
    
    if (mode === 'condition') {
      return conditionForm.condition && conditionForm.contact;
    }
    
    return false;
  };

  const getStepTitle = () => {
    if (step === 1) return 'Закрытый вызов';
    
    if (mode === 'paid') return '💰 Платный вход';
    if (mode === 'condition') return '🔒 Доступ по условию';
    return '';
  };

  const getStepSubtitle = () => {
    if (step === 1) {
      return 'Выберите, как участники смогут вступить';
    }
    
    if (mode === 'paid') {
      return 'Настройте параметры платного входа';
    }
    if (mode === 'condition') {
      return 'Опишите условия доступа';
    }
    return '';
  };

  const handleContinue = () => {
    if (!mode) return;
    
    if (step === 1) {
      setStep(2);
    } else {
      setIsPreview(true);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onNavigate('create-flow');
    } else if (isPreview) {
      setIsPreview(false);
    } else {
      setStep(1);
    }
  };

  /* === PUBLISH CHALLENGE === */
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

    // Определяем тип входа
    const entryType = mode === 'paid' ? 'paid' : 'condition';
    
    // Подготавливаем данные в зависимости от типа
    const entrySettings = mode === 'paid' 
      ? {
          entry_price: Number(paidForm.amount),
          entry_currency: paidForm.currency,
          payment_method: paidForm.paymentMethod,
          payment_description: paidForm.paymentDescription || null,
          contact_info: paidForm.contact,
        }
      : {
          entry_condition: conditionForm.condition,
          contact_info: conditionForm.contact,
          max_participants: conditionForm.limitEnabled && conditionForm.maxParticipants 
            ? Number(conditionForm.maxParticipants) 
            : null,
        };

    const payload = {
      creator_id: user.id,
      entry_type: entryType,
      ...entrySettings,

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

    /* === CREATE CHALLENGE === */
    const { data: challenge } = await supabase
      .from('challenges')
      .insert(payload)
      .select('id')
      .single();

    if (!challenge) {
      setSubmitting(false);
      return;
    }

    /* === SAVE PRIZES === */
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
    const { error: participantError } = await supabase
      .from('participants')
      .insert({
        user_id: user.id,
        challenge_id: challenge.id,
      });

    if (participantError && participantError.code !== '23505') {
      console.warn('[publishChallenge] participant insert error', participantError);
    }

    setSubmitting(false);
    onNavigate('home');
  }

  /* ==================== PREVIEW ==================== */
  if (isPreview) {
    return (
      <SafeArea>
        <FixedHeader>
         
          <HeaderTitle>Предпросмотр вызова</HeaderTitle>
          <HeaderSubtitle>
            {mode === 'paid' ? 'Платный вход' : 'Доступ по условию'}
          </HeaderSubtitle>
        </FixedHeader>

        <ScrollContent style={{ marginTop: '120px' }}>
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

            <FormTitle>Тип входа</FormTitle>
            <InfoBox>
              <InfoIcon>{mode === 'paid' ? '💰' : '🔒'}</InfoIcon>
              <InfoText>
                {mode === 'paid' 
                  ? `Платный вход: ${paidForm.amount} ${paidForm.currency.toUpperCase()}`
                  : `Условие: ${conditionForm.condition}`}
                <br />
                Контакт: @{conditionForm.contact.replace('@', '')}
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
            <Button variant="secondary" onClick={handleBack}>
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

  /* ==================== MAIN FORM ==================== */
  return (
    <SafeArea>
      <FixedHeader>
        
        <HeaderTitle>{getStepTitle()}</HeaderTitle>
        <HeaderSubtitle>
          {getStepSubtitle()}
        </HeaderSubtitle>
        
        {step === 2 && (
          <ProgressBar>
            <ProgressStep $active>
              <StepIndicator $active>
                <StepNumber>1</StepNumber>
              </StepIndicator>
              <StepLabel>Тип</StepLabel>
            </ProgressStep>
            <ProgressStep $active>
              <StepIndicator $active>
                <StepNumber>2</StepNumber>
              </StepIndicator>
              <StepLabel>Настройки</StepLabel>
            </ProgressStep>
          </ProgressBar>
        )}
      </FixedHeader>

      <ScrollContent>
        {step === 1 ? (
          <>
            <OptionCard
              $active={mode === 'paid'}
              onClick={() => setMode('paid')}
            >
              <OptionIcon $color="#FFD700">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M3 18c1.2-3 4-4.5 9-4.5s7.8 1.5 9 4.5" />
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                  <line x1="8" y1="11" x2="16" y2="11" />
                  <line x1="8" y1="14" x2="16" y2="14" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                </svg>
              </OptionIcon>
              <OptionContent>
                <OptionTitle>
                  Платный вход
                  <OptionBadge $color="#FFD700">💰</OptionBadge>
                </OptionTitle>
                <OptionDescription>
                  Участник оплачивает участие. Вход подтверждается вами
                </OptionDescription>
              </OptionContent>
            </OptionCard>

            <OptionCard
              $active={mode === 'condition'}
              onClick={() => setMode('condition')}
            >
              <OptionIcon $color="#4CAF50">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="5" width="14" height="14" rx="3" />
                  <path d="M8 13l3 3 5-6" />
                  <circle cx="18" cy="8" r="1.5" fill="currentColor" />
                </svg>
              </OptionIcon>
              <OptionContent>
                <OptionTitle>
                  Доступ по условию
                  <OptionBadge $color="#4CAF50">🔒</OptionBadge>
                </OptionTitle>
                <OptionDescription>
                  Участник выполняет условие. Вы решаете, кого допустить
                </OptionDescription>
              </OptionContent>
            </OptionCard>
          </>
        ) : (
          /* === ШАГ 2: НАСТРОЙКИ === */
          <>
            {/* ОСНОВНАЯ ИНФОРМАЦИЯ (общая для обоих типов) */}
            <FormSection>
              <FormTitle>📝 Основная информация</FormTitle>
              
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
            </FormSection>

            {/* НАСТРОЙКИ ВХОДА */}
            {mode === 'paid' ? (
              <FormSection>
                <FormTitle>💰 Платный вход</FormTitle>
                <FormDescription>
                  Укажите цену для вступления в вызов
                </FormDescription>

                <InputField>
                  <InputLabel>Сумма *</InputLabel>
                  <InputWrapper>
                    <Input
                      type="number"
                      value={paidForm.amount}
                      onChange={(e) => setPaidForm({...paidForm, amount: e.target.value})}
                      placeholder="0"
                    />
                    <CurrencySelect 
                      value={paidForm.currency}
                      onChange={(e) => setPaidForm({...paidForm, currency: e.target.value as any})}
                    >
                      <option value="rub">₽</option>
                      <option value="usd">$</option>
                      <option value="eur">€</option>
                    </CurrencySelect>
                  </InputWrapper>
                </InputField>

                <InfoBox>
                  <InfoIcon>📌</InfoIcon>
                  <InfoText>
                    Даже если оплата вне приложения — цена должна быть зафиксирована
                  </InfoText>
                </InfoBox>

                <FormTitle style={{ marginTop: '24px' }}>💳 Как происходит оплата</FormTitle>

                <OptionCard
                  $active={paidForm.paymentMethod === 'transfer'}
                  onClick={() => setPaidForm({...paidForm, paymentMethod: 'transfer'})}
                  style={{ marginBottom: '8px' }}
                >
                  <OptionIcon $color="#667eea">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 10h18M3 14h18M3 18h18" />
                    </svg>
                  </OptionIcon>
                  <OptionContent>
                    <OptionTitle>Перевод</OptionTitle>
                    <OptionDescription>На карту или по номеру</OptionDescription>
                  </OptionContent>
                </OptionCard>

                <OptionCard
                  $active={paidForm.paymentMethod === 'agreement'}
                  onClick={() => setPaidForm({...paidForm, paymentMethod: 'agreement'})}
                  style={{ marginBottom: '8px' }}
                >
                  <OptionIcon $color="#4CAF50">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 12l3 3 6-6" />
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                  </OptionIcon>
                  <OptionContent>
                    <OptionTitle>Договорённость</OptionTitle>
                    <OptionDescription>Личная договорённость с участником</OptionDescription>
                  </OptionContent>
                </OptionCard>

                <OptionCard
                  $active={paidForm.paymentMethod === 'link'}
                  onClick={() => setPaidForm({...paidForm, paymentMethod: 'link'})}
                  style={{ marginBottom: '8px' }}
                >
                  <OptionIcon $color="#FF6B6B">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                      <path d="M13 10h4M7 10H3" />
                    </svg>
                  </OptionIcon>
                  <OptionContent>
                    <OptionTitle>Ссылка</OptionTitle>
                    <OptionDescription>Ссылка на оплату или форму</OptionDescription>
                  </OptionContent>
                </OptionCard>

                <InputField style={{ marginTop: '16px' }}>
                  <InputLabel>Комментарий (опционально)</InputLabel>
                  <Textarea
                    value={paidForm.paymentDescription}
                    onChange={(e) => setPaidForm({...paidForm, paymentDescription: e.target.value})}
                    placeholder="Например: оплата на карту 1234, после оплаты напишите мне"
                    rows={3}
                  />
                </InputField>

                <FormTitle style={{ marginTop: '24px' }}>📞 Контакт для связи *</FormTitle>
                <InputField>
                  <InputLabel>Telegram username</InputLabel>
                  <ContactInput>
                    <span style={{ opacity: 0.5, marginRight: '4px' }}>@</span>
                    <Input
                      type="text"
                      value={paidForm.contact.replace('@', '')}
                      onChange={(e) => setPaidForm({...paidForm, contact: e.target.value})}
                      placeholder="username"
                    />
                  </ContactInput>
                </InputField>
              </FormSection>
            ) : (
              <FormSection>
                <FormTitle>🔒 Доступ по условию</FormTitle>
                <FormDescription>
                  Опишите, что нужно выполнить для вступления
                </FormDescription>

                <InputField>
                  <InputLabel>Описание условия *</InputLabel>
                  <Textarea
                    value={conditionForm.condition}
                    onChange={(e) => setConditionForm({...conditionForm, condition: e.target.value})}
                    placeholder="Например: сделать репост, иметь опыт, пройти отбор, быть приглашённым..."
                    rows={4}
                  />
                </InputField>

                <InfoBox>
                  <InfoIcon>💡</InfoIcon>
                  <InfoText>
                    Это может быть что угодно: репост, опыт, отбор, приглашение
                  </InfoText>
                </InfoBox>

                <FormTitle style={{ marginTop: '24px' }}>📞 Контакт для связи *</FormTitle>
                <InputField>
                  <InputLabel>Telegram username</InputLabel>
                  <ContactInput>
                    <span style={{ opacity: 0.5, marginRight: '4px' }}>@</span>
                    <Input
                      type="text"
                      value={conditionForm.contact.replace('@', '')}
                      onChange={(e) => setConditionForm({...conditionForm, contact: e.target.value})}
                      placeholder="username"
                    />
                  </ContactInput>
                </InputField>

                <OptionCard
                  $active={conditionForm.limitEnabled}
                  onClick={() => setConditionForm({...conditionForm, limitEnabled: !conditionForm.limitEnabled})}
                  style={{ marginTop: '16px' }}
                >
                  <OptionIcon $color="#FFA500">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </OptionIcon>
                  <OptionContent>
                    <OptionTitle>Ограничить количество участников</OptionTitle>
                    <OptionDescription>Установите лимит (опционально)</OptionDescription>
                  </OptionContent>
                </OptionCard>

                {conditionForm.limitEnabled && (
                  <InputField style={{ marginTop: '12px' }}>
                    <InputLabel>Максимум участников</InputLabel>
                    <Input
                      type="number"
                      value={conditionForm.maxParticipants}
                      onChange={(e) => setConditionForm({...conditionForm, maxParticipants: e.target.value})}
                      placeholder="Например: 20"
                    />
                  </InputField>
                )}
              </FormSection>
            )}

            {/* СРОКИ ВЫЗОВА */}
            <FormSection>
              <FormTitle>📅 Сроки вызова</FormTitle>

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

            {/* ФОРМАТ ОТЧЁТА */}
            <FormSection>
              <FormTitle>📊 Формат отчёта</FormTitle>

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
                    <OptionCard
                      key={type}
                      $active={proofs.includes(type)}
                      onClick={() => toggleProof(type)}
                      style={{ marginLeft: '20px' }}
                    >
                      <OptionIcon $color="#FFA500">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        </svg>
                      </OptionIcon>
                      <OptionContent>
                        <OptionTitle>{type}</OptionTitle>
                      </OptionContent>
                    </OptionCard>
                  ))}
                </>
              )}
            </FormSection>

            {/* ОГРАНИЧЕНИЯ */}
            <FormSection>
              <FormTitle>⚠️ Ограничения</FormTitle>

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

            {/* РЕЙТИНГ И НАГРАДЫ */}
            <FormSection>
              <FormTitle>🏆 Рейтинг и награды</FormTitle>

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

            {/* ЧАТ */}
            <FormSection>
              <FormTitle>💬 Чат вызова</FormTitle>
              
              <InputField>
                <InputLabel>Ссылка на чат (опционально)</InputLabel>
                <Input
                  value={chatLink}
                  onChange={(e) => setChatLink(e.target.value)}
                  placeholder="https://t.me/название_чата"
                />
                <FormDescription>
                  Чат будет доступен только участникам после вступления
                </FormDescription>
              </InputField>
            </FormSection>
          </>
        )}
      </ScrollContent>

      <Footer>
        <FooterRow>
          <Button variant="secondary" onClick={handleBack}>
            <ButtonText>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {step === 1 ? 'Назад' : 'Назад к выбору'}
            </ButtonText>
          </Button>

          <Button
            variant="primary"
            disabled={step === 1 ? !isStepValid() : !canContinue || !isStepValid()}
            onClick={handleContinue}
          >
            <ButtonText>
              {step === 1 ? 'Продолжить' : 'Предпросмотр'}
              {((step === 1 && isStepValid()) || (step === 2 && canContinue && isStepValid())) && (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </ButtonText>
          </Button>
        </FooterRow>
      </Footer>
    </SafeArea>
  );
}

