import { useState } from 'react';
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
  RuleBox,
  RuleIcon,
  RuleText,
  Footer,
  FooterRow,
  Button,
  ButtonText,
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
  const [mode, setMode] = useState<'paid' | 'condition' | null>(null);
  const [step, setStep] = useState(1);
  
  // Форма для платного входа
  const [paidForm, setPaidForm] = useState<PaidFormData>({
    amount: '',
    currency: 'rub',
    contact: '',
    paymentMethod: 'transfer',
    paymentDescription: ''
  });

  // Форма для доступа по условию
  const [conditionForm, setConditionForm] = useState<ConditionFormData>({
    condition: '',
    contact: '',
    maxParticipants: '',
    limitEnabled: false
  });

  const handleContinue = () => {
    if (!mode) return;
    
    if (step === 1) {
      setStep(2);
    } else {
      // Здесь будет создание вызова
      console.log('Creating challenge with:', mode === 'paid' ? paidForm : conditionForm);
      // Пока просто возвращаемся назад для теста
      onNavigate('create-flow');
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onNavigate('create-flow');
    } else {
      setStep(1);
    }
  };

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
              onClick={() => {
                setMode('paid');
              }}
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
              onClick={() => {
                setMode('condition');
              }}
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
          <>
            {mode === 'paid' && (
              <FormSection>
                <FormTitle>💰 Стоимость участия</FormTitle>
                <FormDescription>
                  Укажите цену для вступления в вызов
                </FormDescription>

                <InputField>
                  <InputLabel>Сумма</InputLabel>
                  <InputWrapper>
                    <Input
                      type="number"
                      value={paidForm.amount}
                      onChange={(e) => setPaidForm({...paidForm, amount: e.target.value})}
                      placeholder="0"
                      $hasValue={paidForm.amount.length > 0}
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
                <FormDescription>
                  Опишите способ оплаты (не технически, а человечески)
                </FormDescription>

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

                <FormTitle style={{ marginTop: '24px' }}>📞 Контакт для связи</FormTitle>
                <FormDescription>
                  Участники будут писать вам для подтверждения
                </FormDescription>

                <InputField>
                  <InputLabel>Telegram username</InputLabel>
                  <ContactInput>
                    <span style={{ opacity: 0.5, marginRight: '4px' }}>@</span>
                    <Input
                      type="text"
                      value={paidForm.contact.replace('@', '')}
                      onChange={(e) => setPaidForm({...paidForm, contact: e.target.value})}
                      placeholder="username"
                      style={{ paddingLeft: '4px' }}
                    />
                  </ContactInput>
                </InputField>

                <RuleBox>
                  <RuleIcon>📋</RuleIcon>
                  <RuleText>
                    После оплаты вы вручную подтверждаете участие
                  </RuleText>
                </RuleBox>
              </FormSection>
            )}

            {mode === 'condition' && (
              <FormSection>
                <FormTitle>📋 Условие доступа</FormTitle>
                <FormDescription>
                  Опишите, что нужно выполнить для вступления
                </FormDescription>

                <InputField>
                  <InputLabel>Описание условия</InputLabel>
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

                <FormTitle style={{ marginTop: '24px' }}>📞 Контакт для связи</FormTitle>
                <FormDescription>
                  Участники будут писать вам после выполнения условия
                </FormDescription>

                <InputField>
                  <InputLabel>Telegram username</InputLabel>
                  <ContactInput>
                    <span style={{ opacity: 0.5, marginRight: '4px' }}>@</span>
                    <Input
                      type="text"
                      value={conditionForm.contact.replace('@', '')}
                      onChange={(e) => setConditionForm({...conditionForm, contact: e.target.value})}
                      placeholder="username"
                      style={{ paddingLeft: '4px' }}
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

                <RuleBox style={{ marginTop: '24px' }}>
                  <RuleIcon>🔒</RuleIcon>
                  <RuleText>
                    После выполнения условия вы вручную решаете, допускать участника или нет
                  </RuleText>
                </RuleBox>
              </FormSection>
            )}
          </>
        )}
      </ScrollContent>

      <Footer>
        <FooterRow>
          <Button
            variant="secondary"
            onClick={handleBack}
          >
            <ButtonText>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {step === 1 ? 'Назад' : 'Назад к выбору'}
            </ButtonText>
          </Button>

          <Button
            variant="primary"
            disabled={!isStepValid()}
            onClick={handleContinue}
          >
            <ButtonText>
              {step === 1 ? 'Продолжить' : 'Создать вызов'}
              {isStepValid() && (
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