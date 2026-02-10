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
  onBack: () => void;
};

type TodayStatus = 'none' | 'pending' | 'approved';

type ChallengeConfig = {
  report_mode: 'simple' | 'result';
  has_proof: boolean;
  proof_types: string[] | null;
  metric_name: string | null;
};

export default function ChallengeReport({
  challengeId,
  participantId,
  onBack,
}: Props) {
  const [config, setConfig] = useState<ChallengeConfig | null>(null);

  const [value, setValue] = useState('');
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [todayStatus, setTodayStatus] =
    useState<TodayStatus>('none');

  const today = new Date().toISOString().slice(0, 10);

  /* === LOAD CHALLENGE CONFIG === */
  useEffect(() => {
    async function loadConfig() {
      const { data } = await supabase
        .from('challenges')
        .select('report_mode, has_proof, proof_types, metric_name')
        .eq('id', challengeId)
        .single();

      if (data) setConfig(data);
    }

    loadConfig();
  }, [challengeId]);

  /* === LOAD TODAY STATUS === */
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
    if (!config || loading || todayStatus !== 'none') return;
    setLoading(true);

    const payload = {
      challenge_id: challengeId,
      participant_id: participantId,
      report_date: today,
      status: 'pending' as const,
      report_type: config.report_mode,
      value:
        config.report_mode === 'result'
          ? Number(value)
          : null,
      is_done:
        config.report_mode === 'simple'
          ? true
          : null,
      text:
        config.has_proof &&
        config.proof_types?.includes('Текст') &&
        text.trim().length > 0
          ? text
          : null,
      media:
        config.has_proof &&
        config.proof_types?.includes('Фото/видео') &&
        files.length > 0
          ? [] // ⛔ storage подключим следующим шагом
          : null,
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

  if (!config) return null;

  const canSubmit =
    checked &&
    (config.report_mode === 'simple' ||
      value.trim().length > 0);

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
            {config.report_mode === 'result' && (
              <Field>
                <Label>
                  Результат
                  {config.metric_name
                    ? ` (${config.metric_name})`
                    : ''}
                </Label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Field>
            )}

            {config.has_proof &&
              config.proof_types?.includes('Текст') && (
                <Field>
                  <Label>Комментарий</Label>
                  <Textarea
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Комментарий (опционально)"
                  />
                </Field>
              )}

            {config.has_proof &&
              config.proof_types?.includes('Фото/видео') && (
                <Field>
                  <Label>Фото / видео</Label>
                  <FileInput
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) =>
                      setFiles(
                        e.target.files
                          ? Array.from(e.target.files)
                          : []
                      )
                    }
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
