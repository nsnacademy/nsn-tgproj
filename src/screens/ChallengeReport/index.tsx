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

/* === PROPS === */
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
  const [checked, setChecked] = useState(false); // ← КЛЮЧЕВОЕ
  const [loading, setLoading] = useState(false);

  /* === SUBMIT === */
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

  /* === CONDITIONS FOR BUTTON === */
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
        {/* RESULT INPUT */}
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

        {/* CHECK MARK */}
        <Field>
          <Label>Отметка выполнения</Label>

          <button
            type="button"
            onClick={() => setChecked(!checked)}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '2px solid #fff',
              background: checked ? '#fff' : 'transparent',
              color: checked ? '#000' : '#fff',
              fontSize: 24,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ✓
          </button>

          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              opacity: 0.6,
            }}
          >
            {checked
              ? 'Отметка подтверждена'
              : 'Нажмите, чтобы отметить выполнение'}
          </div>
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
