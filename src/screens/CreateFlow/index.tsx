import { useState, useCallback, useMemo } from 'react';

import {
  SafeArea,
  Center,
  Title,
  Options,
  OptionWrap,
  Option,
  Radio,
  Label,
  SlidingInfo,
  FloatingInfo,
  Explanation,
  Consent,
  Footer,
  BackButton,
  NextButton,
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

// Константы для текстов (вынесены для оптимизации)
const FREE_INFO_TEXT = "Участие в вызове бесплатное. Все участники обязаны выполнять условия, заданные создателем.";

const PAID_INFO_TEXTS = {
  main: "Участники оплачивают участие напрямую создателю вызова. Платформа не участвует в переводе средств.",
  platform: "Платформа организует вызов и фиксирует участие участников. Расчёт вознаграждения производится на основе данных платформы.",
  creator: "Создатель вызова самостоятельно производит расчёт с платформой в соответствии с правилами сервиса.",
  terms: [
    "• вознаграждение платформы — 10% от общего дохода",
    "• учитываются подтверждённые участники",
    "• расчёт производится в течение 7 дней",
    "• при несоблюдении условий данные вызова могут быть аннулированы"
  ]
};

export function CreateFlow({ onNavigate }: Props) {
  const [entryType, setEntryType] = useState<'free' | 'paid' | null>(null);
  const [accepted, setAccepted] = useState(false);

  // Мемоизация условия возможности продолжения
  const canContinue = useMemo(
    () => entryType === 'free' || (entryType === 'paid' && accepted),
    [entryType, accepted]
  );

  // Мемоизированные обработчики
  const handleFreeClick = useCallback(() => {
    setEntryType('free');
    setAccepted(false);
  }, []);

  const handlePaidClick = useCallback(() => {
    setEntryType('paid');
  }, []);

  const handleAcceptToggle = useCallback(() => {
    setAccepted(prev => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (!canContinue) return;

    if (entryType === 'free') {
      onNavigate('create-flow-free');
    } else if (entryType === 'paid') {
      onNavigate('create-flow-paid');
    }
  }, [canContinue, entryType, onNavigate]);

  const handleBack = useCallback(() => {
    onNavigate('create');
  }, [onNavigate]);

  return (
    <SafeArea>
      <Center>
        <Title>Нужно ли платить за вступление?</Title>

        <Options>
          {/* ===== FREE ===== */}
          <OptionWrap>
            <Option
              $active={entryType === 'free'}
              onClick={handleFreeClick}
            >
              <Radio $checked={entryType === 'free'} />
              <Label>
                Бесплатное вступление
                <span>Участники вступают без оплаты</span>
              </Label>
            </Option>

            <SlidingInfo $open={entryType === 'free'}>
              <Explanation>
                {FREE_INFO_TEXT}
              </Explanation>
            </SlidingInfo>
          </OptionWrap>

          {/* ===== PAID ===== */}
          <OptionWrap>
            <Option
              $active={entryType === 'paid'}
              onClick={handlePaidClick}
            >
              <Radio $checked={entryType === 'paid'} />
              <Label>
                Платное вступление
                <span>Оплата напрямую создателю</span>
              </Label>
            </Option>

            <FloatingInfo $open={entryType === 'paid'}>
              <Explanation>
                {PAID_INFO_TEXTS.main}
              </Explanation>

              <Explanation style={{ marginTop: 6 }}>
                {PAID_INFO_TEXTS.platform}
              </Explanation>

              <Explanation style={{ marginTop: 6 }}>
                {PAID_INFO_TEXTS.creator}
              </Explanation>

              <Explanation style={{ marginTop: 6, opacity: 0.55 }}>
                {PAID_INFO_TEXTS.terms.map((text, index) => (
                  <span key={index}>
                    {text}
                    {index < PAID_INFO_TEXTS.terms.length - 1 && <br />}
                  </span>
                ))}
              </Explanation>

              <Consent onClick={handleAcceptToggle}>
                <input 
                  type="checkbox" 
                  checked={accepted} 
                  readOnly 
                  aria-label="Принять условия"
                />
                <span>
                  Я принимаю условия и рассчет вознаграждения платформе
                </span>
              </Consent>
            </FloatingInfo>
          </OptionWrap>
        </Options>
      </Center>

      <Footer>
        <BackButton onClick={handleBack}>
          Назад
        </BackButton>

        <NextButton 
          disabled={!canContinue} 
          onClick={handleNext}
          aria-disabled={!canContinue}
        >
          Далее
        </NextButton>
      </Footer>
    </SafeArea>
  );
}