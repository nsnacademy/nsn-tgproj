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

type Screen = 'home' | 'create' | 'create-flow' | 'create-flow-free' | 'create-flow-paid' | 'create-flow-condition' | 'create-flow-invite';

type Props = {
  onNavigate: (screen: Screen) => void;
};

// Константы вынесены отдельно для лучшей читаемости
const TEXTS = {
  free: "Участие в вызове бесплатное. Все участники обязаны выполнять условия, заданные создателем.",
  closed: {
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
  }
} as const;

// Универсальный компонент для рендера списков
const ListItems = memo(({ items, className }: { items: readonly string[]; className?: string }) => (
  <>
    {items.map((text, idx) => (
      <Explanation key={idx} className={className}>{text}</Explanation>
    ))}
  </>
));

ListItems.displayName = 'ListItems';

// Оптимизированный компонент для закрытого вызова
const ClosedInfo = memo(({ accepted, onAccept }: { accepted: boolean; onAccept: () => void }) => {
  const handleConsentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAccept();
  }, [onAccept]);

  return (
    <>
      <Explanation $bold $large $opacity="0.9" style={{ marginBottom: 8 }}>
        {TEXTS.closed.title}
      </Explanation>

      <Explanation style={{ marginBottom: 4 }}>
        {TEXTS.closed.description}
      </Explanation>

      <ListItems items={TEXTS.closed.options} className="ml-8 opacity-08" />

      <Explanation $bold style={{ marginTop: 12, marginBottom: 4 }}>
        {TEXTS.closed.commission}
      </Explanation>

      <ListItems items={TEXTS.closed.commissionDetails} className="ml-8 opacity-08" />

      <Explanation $bold $warning style={{ marginTop: 12, marginBottom: 4 }}>
        {TEXTS.closed.warning}
      </Explanation>

      <ListItems items={TEXTS.closed.warningDetails} className="ml-8 opacity-08 warning" />

      <Consent onClick={handleConsentClick} $checked={accepted}>
        <input type="checkbox" checked={accepted} readOnly aria-label="Согласие с условиями" />
        <span>Я ознакомлен и принимаю условия</span>
      </Consent>
    </>
  );
});

ClosedInfo.displayName = 'ClosedInfo';

// Мемоизированный компонент для бесплатной информации
const FreeInfo = memo(() => (
  <Explanation>{TEXTS.free}</Explanation>
));

FreeInfo.displayName = 'FreeInfo';

export function CreateFlow({ onNavigate }: Props) {
  const [accessType, setAccessType] = useState<'open' | 'closed' | null>(null);
  const [accepted, setAccepted] = useState(false);

  // Мемоизация условия
  const canContinue = useMemo(
    () => accessType === 'open' || (accessType === 'closed' && accepted),
    [accessType, accepted]
  );

  // Оптимизированные обработчики
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
    
    const screens: Record<'open' | 'closed', Screen> = {
      open: 'create-flow-free',
      closed: 'create-flow-paid' // TODO: заменить на экран выбора
    };
    
    onNavigate(screens[accessType!]);
  }, [canContinue, accessType, onNavigate]);

  const handleBack = useCallback(() => {
    onNavigate('create');
  }, [onNavigate]);

  return (
    <SafeArea>
      <Center>
        <Title>Тип доступа к вызову</Title>

        <Options>
          {/* OPEN OPTION */}
          <OptionWrap>
            <Option $active={accessType === 'open'} onClick={handleOpenClick}>
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

          {/* CLOSED OPTION */}
          <OptionWrap>
            <Option $active={accessType === 'closed'} onClick={handleClosedClick}>
              <Radio $checked={accessType === 'closed'} />
              <Label>
                Закрытый вызов
                <span>Управляйте доступом: платный, по условию, по приглашению</span>
              </Label>
            </Option>

            <InfoWrapper $isVisible={accessType === 'closed'}>
              <InfoContent>
                <ClosedInfo accepted={accepted} onAccept={handleAcceptToggle} />
              </InfoContent>
            </InfoWrapper>
          </OptionWrap>
        </Options>
      </Center>

      <Footer>
        <BackButton onClick={handleBack}>Назад</BackButton>
        <NextButton disabled={!canContinue} onClick={handleNext} aria-disabled={!canContinue}>
          Далее
        </NextButton>
      </Footer>
    </SafeArea>
  );
}