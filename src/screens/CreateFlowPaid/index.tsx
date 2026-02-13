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
      // Здесь будет логика для разных типов вызовов
      console.log('Selected mode:', mode);
      onNavigate('create-flow'); // Временно возвращаем назад
    }
  };

  return (
    <SafeArea>
      <Header>
        <BackButton onClick={() => onNavigate('create-flow')}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="16" cy="10" r="6" />
              <path d="M4 24c1.5-4 5-6 12-6s10.5 2 12 6" />
              <circle cx="16" cy="16" r="14" strokeWidth="1.5" />
              <line x1="10" y1="14" x2="22" y2="14" />
              <line x1="10" y1="18" x2="22" y2="18" />
              <line x1="16" y1="10" x2="16" y2="22" />
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
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="6" width="20" height="20" rx="4" />
              <path d="M10 16l4 4 8-8" />
              <circle cx="22" cy="10" r="2" fill="currentColor" />
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
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="16" cy="16" r="12" />
              <line x1="16" y1="8" x2="16" y2="24" />
              <line x1="8" y1="16" x2="24" y2="16" />
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
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
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
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
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