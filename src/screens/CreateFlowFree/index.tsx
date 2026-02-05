import { useState } from 'react';

import {
  SafeArea,
  Header,
  Title,
  Form,
  Field,
  Label,
  Input,
  Textarea,
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

export function CreateFlowFree({ onNavigate }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');

  const canContinue =
    title.trim().length > 2 && description.trim().length > 5;

  return (
    <SafeArea>
      <Header>
        <Title>Бесплатный вызов</Title>
      </Header>

      <Form>
        {/* === TITLE === */}
        <Field>
          <Label>Название вызова</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: 30 дней спорта"
            maxLength={60}
          />
        </Field>

        {/* === DESCRIPTION === */}
        <Field>
          <Label>Описание</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Что нужно делать и зачем"
            rows={4}
          />
        </Field>

        {/* === RULES === */}
        <Field>
          <Label>Условия участия (опционально)</Label>
          <Textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="Например: отчёт каждый день, без пропусков"
            rows={3}
          />
        </Field>
      </Form>

      <Footer>
        <BackButton onClick={() => onNavigate('create-flow')}>
          Назад
        </BackButton>

        <NextButton disabled={!canContinue}>
          Далее
        </NextButton>
      </Footer>
    </SafeArea>
  );
}
