import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import {
  SafeArea,
  Header,
  BackButton,
  Title,
  Content,
  Card,
  Field,
  Label,
  Value,
  PriceTag,
  ContactInfo,
  RuleBox,
  RuleIcon,
  RuleText,
  RequestButton,
  RequestHint,
  Footer,
} from './styles';

type Props = {
  challengeId: string;
  onBack: () => void;
  // onNavigateHome удален, так как не используется
};

type ChallengeData = {
  title: string;
  description: string;
  entry_price: number;
  entry_currency: string;
  contact_info: string;
  payment_method: string;
  payment_description: string | null;
  creator_username: string;
};

export default function ChallengePaid({ challengeId, onBack }: Props) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  async function loadChallenge() {
    const { data, error } = await supabase
      .from('challenges_with_creator')
      .select(`
        title,
        description,
        entry_price,
        entry_currency,
        contact_info,
        payment_method,
        payment_description,
        creator_username
      `)
      .eq('id', challengeId)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setChallenge(data);
    setLoading(false);
  }

  const handleSendRequest = async () => {
    // Здесь будет логика отправки запроса
    setRequestSent(true);
    
    // Пока просто имитируем отправку
    setTimeout(() => {
      setRequestSent(false);
    }, 3000);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'transfer': return 'Перевод';
      case 'agreement': return 'Договорённость';
      case 'link': return 'Ссылка на оплату';
      default: return method;
    }
  };

  if (loading) {
    return (
      <SafeArea>
        <Header>
          <BackButton onClick={onBack}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
          <Title>Загрузка...</Title>
        </Header>
      </SafeArea>
    );
  }

  if (!challenge) {
    return (
      <SafeArea>
        <Header>
          <BackButton onClick={onBack}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
          <Title>Вызов не найден</Title>
        </Header>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <Header>
        <BackButton onClick={onBack}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </BackButton>
        <Title>Условия входа</Title>
      </Header>

      <Content>
        <Card>
          <Title>{challenge.title}</Title>
          <Field>
            <Label>Описание</Label>
            <Value>{challenge.description}</Value>
          </Field>

          <PriceTag>
            {challenge.entry_price} {challenge.entry_currency.toUpperCase()}
          </PriceTag>

          <Field>
            <Label>Способ оплаты</Label>
            <Value>{getPaymentMethodLabel(challenge.payment_method)}</Value>
          </Field>

          {challenge.payment_description && (
            <Field>
              <Label>Комментарий</Label>
              <Value>{challenge.payment_description}</Value>
            </Field>
          )}

          <ContactInfo>
            <Label>Контакт для связи</Label>
            <Value>@{challenge.contact_info.replace('@', '')}</Value>
          </ContactInfo>

          <RuleBox>
            <RuleIcon>📋</RuleIcon>
            <RuleText>
              После оплаты нажмите кнопку ниже, чтобы отправить запрос автору
            </RuleText>
          </RuleBox>
        </Card>
      </Content>

      <Footer>
        <RequestButton 
          onClick={handleSendRequest}
          disabled={requestSent}
          $isSent={requestSent}
        >
          {requestSent ? '✓ Запрос отправлен' : '📨 Отправить запрос на вступление'}
        </RequestButton>
        <RequestHint>
          Автор проверит оплату и подтвердит ваше участие
        </RequestHint>
      </Footer>
    </SafeArea>
  );
}