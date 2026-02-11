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
    supabase
      .from('challenges')
      .select('title, report_mode, metric_name, start_at, duration_days')
      .eq('id', challengeId)
      .single()
      .then(({ data }) => {
        if (data) setChallenge(data);
      });
  }, [challengeId]);

  /* === LOAD REPORTS === */
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
        rejection_reason,
        participant:participants (
          user:users ( username )
        )
      `)
      .eq('challenge_id', challengeId)
      .eq('report_date', reportDate)
      .returns<Report[]>()
      .then(({ data }) => setReports(data ?? []));
  }, [challenge, dayIndex, challengeId]);

  if (!challenge) return null;

  const currentDate = new Date(challenge.start_at);
  currentDate.setDate(currentDate.getDate() + dayIndex);

  const updateStatus = async (
    reportId: string,
    status: 'approved' | 'rejected'
  ) => {
    await supabase.from('reports').update({ status }).eq('id', reportId);
    setReports(r =>
      r.map(item =>
        item.id === reportId ? { ...item, status } : item
      )
    );
  };

  return (
    <SafeArea>
      {/* HEADER */}
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

                {r.rejection_reason && (
                  <>
                    <Label>Причина отклонения</Label>
                    <Reason>{r.rejection_reason}</Reason>
                  </>
                )}
              </ReportBody>

              {r.status === 'pending' && (
                <Actions>
                  <ApproveButton onClick={() => updateStatus(r.id, 'approved')}>
                    Засчитать
                  </ApproveButton>
                  <RejectButton onClick={() => updateStatus(r.id, 'rejected')}>
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
