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
  rejection_reason: string | null;
  participant: {
    id: string;
    user: {
      username: string | null;
    };
  };
};

export default function AdminChallenge({ challengeId, onBack }: Props) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [dayIndex, setDayIndex] = useState(0);

  /* === LOAD CHALLENGE === */
  useEffect(() => {
    async function loadChallenge() {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          title,
          report_mode,
          metric_name,
          start_at,
          duration_days
        `)
        .eq('id', challengeId)
        .single();

      if (error) {
        console.error('[ADMIN] load challenge error', error);
        return;
      }

      setChallenge(data);
    }

    loadChallenge();
  }, [challengeId]);

  /* === LOAD REPORTS FOR DAY === */
  useEffect(() => {
  if (!challenge) return;

  const currentChallenge = challenge; // 🔥 ФИКС ТИПОВ

  async function loadReports() {
    const date = new Date(currentChallenge.start_at);
    date.setDate(date.getDate() + dayIndex);
    const reportDate = date.toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from('reports')
      .select(`
        id,
        report_date,
        status,
        value,
        is_done,
        proof_text,
        rejection_reason,
        participant:participants (
          id,
          user:users ( username )
        )
      `)
      .eq('challenge_id', challengeId)
      .eq('report_date', reportDate)
      .returns<Report[]>();

    if (error) {
      console.error('[ADMIN] load reports error', error);
      setReports([]);
      return;
    }

    setReports(data ?? []);
  }

  loadReports();
}, [challenge, dayIndex, challengeId]);


  if (!challenge) return null;

  const currentDate = new Date(challenge.start_at);
  currentDate.setDate(currentDate.getDate() + dayIndex);

  /* === ACTIONS === */
  const updateReportStatus = async (
    reportId: string,
    status: 'approved' | 'rejected'
  ) => {
    const { error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', reportId);

    if (error) {
      console.error('[ADMIN] update report error', error);
      return;
    }

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

      {/* DAY SWITCHER */}
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

      {/* CONTENT */}
      <Content>
        {reports.length === 0 ? (
          <EmptyState>Отчётов за этот день нет</EmptyState>
        ) : (
          reports.map(report => (
            <ReportCard key={report.id}>
              <ReportHeader>
                <UserBlock>
                  <Avatar />
                  <Username>
                    @{report.participant.user.username ?? 'user'}
                  </Username>
                </UserBlock>

                <StatusBadge $status={report.status}>
                  {report.status}
                </StatusBadge>
              </ReportHeader>

              <ReportBody>
                <Label>Отчёт</Label>

                <Value>
                  {challenge.report_mode === 'simple'
                    ? report.is_done
                      ? 'Выполнено'
                      : '—'
                    : `${report.value ?? 0} ${challenge.metric_name ?? ''}`}
                </Value>

                {report.proof_text && (
                  <>
                    <Label>Комментарий</Label>
                    <Value>{report.proof_text}</Value>
                  </>
                )}

                {report.rejection_reason && (
                  <>
                    <Label>Причина отказа</Label>
                    <Value>{report.rejection_reason}</Value>
                  </>
                )}
              </ReportBody>

              {report.status === 'pending' && (
                <Actions>
                  <ApproveButton
                    onClick={() =>
                      updateReportStatus(report.id, 'approved')
                    }
                  >
                    Засчитать
                  </ApproveButton>

                  <RejectButton
                    onClick={() =>
                      updateReportStatus(report.id, 'rejected')
                    }
                  >
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
