import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import {
  SafeArea,
  Header,
  BackButton,
  Title,
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
  Username,
  StatusBadge,
  ReportBody,
  Label,
  Value,
  Actions,
  ApproveButton,
  RejectButton,
  EmptyState,
} from './styles';

type Props = {
  challengeId: string;
  onBack: () => void;
};

type Challenge = {
  title: string;
  report_mode: 'simple' | 'result';
  metric_name: string | null;
  has_proof: boolean;
  proof_types: string[] | null;
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
    id: string;
    user: {
      username: string;
    };
  };
};

export default function AdminChallenge({ challengeId, onBack }: Props) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [dayIndex, setDayIndex] = useState(0);

  /* === LOAD CHALLENGE === */
  useEffect(() => {
    supabase
      .from('challenges')
      .select(`
        title,
        report_mode,
        metric_name,
        has_proof,
        proof_types,
        start_at,
        duration_days
      `)
      .eq('id', challengeId)
      .single()
      .then(({ data }) => {
        if (data) setChallenge(data);
      });
  }, [challengeId]);

  /* === LOAD REPORTS FOR DAY === */
  useEffect(() => {
    if (!challenge) return;

    const date = new Date(challenge.start_at);
    date.setDate(date.getDate() + dayIndex);
    const reportDate = date.toISOString().slice(0, 10);

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
          id,
          user:users ( username )
        )
      `)
      .eq('challenge_id', challengeId)
      .eq('report_date', reportDate)
      .returns<Report[]>() // ✅ КЛЮЧЕВО
      .then(({ data }) => {
        setReports(data ?? []);
      });

  }, [challenge, dayIndex, challengeId]);

  if (!challenge) return null;

  const currentDate = new Date(challenge.start_at);
  currentDate.setDate(currentDate.getDate() + dayIndex);

  /* === ACTIONS === */
  const updateReport = async (
    reportId: string,
    status: 'approved' | 'rejected'
  ) => {
    await supabase
      .from('reports')
      .update({ status })
      .eq('id', reportId);

    setReports(prev =>
      prev.map(r =>
        r.id === reportId ? { ...r, status } : r
      )
    );
  };

  return (
    <SafeArea>
      <Header>
        <BackButton onClick={onBack}>←</BackButton>
        <Title>{challenge.title}</Title>
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

      <Content>
        {reports.length === 0 ? (
          <EmptyState>Отчётов за этот день нет</EmptyState>
        ) : (
          reports.map(r => (
            <ReportCard key={r.id}>
              <ReportHeader>
                <UserBlock>
                  <Avatar />
                  <Username>@{r.participant.user.username}</Username>
                </UserBlock>

                <StatusBadge $status={r.status}>
                  {r.status.toUpperCase()}
                </StatusBadge>
              </ReportHeader>

              <ReportBody>
                <Label>Отчёт</Label>
                <Value>
                  {challenge.report_mode === 'simple'
                    ? r.is_done
                      ? 'Отметил выполнение'
                      : '—'
                    : `${r.value} ${challenge.metric_name ?? ''}`}
                </Value>

                {r.proof_text && (
                  <>
                    <Label>Комментарий</Label>
                    <Value>{r.proof_text}</Value>
                  </>
                )}
              </ReportBody>

              {r.status === 'pending' && (
                <Actions>
                  <ApproveButton onClick={() => updateReport(r.id, 'approved')}>
                    Засчитать
                  </ApproveButton>
                  <RejectButton onClick={() => updateReport(r.id, 'rejected')}>
                    Отклонить
                  </RejectButton>
                </Actions>
              )}
            </ReportCard>
          ))
        )}
      </Content>
    </SafeArea>
  );
}
