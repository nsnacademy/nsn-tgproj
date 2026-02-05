import { useState } from 'react';

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

export function CreateFlow({ onNavigate }: Props) {
  const [entryType, setEntryType] = useState<'free' | 'paid' | null>(null);
  const [accepted, setAccepted] = useState(false);

  const canContinue =
    entryType === 'free' || (entryType === 'paid' && accepted);

  const handleNext = () => {
    if (!canContinue) return;

    if (entryType === 'free') {
      onNavigate('create-flow-free');
    }

    if (entryType === 'paid') {
      onNavigate('create-flow-paid');
    }
  };

  return (
    <SafeArea>
      <Center>
        <Title>Нужно ли платить за вступление?</Title>

        <Options>
          {/* ===== FREE ===== */}
          <OptionWrap>
            <Option
              $active={entryType === 'free'}
              onClick={() => {
                setEntryType('free');
                setAccepted(false);
              }}
            >
              <Radio $checked={entryType === 'free'} />
              <Label>
                Бесплатное вступление
                <span>Участники вступают без оплаты</span>
              </Label>
            </Option>

            <SlidingInfo $open={entryType === 'free'}>
              <Explanation>
                Участие в вызове бесплатное. Все участники обязаны выполнять
                условия, заданные создателем.
              </Explanation>
            </SlidingInfo>
          </OptionWrap>

          {/* ===== PAID ===== */}
         <OptionWrap>
  <Option
    $active={entryType === 'paid'}
    onClick={() => setEntryType('paid')}
  >
    <Radio $checked={entryType === 'paid'} />
    <Label>
      Платное вступление
      <span>Оплата напрямую создателю</span>
    </Label>
  </Option>

  <FloatingInfo $open={entryType === 'paid'}>
    <Explanation>
      Участники оплачивают участие напрямую создателю вызова.
      Платформа не участвует в переводе средств.
    </Explanation>

    <Explanation style={{ marginTop: 6 }}>
      Платформа организует вызов и фиксирует участие участников.
      Расчёт вознаграждения производится на основе данных платформы.
    </Explanation>

    <Explanation style={{ marginTop: 6 }}>
      Создатель вызова самостоятельно производит расчёт
      с платформой в соответствии с правилами сервиса.
    </Explanation>

   <Explanation style={{ marginTop: 6, opacity: 0.55 }}>
  • вознаграждение платформы — <b>10%</b> от общего дохода<br />
  • учитываются подтверждённые участники<br />
  • расчёт производится в течение <b>7 дней</b><br />
  • при несоблюдении условий данные вызова могут быть аннулированы
</Explanation>

    <Consent onClick={() => setAccepted(!accepted)}>
      <input type="checkbox" checked={accepted} readOnly />
      <span>
        Я принимаю условия и рассчет вознаграждения платформе
      </span>
    </Consent>
  </FloatingInfo>
</OptionWrap>

        </Options>
      </Center>

      <Footer>
        <BackButton onClick={() => onNavigate('create')}>
          Назад
        </BackButton>

        <NextButton disabled={!canContinue} onClick={handleNext}>
          Далее
        </NextButton>
      </Footer>
    </SafeArea>
  );
}
