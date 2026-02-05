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
  FloatingInfo,
  Explanation,
  Consent,
  Footer,
  BackButton,
  NextButton,
} from './styles';

type Props = {
  onNavigate: (screen: 'home' | 'create' | 'create-flow') => void;
};

export function CreateFlow({ onNavigate }: Props) {
  const [entryType, setEntryType] = useState<'free' | 'paid' | null>(null);
  const [accepted, setAccepted] = useState(false);

  const canContinue =
    entryType === 'free' || (entryType === 'paid' && accepted);

  return (
    <SafeArea>
      <Center>
        <Title>Нужно ли платить за вступление?</Title>

        <Options>
          {/* FREE */}
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

            <FloatingInfo $open={entryType === 'free'}>
              <Explanation>
                Участие в вызове бесплатное. Все участники обязаны
                выполнять условия, заданные создателем.
              </Explanation>
            </FloatingInfo>
          </OptionWrap>

          {/* PAID */}
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
                Платформа не принимает оплату и не участвует в расчётах.
                Создатель самостоятельно принимает и возвращает средства.
              </Explanation>

              <Consent onClick={() => setAccepted(!accepted)}>
                <input type="checkbox" checked={accepted} readOnly />
                <span>
                  Я принимаю ответственность за приём оплаты и выполнение
                  обязательств перед участниками
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

        <NextButton disabled={!canContinue}>
          Далее
        </NextButton>
      </Footer>
    </SafeArea>
  );
}
