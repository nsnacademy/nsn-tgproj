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

  const basePayload = {
    challenge_id: challengeId,
    participant_id: participantId,
    report_date: today,

    status: 'pending',

    reviewed_by: null,
    reviewed_at: null,
    rejection_reason: null,
  };

  const payload =
    reportMode === 'result'
      ? {
          ...basePayload,
          value: Number(value),
          is_done: null,
          report_type: 'result',
        }
      : {
          ...basePayload,
          is_done: true,
          value: null,
          report_type: 'simple',
        };

  const { error } = await supabase
    .from('reports')
    .upsert(payload, {
      onConflict: 'participant_id,report_date',
    });

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
