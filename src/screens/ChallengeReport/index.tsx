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

    /**
     * БАЗОВЫЙ payload
     * reviewed_* НЕ трогаем — это зона админки
     */
    const basePayload = {
      challenge_id: challengeId,
      participant_id: participantId,
      report_date: today,
      status: 'pending' as const,
    };

    /**
     * SIMPLE — просто отметка
     * RESULT — числовое значение
     */
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

    /**
     * upsert — чтобы:
     * - не было duplicate key
     * - можно было перезаписать отчёт за день
     */
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
            <Label>Результат{metricName ? ` (${metricName})` : ''}</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите значение"
            />
          </Field>
        )}

        {reportMode === 'simple' && (
          <Field>
            <Label>Отметка выполнения</Label>
            <div style={{ opacity: 0.6, fontSize: 14 }}>
              Нажмите кнопку ниже, чтобы отметить выполнение
            </div>
          </Field>
        )}
      </Content>

      <Footer>
        <PrimaryButton
          disabled={loading || (reportMode === 'result' && !value)}
          onClick={submit}
        >
          {loading ? 'Отправка…' : 'Отправить отчёт'}
        </PrimaryButton>
      </Footer>
    </SafeArea>
  );
}
