import { useState } from 'react';
import {
  SafeArea,
  Header,
  Title,
  Subtitle,
  Card,
  Footer,
  BackButton,
  NextButton,
  FooterRow,
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

  return (
    <SafeArea>
      <Header>
        <Title>Закрытый вызов</Title>
        <Subtitle>
          Выберите, как участники смогут вступить
        </Subtitle>
      </Header>

      <Card
        active={mode === 'paid'}
        onClick={() => setMode('paid')}
      >
        <h3>💰 Платный вход</h3>
        <p>
          Участник оплачивает участие
          <br />
          Вход подтверждается вами
        </p>
      </Card>

      <Card
        active={mode === 'condition'}
        onClick={() => setMode('condition')}
      >
        <h3>🔒 Доступ по условию</h3>
        <p>
          Участник выполняет условие
          <br />
          Вы решаете, кого допустить
        </p>
      </Card>

      <Footer>
        <FooterRow>
          <BackButton
            onClick={() => onNavigate('create-flow')}
          >
            Назад
          </BackButton>

          <NextButton
            disabled={!mode}
            onClick={() => {
              // ⛔ пока нет следующих экранов
              onNavigate('create-flow');
            }}
          >
            Продолжить
          </NextButton>
        </FooterRow>
      </Footer>
    </SafeArea>
  );
}
