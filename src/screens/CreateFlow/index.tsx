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
  InfoWrapper,
  InfoContent,
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
      | 'create-flow-condition'
      | 'create-flow-invite'
  ) => void;
};

// Константы для текстов
const FREE_INFO_TEXT = "Участие в вызове бесплатное. Все участники обязаны выполнять условия, заданные создателем.";

const CLOSED_INFO_TEXTS = {
  title: "🔒 Закрытый вызов",
  description: "Вы сами управляете доступом:",
  options: [
    "• Платный вход — участник платит взнос",
    "• По условию — нужно выполнить требование",
    "• По приглашению — только по ссылке/коду"
  ],
  commission: "💰 Комиссия платформы:",
  commissionDetails: [
    "• 15% от дохода с платных участников",
    "• Оплачивает создатель вызова",
    "• Расчёт автоматический по факту участия"
  ],
  warning: "⚠️ Важно:",
  warningDetails: [
    "• При нарушении правил вызов может быть удалён",
    "• Спорные ситуации решаются в пользу платформы",
    "• За мошенничество — блокировка без возврата средств"
  ]
};

// Мемоизированный компонент для информации о закрытом вызове
const ClosedInfo = memo(({ accepted, onAccept }: { accepted: boolean; onAccept: () => void }) => (
  <>
    <Explanation style={{ fontSize: 16, fontWeight: 600, opacity: 0.9, marginBottom: 8 }}>
      {CLOSED_INFO_TEXTS.title}
    </Explanation>

    <Explanation style={{ marginBottom: 4 }}>
      {CLOSED_INFO_TEXTS.description}
    </Explanation>
    
    {CLOSED_INFO_TEXTS.options.map((text, idx) => (
      <Explanation key={`opt-${idx}`} style={{ marginLeft: 8, opacity: 0.8 }}>
        {text}
      </Explanation>
    ))}

    <Explanation style={{ marginTop: 12, marginBottom: 4, fontWeight: 500 }}>
      {CLOSED_INFO_TEXTS.commission}
    </Explanation>
    
    {CLOSED_INFO_TEXTS.commissionDetails.map((text, idx) => (
      <Explanation key={`comm-${idx}`} style={{ marginLeft: 8, opacity: 0.8 }}>
        {text}
      </Explanation>
    ))}

    <Explanation style={{ marginTop: 12, marginBottom: 4, fontWeight: 500, color: '#FFA500' }}>
      {CLOSED_INFO_TEXTS.warning}
    </Explanation>
    
    {CLOSED_INFO_TEXTS.warningDetails.map((text, idx) => (
      <Explanation key={`warn-${idx}`} style={{ marginLeft: 8, opacity: 0.8, color: '#FFA500' }}>
        {text}
      </Explanation>
    ))}

    <Consent onClick={onAccept} $checked={accepted}>
      <input 
        type="checkbox" 
        checked={accepted} 
        readOnly 
        aria-label="Согласие с условиями"
      />
      <span>
        Я ознакомлен и принимаю условия
      </span>
    </Consent>
  </>
));

ClosedInfo.displayName = 'ClosedInfo';

// Мемоизированный компонент для бесплатной информации
const FreeInfo = memo(() => (
  <Explanation>
    {FREE_INFO_TEXT}
  </Explanation>
));

FreeInfo.displayName = 'FreeInfo';

export function CreateFlow({ onNavigate }: Props) {
  const [accessType, setAccessType] = useState<'open' | 'closed' | null>(null);
  const [accepted, setAccepted] = useState(false);

  // Мемоизация условия возможности продолжения
  const canContinue = useMemo(
    () => accessType === 'open' || (accessType === 'closed' && accepted),
    [accessType, accepted]
  );

  // Мемоизированные обработчики
  const handleOpenClick = useCallback(() => {
    setAccessType('open');
    setAccepted(false);
  }, []);

  const handleClosedClick = useCallback(() => {
    setAccessType('closed');
  }, []);

  const handleAcceptToggle = useCallback(() => {
    setAccepted(prev => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (!canContinue) return;

    if (accessType === 'open') {
      onNavigate('create-flow-free');
    } else if (accessType === 'closed') {
      // TODO: Создать экран выбора типа закрытого вызова
      onNavigate('create-flow-paid'); // временно, потом заменить на экран выбора
    }
  }, [canContinue, accessType, onNavigate]);

  const handleBack = useCallback(() => {
    onNavigate('create');
  }, [onNavigate]);

  return (
    <SafeArea>
      <Center>
        <Title>Тип доступа к вызову</Title>

        <Options>
          {/* ===== OPEN ===== */}
          <OptionWrap>
            <Option
              $active={accessType === 'open'}
              onClick={handleOpenClick}
            >
              <Radio $checked={accessType === 'open'} />
              <Label>
                Открытый вызов
                <span>Свободный вход, без подтверждения</span>
              </Label>
            </Option>

            <InfoWrapper $isVisible={accessType === 'open'}>
              <InfoContent>
                <FreeInfo />
              </InfoContent>
            </InfoWrapper>
          </OptionWrap>

          {/* ===== CLOSED ===== */}
          <OptionWrap>
            <Option
              $active={accessType === 'closed'}
              onClick={handleClosedClick}
            >
              <Radio $checked={accessType === 'closed'} />
              <Label>
                Закрытый вызов
                <span>Управляйте доступом: платный, по условию, по приглашению</span>
              </Label>
            </Option>

            <InfoWrapper $isVisible={accessType === 'closed'}>
              <InfoContent>
                <ClosedInfo 
                  accepted={accepted} 
                  onAccept={handleAcceptToggle}
                />
              </InfoContent>
            </InfoWrapper>
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