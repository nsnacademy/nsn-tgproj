import { useState, useCallback, useMemo, memo } from 'react';

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
  terms: "Комиссия платформы — 10% от дохода. Расчёт производится автоматически."
};

// Мемоизированный компонент для платной информации
const PaidInfo = memo(({ accepted, onAccept }: { accepted: boolean; onAccept: () => void }) => (
  <>
    <Explanation>
      {PAID_INFO_TEXTS.main}
    </Explanation>

    <Explanation style={{ marginTop: 8, opacity: 0.7 }}>
      {PAID_INFO_TEXTS.terms}
    </Explanation>

    <Consent onClick={onAccept} $checked={accepted}>
      <input 
        type="checkbox" 
        checked={accepted} 
        readOnly 
        aria-label="Согласие с условиями"
      />
      <span>
        Я согласен с условиями платформы
      </span>
    </Consent>
  </>
));

PaidInfo.displayName = 'PaidInfo';

// Мемоизированный компонент для бесплатной информации
const FreeInfo = memo(() => (
  <Explanation>
    {FREE_INFO_TEXT}
  </Explanation>
));

FreeInfo.displayName = 'FreeInfo';

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
    // Не сбрасываем accepted при переключении на paid
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
        <Title>Тип доступа к вызову</Title>

        <Options>
          {/* ===== FREE ===== */}
          <OptionWrap>
            <Option
              $active={entryType === 'free'}
              onClick={handleFreeClick}
            >
              <Radio $checked={entryType === 'free'} />
              <Label>
                Открытый вызов
                <span>Бесплатное участие, вход без подтверждения</span>
              </Label>
            </Option>

            <SlidingInfo $open={entryType === 'free'}>
              <FreeInfo />
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
                Закрытый вызов
                <span>Платный вход или доступ по условию</span>
              </Label>
            </Option>

            <FloatingInfo $open={entryType === 'paid'}>
              <PaidInfo 
                accepted={accepted} 
                onAccept={handleAcceptToggle}
              />
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