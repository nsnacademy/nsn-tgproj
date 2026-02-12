import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

import {
  SafeArea,
  Header,
  BackButton,
  Title,
  Meta,
  DaySwitcher,
  NavButton,
  DayInfo,
  DayNumber,
  DayDate,
  Content,
  ReportCard,
  ReportHeader,
  UserBlock,
  Avatar,
  UserText,
  Username,
  SubmittedAt,
  StatusBadge,
  ReportBody,
  Label,
  Value,
  Reason,
  
  Actions,
  ApproveButton,
  RejectButton,
  EmptyState,
  CommentBox,
  ScrollContent,
  FixedTop,
} from './styles';

type Props = {
  challengeId: string;
  onBack: () => void;
};

type Challenge = {
  title: string;
  report_mode: 'simple' | 'result';
  metric_name: string | null;
  start_at: string;
  duration_days: number;
};

type Report = {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  report_date: string;
  value: number | null;
  is_done: boolean | null;
  proof_text: string | null;
  proof_media_urls: string[] | null;
  rejection_reason: string | null;
  participant: {
    user: {
      username: string | null;
    };
  };
};


export default function AdminChallenge({ challengeId, onBack }: Props) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});


  // 👉 состояние для отклонения
  const [rejectingReportId, setRejectingReportId] =
    useState<string | null>(null);
  const [rejectionText, setRejectionText] = useState('');

  /* === LOAD CHALLENGE === */
  useEffect(() => {
    console.log('[ADMIN] load challenge', challengeId);

    supabase
      .from('challenges')
      .select('title, report_mode, metric_name, start_at, duration_days')
      .eq('id', challengeId)
      .single()
      .then(({ data, error }) => {
        console.log('[ADMIN] challenge response', { data, error });
        if (data) setChallenge(data);
      });
  }, [challengeId]);

  /* === LOAD REPORTS === */
  useEffect(() => {
    if (!challenge) return;

    const date = new Date(challenge.start_at);
    date.setDate(date.getDate() + dayIndex);
    const reportDate = date.toISOString().slice(0, 10);

    console.log('[ADMIN] load reports', {
      challengeId,
      dayIndex,
      reportDate,
    });

    supabase
  .from('reports')
  .select(`
    id,
    report_date,
    status,
    value,
    is_done,
    proof_text,
    proof_media_urls,
    rejection_reason,
    participant:participants (
      user:users ( username )
    )
  `)

      .eq('challenge_id', challengeId)
      .eq('report_date', reportDate)
      .returns<Report[]>()
      .then(async ({ data }) => {
  console.log('[ADMIN] reports raw', JSON.stringify(data, null, 2));
  setReports(data ?? []);

  if (!data) return;

  const urls: Record<string, string> = {};

for (const report of data) {
  if (!report.proof_media_urls) continue;

  for (const path of report.proof_media_urls) {
    // 👇 если уже есть — не запрашиваем
    if (mediaUrls[path]) continue;

    const { data: signed } = await supabase.storage
      .from('report-media')
      .createSignedUrl(path, 60 * 60);

    if (signed?.signedUrl) {
      urls[path] = signed.signedUrl;
    }
  }
}

if (Object.keys(urls).length > 0) {
  setMediaUrls(prev => ({
    ...prev,
    ...urls,
  }));
}


});


      


  }, [challenge, dayIndex, challengeId]);

  if (!challenge) return null;

  const currentDate = new Date(challenge.start_at);
  currentDate.setDate(currentDate.getDate() + dayIndex);

  /* === UPDATE STATUS === */
  const updateStatus = async (
    reportId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string
  ) => {
    console.log('[ADMIN] updateStatus CLICK', {
      reportId,
      status,
      rejectionReason,
    });

    const payload =
      status === 'rejected'
        ? {
            status,
            rejection_reason: rejectionReason?.trim(),
          }
        : {
            status,
            rejection_reason: null,
          };

    const { data, error } = await supabase
      .from('reports')
      .update(payload)
      .eq('id', reportId)
      .select();

    console.log('[ADMIN] updateStatus RESULT', { data, error });

    if (error) {
      console.error('[ADMIN] updateStatus ERROR', error);
      return;
    }

    setReports(prev =>
      prev.map(r =>
        r.id === reportId
          ? {
              ...r,
              status,
              rejection_reason: payload.rejection_reason ?? null,
            }
          : r
      )
    );

    // закрываем режим отклонения
    setRejectingReportId(null);
    setRejectionText('');
  };

  return (
  <SafeArea>
    {/* FIXED HEADER + DAY SWITCHER */}
    <FixedTop>
      <Header>
        <BackButton onClick={onBack}>←</BackButton>
        <div>
          <Title>{challenge.title}</Title>
          <Meta>
            <span>Ежедневный вызов</span>
            <span>{challenge.duration_days} дней</span>
          </Meta>
        </div>
      </Header>

      <DaySwitcher>
        <NavButton
          disabled={dayIndex === 0}
          onClick={() => setDayIndex(d => d - 1)}
        >
          ←
        </NavButton>

        <DayInfo>
          <DayNumber>
            День {dayIndex + 1} / {challenge.duration_days}
          </DayNumber>
          <DayDate>
            {currentDate.toLocaleDateString('ru-RU')}
          </DayDate>
        </DayInfo>

        <NavButton
          disabled={dayIndex + 1 >= challenge.duration_days}
          onClick={() => setDayIndex(d => d + 1)}
        >
          →
        </NavButton>
      </DaySwitcher>
    </FixedTop>

    {/* SCROLLABLE CONTENT */}
    <ScrollContent>
      <Content>
        {reports.length === 0 ? (
          <EmptyState>Отчётов за этот день нет</EmptyState>
        ) : (
          reports.map(r => (
            <ReportCard key={r.id} $status={r.status}>
              <ReportHeader>
                <UserBlock>
                  <Avatar />
                  <UserText>
                    <Username>
                      @{r.participant.user.username ?? 'user'}
                    </Username>
                    <SubmittedAt>
                      Отправлено: {r.report_date}
                    </SubmittedAt>
                  </UserText>
                </UserBlock>

                <StatusBadge $status={r.status}>
                  {r.status.toUpperCase()}
                </StatusBadge>
              </ReportHeader>

              <ReportBody>
                <Label>Отчёт пользователя</Label>

                <Value>
                  {challenge.report_mode === 'simple'
                    ? r.is_done
                      ? 'Отметил выполнение дня'
                      : '—'
                    : `${r.value ?? 0} ${challenge.metric_name ?? ''}`}
                </Value>

                {/* 📝 КОММЕНТАРИЙ */}
                {r.proof_text && r.proof_text.trim() && (
                  <>
                    <Label>Комментарий</Label>
                    <CommentBox>{r.proof_text}</CommentBox>
                  </>
                )}

                {/* 📸 МЕДИА */}
                {r.proof_media_urls && r.proof_media_urls.length > 0 && (
                  <>
                    <Label>Медиа доказательства</Label>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: 12,
                        marginTop: 10,
                      }}
                    >
                      {r.proof_media_urls.map((path, i) => {
                        const url = mediaUrls[path];
                        if (!url) return null;

                        const isVideo =
                          path.toLowerCase().endsWith('.mp4') ||
                          path.toLowerCase().endsWith('.mov') ||
                          path.toLowerCase().endsWith('.webm');

                        return isVideo ? (
                          <video
                            key={i}
                            src={url}
                            controls
                            style={{
                              width: '100%',
                              borderRadius: 12,
                              background: '#000',
                            }}
                          />
                        ) : (
                          <img
                            key={i}
                            src={url}
                            alt="proof"
                            style={{
                              width: '100%',
                              borderRadius: 12,
                              objectFit: 'cover',
                            }}
                          />
                        );
                      })}
                    </div>
                  </>
                )}

                {/* ❌ ПРИЧИНА ОТКЛОНЕНИЯ */}
                {r.rejection_reason && (
                  <>
                    <Label>Причина отклонения</Label>
                    <Reason>{r.rejection_reason}</Reason>
                  </>
                )}
              </ReportBody>

              {/* ACTIONS */}
              {r.status === 'pending' && (
                <>
                  {rejectingReportId !== r.id ? (
                    <Actions>
                      <ApproveButton
                        onClick={() => updateStatus(r.id, 'approved')}
                      >
                        Засчитать
                      </ApproveButton>

                      <RejectButton
                        onClick={() => {
                          setRejectingReportId(r.id);
                          setRejectionText('');
                        }}
                      >
                        Отклонить
                      </RejectButton>
                    </Actions>
                  ) : (
                    <div style={{ marginTop: 12 }}>
                      <Label>Причина отклонения</Label>

                      <textarea
                        value={rejectionText}
                        onChange={e =>
                          setRejectionText(e.target.value)
                        }
                        placeholder="Опишите причину отклонения"
                        style={{
                          width: '100%',
                          minHeight: 80,
                          padding: 12,
                          borderRadius: 12,
                          background: '#111',
                          color: '#fff',
                          border:
                            '1px solid rgba(255,255,255,0.15)',
                          resize: 'none',
                        }}
                      />

                      <Actions style={{ marginTop: 10 }}>
                        <ApproveButton
                          disabled={!rejectionText.trim()}
                          onClick={() =>
                            updateStatus(
                              r.id,
                              'rejected',
                              rejectionText
                            )
                          }
                        >
                          Подтвердить
                        </ApproveButton>

                        <RejectButton
                          onClick={() => {
                            setRejectingReportId(null);
                            setRejectionText('');
                          }}
                        >
                          Отмена
                        </RejectButton>
                      </Actions>
                    </div>
                  )}
                </>
              )}
            </ReportCard>
          ))
        )}
      </Content>
    </ScrollContent>
  </SafeArea>
);

}
