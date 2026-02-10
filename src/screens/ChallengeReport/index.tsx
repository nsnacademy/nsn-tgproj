import { useEffect, useState } from 'react';
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
  Textarea,
  Footer,
  PrimaryButton,
  CheckRow,
  CheckDot,
  CheckText,
  FileInput,
} from './styles';

type Props = {
  challengeId: string;
  participantId: string;
  reportMode: 'simple' | 'result';
  metricName?: string | null;
  onBack: () => void;
};

type TodayStatus = 'none' | 'pending' | 'approved';

export default function ChallengeReport({
  challengeId,
  participantId,
  reportMode,
  metricName,
  onBack,
}: Props) {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const [todayStatus, setTodayStatus] =
    useState<TodayStatus>('none');

  const today = new Date().toISOString().slice(0, 10);

  /* === LOAD TODAY REPORT STATUS === */
  useEffect(() => {
    async function loadTodayReport() {
      const { data } = await supabase
        .from('reports')
        .select('status')
        .eq('challenge_id', challengeId)
        .eq('participant_id', participantId)
        .eq('report_date', today)
        .maybeSingle();

      if (data?.status === 'pending') setTodayStatus('pending');
      else if (data?.status === 'approved') setTodayStatus('approved');
      else setTodayStatus('none');
    }

    loadTodayReport();
  }, [challengeId, participantId, today]);

  /* === SUBMIT === */
  async function submit() {
    if (loading || todayStatus !== 'none') return;
    setLoading(true);

    const basePayload = {
      challenge_id: challengeId,
      participant_id: participantId,
      report_date: today,
      status: 'pending' as const,
      text: text.trim().length > 0 ? text : null,
      media: null, // ⛔ storage подключим следующим шагом
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
      .insert(payload);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setTodayStatus('pending');
    setLoading(false);
  }

  const canSubmit =
    todayStatus === 'none' &&
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
        {todayStatus !== 'none' && (
          <Field>
            <Label>Статус</Label>
            <div style={{ opacity: 0.7 }}>
              {todayStatus === 'pending'
                ? '⏳ Ожидает проверки'
                : '✅ Отчёт принят'}
            </div>
          </Field>
        )}

        {todayStatus === 'none' && (
          <>
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
              <Label>Комментарий</Label>
              <Textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Комментарий к отчёту (опционально)"
              />
            </Field>

            <Field>
              <Label>Фото / видео</Label>
              <FileInput
                type="file"
                multiple
                accept="image/*,video/*"
              />
            </Field>

            <Field>
              <Label>Отметка выполнения</Label>
              <CheckRow onClick={() => setChecked(!checked)}>
                <CheckDot active={checked} />
                <CheckText active={checked}>
                  {checked ? 'Отмечено' : 'Не отмечено'}
                </CheckText>
              </CheckRow>
            </Field>
          </>
        )}
      </Content>

      <Footer>
        {todayStatus === 'none' && (
          <PrimaryButton
            disabled={!canSubmit || loading}
            onClick={submit}
          >
            {loading ? 'Отправка…' : 'Отправить отчёт'}
          </PrimaryButton>
        )}
      </Footer>
    </SafeArea>
  );
}
