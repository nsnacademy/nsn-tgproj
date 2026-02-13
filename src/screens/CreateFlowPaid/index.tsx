import { useState } from 'react';
import {
  SafeArea,
  Header,
  BackButton,
  HeaderTitle,
  HeaderSubtitle,
  Content,
  OptionCard,
  OptionIcon,
  OptionContent,
  OptionTitle,
  OptionDescription,
  OptionBadge,
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

export function CreateFlowPaid({ onNavigate }: Props) {
  const [mode, setMode] = useState<'paid' | 'condition' | null>(null);

  const handleContinue = () => {
    if (mode) {
      console.log('Selected mode:', mode);
      onNavigate('create-flow');
    }
  };

  return (
    <SafeArea>
      <Header>
        <BackButton onClick={() => onNavigate('create-flow')}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </BackButton>
        <HeaderTitle>Закрытый вызов</HeaderTitle>
        <HeaderSubtitle>
          Выберите, как участники смогут вступить
        </HeaderSubtitle>
      </Header>

      <Content>
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

        <OptionCard
          $active={false}
          onClick={() => {}}
          $disabled
        >
          <OptionIcon $color="#666">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="7" x2="12" y2="17" />
              <line x1="7" y1="12" x2="17" y2="12" />
            </svg>
          </OptionIcon>
          
          <OptionContent>
            <OptionTitle>
              Скоро появится
              <OptionBadge $color="#666">⏳</OptionBadge>
            </OptionTitle>
            <OptionDescription>
              Другие способы вступления в разработке
            </OptionDescription>
          </OptionContent>
        </OptionCard>
      </Content>

      <Footer>
        <FooterRow>
          <Button
            variant="secondary"
            onClick={() => onNavigate('create-flow')}
          >
            <ButtonText>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Назад
            </ButtonText>
          </Button>

          <Button
            variant="primary"
            disabled={!mode}
            onClick={handleContinue}
          >
            <ButtonText>
              Продолжить
              {mode && (
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