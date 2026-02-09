import { useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Header,
  BackButton,
  Title,
  Content,
  Field,
  Label,
  Input,
  Footer,
  PrimaryButton,
} from './styles';

type Props = {
  challengeId: string;
  participantId: string;
  reportMode: 'simple' | 'result';
  metricName?: string | null;
  onBack: () => void;
};

export default function ChallengeReport({
  challengeId,
  participantId,
  reportMode,
  metricName,
  onBack,
}: Props) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (loading) return;
    setLoading(true);

    const today = new Date().toISOString().slice(0, 10);

    const payload =
      reportMode === 'result'
        ? {
            participant_id: participantId,
            report_date: today,
            value: Number(value),
            report_type: 'result',
          }
        : {
            participant_id: participantId,
            report_date: today,
            is_done: true,
            report_type: 'simple',
          };

    const { error } = await supabase.from('reports').insert(payload);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    onBack();
  }

  return (
    <SafeArea>
      <Header>
        <BackButton onClick={onBack}>←</BackButton>
        <Title>Отчёт</Title>
      </Header>

      <Content>
        {reportMode === 'result' && (
          <Field>
            <Label>Результат ({metricName})</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите значение"
            />
          </Field>
        )}
      </Content>

      <Footer>
        <PrimaryButton onClick={submit}>
          {loading ? 'Отправка…' : 'Отправить отчёт'}
        </PrimaryButton>
      </Footer>
    </SafeArea>
  );
}
