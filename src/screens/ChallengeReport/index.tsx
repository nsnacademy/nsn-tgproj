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
  CheckRow,
  CheckDot,
  CheckText,
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
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (loading) return;
    setLoading(true);

    const today = new Date().toISOString().slice(0, 10);

    const basePayload = {
      challenge_id: challengeId,
      participant_id: participantId,
      report_date: today,
      status: 'pending' as const,
    };

    const payload =
      reportMode === 'result'
        ? {
            ...basePayload,
            report_type: 'result' as const,
            value: Number(value),
            is_done: null,
          }
        : {
            ...basePayload,
            report_type: 'simple' as const,
            is_done: true,
            value: null,
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

  const canSubmit =
    checked &&
    (reportMode === 'simple' ||
      (reportMode === 'result' && value.trim().length > 0));

  return (
    <SafeArea>
      <Header>
        <BackButton onClick={onBack}>←</BackButton>
        <Title>Отчёт</Title>
      </Header>

      <Content>
        {reportMode === 'result' && (
          <Field>
            <Label>
              Результат{metricName ? ` (${metricName})` : ''}
            </Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите значение"
            />
          </Field>
        )}

        <Field>
          <Label>Отметка выполнения</Label>

          <CheckRow onClick={() => setChecked(!checked)}>
            <CheckDot active={checked} />
            <CheckText active={checked}>
              {checked ? 'Отмечено' : 'Не отмечено'}
            </CheckText>
          </CheckRow>
        </Field>
      </Content>

      <Footer>
        <PrimaryButton
          disabled={!canSubmit || loading}
          onClick={submit}
        >
          {loading ? 'Отправка…' : 'Отправить отчёт'}
        </PrimaryButton>
      </Footer>
    </SafeArea>
  );
}
