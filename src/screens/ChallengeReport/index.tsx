import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Header,
  BackButton,
  HeaderTitle,
  Content,
  ReportCard,
  Section,
  SectionTitle,
  SectionSubtitle,
  InputField,
  InputLabel,
  InputWrapper,
  Input,
  MetricLabel,
  Textarea,
  ProofSection,
  ProofGrid,
  ProofItem,
  ProofIcon,
  ProofText,
  FileUpload,
  FileInput,
  UploadIcon,
  UploadText,
  FilePreview,
  FileItem,
  FileName,
  FileRemove,
  ConfirmationCard,
  CheckboxRow,
  Checkbox,
  CheckboxLabel,
  CheckboxText,
  SectionHeader,
  Footer,
  PrimaryButton,
  DisabledButton,
  LoadingState,
  StatusBadge,
  SuccessMessage,
  TodayDate,
  DateLabel,
} from './styles';

type Props = {
  challengeId: string;
  participantId: string;

  reportMode: 'simple' | 'result';
  metricName?: string | null;

  reportDate: string; // ✅ ВАЖНО

  onBack: () => void;
};



type TodayStatus = 'none' | 'pending' | 'approved' | 'rejected';


type ChallengeConfig = {
  report_mode: 'simple' | 'result';
  has_proof: boolean;
  proof_types: string[] | null;
  metric_name: string | null;
};

type FileWithPreview = {
  file: File;
  preview: string;
};


export default function ChallengeReport({
  challengeId,
  participantId,
  reportMode,
  metricName,
  reportDate, // ✅
  onBack,
}: Props) {



  const [config, setConfig] = useState<ChallengeConfig | null>(null);
  const [value, setValue] = useState('');
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [todayStatus, setTodayStatus] = useState<TodayStatus>('none');
const [todayReportId, setTodayReportId] = useState<string | null>(null);

  
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const formattedDate = new Date(reportDate).toLocaleDateString('ru-RU', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});


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
        .select('id, status')

        .eq('challenge_id', challengeId)
        .eq('participant_id', participantId)
        .eq('report_date', reportDate)

        .maybeSingle();

      if (!data) {
  setTodayStatus('none');
  setTodayReportId(null);
} else {
  setTodayStatus(data.status);
  setTodayReportId(data.id);
}


    }

    loadTodayReport();
  }, [challengeId, participantId, reportDate]);


  /* === FILE HANDLING === */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    URL.revokeObjectURL(fileToRemove.preview);
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  /* === SUBMIT === */
  async function submit() {
  if (
  !config ||
  loading ||
  (todayStatus !== 'none' && todayStatus !== 'rejected')
) return;


  if (reportMode === 'result' && !value.trim()) {
    alert('Пожалуйста, укажите результат');
    return;
  }

  if (!checked) {
    alert('Пожалуйста, подтвердите выполнение');
    return;
  }

  setLoading(true);

let uploadedMedia: string[] = [];

if (files.length > 0) {
  const file = files[0]; // ⬅️ ПОКА ТОЛЬКО ОДИН ФАЙЛ

  const filePath = `reports/${challengeId}/${participantId}/${reportDate}/${file.file.name}`;

  const { error: uploadError } = await supabase.storage
  .from('report-media')
  .upload(filePath, file.file, {
    upsert: true,
    contentType: file.file.type, // 🔥 ВАЖНО
  });


  if (uploadError) {
    alert('Ошибка загрузки файла: ' + uploadError.message);
    setLoading(false);
    return;
  }

  uploadedMedia.push(filePath);
}


  // ⚠️ ПОКА БЕЗ STORAGE — НЕ ПЫТАЕМСЯ ЗАГРУЖАТЬ ФАЙЛЫ
  // просто сохраняем имена как заглушку (или null)
  

  const payload = {
  challenge_id: challengeId,
  participant_id: participantId,
  report_date: reportDate,

  status: 'pending',
  report_type: config.report_mode,

  value: config.report_mode === 'result'
    ? Number(value)
    : null,

  is_done: config.report_mode === 'simple'
    ? true
    : null,

  // ✅ ТЕКСТОВОЕ ДОКАЗАТЕЛЬСТВО
  proof_text:
    config.has_proof &&
    config.proof_types?.includes('Текст') &&
    text.trim().length > 0
      ? text
      : null,

  // ✅ ФОТО / ВИДЕО
  proof_media_urls:
  uploadedMedia.length > 0
    ? uploadedMedia
    : null,

};


  let error;

if (todayReportId) {
  ({ error } = await supabase
    .from('reports')
    .update({
      ...payload,
      status: 'pending',
      rejection_reason: null,
      reviewed_at: null,
      reviewed_by: null,
    })
    .eq('id', todayReportId));
} else {
  ({ error } = await supabase
    .from('reports')
    .insert(payload));
}


if (error) {
  alert(error.message);
  setLoading(false);
  return;
}



  

  files.forEach(f => URL.revokeObjectURL(f.preview));

  setTodayStatus('pending');
  setSubmitted(true);
  setLoading(false);

  setTimeout(() => {
    onBack();
  }, 2000);
}


  if (!config) {
    return (
      <SafeArea>
        <Header>
          <BackButton onClick={onBack}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
          <HeaderTitle>Загрузка...</HeaderTitle>
        </Header>
        <Content>
          <LoadingState>Загрузка настроек...</LoadingState>
        </Content>
      </SafeArea>
    );
  }

  const canSubmit = checked && 
    (config.report_mode === 'simple' || value.trim().length > 0);

  const hasTextProof = config.has_proof && config.proof_types?.includes('Текст');
  const hasMediaProof = config.has_proof && config.proof_types?.includes('Фото/видео');

  return (
    <SafeArea>
      <Header>
        <BackButton onClick={onBack}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </BackButton>
        <HeaderTitle>Отчёт за день</HeaderTitle>
      </Header>

      <Content>
        {/* Статус дня */}
        <ReportCard>
          <TodayDate>
            <DateLabel>Дата отчёта</DateLabel>
            <div style={{ fontSize: '16px', fontWeight: '600', opacity: '0.95' }}>
              {formattedDate}
            </div>
          </TodayDate>
          
          {todayStatus !== 'none' && (
            <Section style={{ marginTop: '16px' }}>
              <StatusBadge $status={todayStatus}>

  {todayStatus === 'pending' && (
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="8" r="7" />
        <path d="M8 4v4l2 2" />
      </svg>
      Ожидает проверки
    </span>
  )}

  {todayStatus === 'approved' && (
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="8" r="7" />
        <path d="M6 9l2 2 4-4" />
      </svg>
      Отчёт принят
    </span>
  )}

  {todayStatus === 'rejected' && (
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="8" r="7" />
        <path d="M5 5l6 6M11 5l-6 6" />
      </svg>
      Отчёт отклонён
    </span>
  )}
</StatusBadge>

              
              {submitted && (
                <SuccessMessage>
                  ✅ Отчёт успешно отправлен! Возвращаемся назад...
                </SuccessMessage>
              )}
            </Section>
          )}
        </ReportCard>

        {/* Форма отчета */}
        {(todayStatus === 'none' || todayStatus === 'rejected') && (

          <>
            {/* Тип отчета */}
            <Section>
              <SectionHeader>
                <SectionTitle>
                  {config.report_mode === 'result' ? 'Результативный отчёт' : 'Дневной отчёт'}
                </SectionTitle>
                <SectionSubtitle>
                  {config.report_mode === 'result'
                    ? 'Введите ваш результат'
                    : 'Отметьте выполнение дня'}
                </SectionSubtitle>
              </SectionHeader>

              {config.report_mode === 'result' && (
                <InputField>
                  <InputLabel>
                    Ваш результат
                    {metricName && <MetricLabel> ({metricName})</MetricLabel>}
                  </InputLabel>
                  <InputWrapper>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="0"
                      $hasValue={value.length > 0}
                    />
                    {metricName && (
                      <div style={{ 
                        position: 'absolute', 
                        right: '16px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        opacity: 0.5,
                        fontSize: '14px'
                      }}>
                        {metricName}
                      </div>
                    )}
                  </InputWrapper>
                </InputField>
              )}
            </Section>

            {/* Доказательства */}
            {config.has_proof && (
              <Section>
                <SectionHeader>
                  <SectionTitle>Подтверждение выполнения</SectionTitle>
                  <SectionSubtitle>Добавьте доказательства</SectionSubtitle>
                </SectionHeader>

                <ProofSection>
                  {hasTextProof && (
                    <InputField>
                      <InputLabel>Комментарий (опционально)</InputLabel>
                      <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Расскажите о вашем результате..."
                        rows={4}
                      />
                    </InputField>
                  )}

                  {hasMediaProof && (
                    <ProofGrid>
                      <ProofItem>
                        <ProofIcon>
                          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                        </ProofIcon>
                        <ProofText>Фото/видео</ProofText>
                      </ProofItem>
                    </ProofGrid>
                  )}

                  {hasMediaProof && (
                    <div style={{ marginTop: '16px' }}>
                      <FileUpload onClick={() => fileInputRef.current?.click()}>
                        <UploadIcon>
                          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </UploadIcon>
                        <UploadText>
                          {files.length > 0 
                            ? `Добавлено файлов: ${files.length}` 
                            : 'Загрузите фото или видео'}
                        </UploadText>
                      </FileUpload>
                      
                      <FileInput
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                      />

                      {files.length > 0 && (
                        <FilePreview>
                          {files.map((file, index) => (
                            <FileItem key={index}>
                              <FileName>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                  <path d="M14 8v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6" />
                                  <polyline points="14 2 10 2 10 8 14 8" />
                                </svg>
                                {file.file.name}
                              </FileName>
                              <FileRemove onClick={() => removeFile(index)}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 1l12 12M13 1L1 13" />
                                </svg>
                              </FileRemove>
                            </FileItem>
                          ))}
                        </FilePreview>
                      )}
                    </div>
                  )}
                </ProofSection>
              </Section>
            )}

            {/* Подтверждение */}
            <Section>
              <ConfirmationCard>
                <CheckboxRow onClick={() => setChecked(!checked)}>
                  <Checkbox $checked={checked}>
                    {checked && (
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 8l4 4 8-8" />
                      </svg>
                    )}
                  </Checkbox>
                  <CheckboxLabel>
                    <CheckboxText $checked={checked}>
                      Я подтверждаю выполнение задания за сегодня
                    </CheckboxText>
                  </CheckboxLabel>
                </CheckboxRow>
              </ConfirmationCard>
            </Section>
          </>
        )}
      </Content>

      <Footer>
        {todayStatus === 'none' || todayStatus === 'rejected' ? (

          <PrimaryButton
            disabled={!canSubmit || loading}
            onClick={submit}
            $variant={config.report_mode}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="10" cy="10" r="8" strokeOpacity="0.4" />
                  <path d="M10 2a8 8 0 0 1 8 8" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 11v9a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12" />
                  <path d="M5 12l4 4L19 3" />
                </svg>
              )}
              {loading ? 'Отправка...' : 'Отправить отчёт'}
            </span>
          </PrimaryButton>
        ) : (
          <DisabledButton onClick={onBack}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Вернуться назад
            </span>
          </DisabledButton>
        )}
      </Footer>
    </SafeArea>
  );
}