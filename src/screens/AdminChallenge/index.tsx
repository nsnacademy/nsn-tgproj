import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import {
  SafeArea,
  SplitContainer,
  LeftPanel,
  RightPanel,
  PanelHeader,
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
  StyledAvatar,
  UserText,
  Username,
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
  StatsRow,
  StatItem,
  StatValue,
  StatLabel,
  MediaGrid,
  MediaItem,
  MediaPreview,
  MediaCount,
  UserInfoRow,
  UserMeta,
  FullscreenOverlay,
  FullscreenClose,
  FullscreenImage,
  LoadingSpinner,
  // 👇 Импорты для левой панели
  SettingsSection,
  SettingsTitle,
  SettingsRow,
  SettingsLabel,
  SettingsValue,
  SettingsButton,
  DangerZone,
  DangerButton,
  ParticipantsList,
  ParticipantCard,
  ParticipantName,
  RemoveButton,
  RequestsSection,
  RequestsHeader,
  RequestsTitle,
  RequestCount,
  RequestCard as AdminRequestCard,
  RequestUserInfo,
  RequestUsername,
  RequestMeta,
  RequestDate,
  RequestActions,
  ApproveButton as RequestApproveButton,
  RejectButton as RequestRejectButton,
  RequestAvatar,
} from './styles';

type Props = {
  challengeId: string;
  onBack: () => void;
  onNavigateToSettings?: () => void; // для перехода к настройкам
  onNavigateToRequests?: () => void; // для перехода к заявкам
};

type Challenge = {
  title: string;
  report_mode: 'simple' | 'result';
  metric_name: string | null;
  start_at: string;
  duration_days: number;
  entry_type: 'free' | 'paid' | 'condition';
  max_participants: number | null;
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

type Participant = {
  id: string;
  user_id: string;
  users: {
    username: string | null;
    telegram_id: string;
  };
};

type Request = {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  users: {
    username: string | null;
    telegram_id: string;
  };
};

export default function AdminChallenge({ 
  challengeId, 
  onBack,
  onNavigateToSettings,
  onNavigateToRequests 
}: Props) {
  // 📊 Состояния для отчетов
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loadingMedia, setLoadingMedia] = useState<Record<string, boolean>>({});

  // 👥 Состояния для левой панели
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [requests, setRequests] = useState<Request[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [processing, setProcessing] = useState<string | null>(null);
  const [showRequests, setShowRequests] = useState(true);

  // 👉 состояние для отклонения отчетов
  const [rejectingReportId, setRejectingReportId] = useState<string | null>(null);
  const [rejectionText, setRejectionText] = useState('');

  /* =========================
     LOAD CHALLENGE
  ========================= */
  useEffect(() => {
    console.log('📋 [ADMIN CHALLENGE] Загрузка данных вызова:', challengeId);
    
    supabase
      .from('challenges')
      .select('title, report_mode, metric_name, start_at, duration_days, entry_type, max_participants')
      .eq('id', challengeId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ [ADMIN CHALLENGE] Ошибка загрузки вызова:', error);
        } else {
          console.log('✅ [ADMIN CHALLENGE] Данные вызова загружены:', data);
          setChallenge(data);
        }
      });
  }, [challengeId]);

  /* =========================
     LOAD PARTICIPANTS
  ========================= */
  useEffect(() => {
    const loadParticipants = async () => {
      console.log('👥 [ADMIN CHALLENGE] Загрузка участников...');
      
      const { count } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId);

      setParticipantsCount(count ?? 0);

      const { data: participantsData } = await supabase
        .from('participants')
        .select(`
          id,
          user_id,
          users (
            username,
            telegram_id
          )
        `)
        .eq('challenge_id', challengeId);

      if (participantsData) {
        const transformed = participantsData.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          users: item.users?.[0] || {
            username: null,
            telegram_id: '',
          },
        }));
        setParticipants(transformed);
        console.log('✅ [ADMIN CHALLENGE] Участники загружены:', transformed.length);
      }
    };

    loadParticipants();
  }, [challengeId]);

  /* =========================
     LOAD REQUESTS
  ========================= */
  useEffect(() => {
    const loadRequests = async () => {
      if (!challenge || challenge.entry_type === 'free') return;

      console.log('📨 [ADMIN CHALLENGE] Загрузка заявок...');
      
      const { data: requestsData } = await supabase
        .from('entry_requests')
        .select(`
          id,
          user_id,
          status,
          created_at,
          users!inner (
            username,
            telegram_id
          )
        `)
        .eq('challenge_id', challengeId)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (requestsData) {
        const transformed = requestsData.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          status: item.status,
          created_at: item.created_at,
          users: item.users || {
            username: null,
            telegram_id: '',
          },
        }));
        setRequests(transformed);
        setPendingRequestsCount(transformed.length);
        console.log('✅ [ADMIN CHALLENGE] Заявки загружены:', transformed.length);
      }
    };

    loadRequests();
  }, [challengeId, challenge]);

  /* =========================
     LOAD REPORTS
  ========================= */
  useEffect(() => {
    if (!challenge) return;

    const date = new Date(challenge.start_at);
    date.setDate(date.getDate() + dayIndex);
    const reportDate = date.toISOString().slice(0, 10);

    console.log('🔍 [ADMIN CHALLENGE] Загрузка отчетов за день:', reportDate);

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
        participant:participants!inner (
          user:users!inner ( username )
        )
      `)
      .eq('challenge_id', challengeId)
      .eq('report_date', reportDate)
      .returns<Report[]>()
      .then(async ({ data, error }) => {
        if (error) {
          console.error('❌ [ADMIN CHALLENGE] Ошибка загрузки отчетов:', error);
          return;
        }

        setReports(data ?? []);

        if (!data || data.length === 0) return;

        // Загружаем медиа
        const allMediaPaths: string[] = [];
        data.forEach(report => {
          if (report.proof_media_urls) {
            allMediaPaths.push(...report.proof_media_urls);
          }
        });

        const urls: Record<string, string> = {};
        
        for (const path of allMediaPaths) {
          if (mediaUrls[path]) continue;

          setLoadingMedia(prev => ({ ...prev, [path]: true }));

          const { data: signed } = await supabase.storage
            .from('report-media')
            .createSignedUrl(path, 60 * 60);

          if (signed?.signedUrl) {
            urls[path] = signed.signedUrl;
          }

          setLoadingMedia(prev => ({ ...prev, [path]: false }));
        }

        if (Object.keys(urls).length > 0) {
          setMediaUrls(prev => ({ ...prev, ...urls }));
        }
      });
  }, [challenge, dayIndex, challengeId]);

  /* =========================
     REPORT ACTIONS
  ========================= */
  const updateStatus = async (
    reportId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string
  ) => {
    console.log('🔄 [ADMIN CHALLENGE] Обновление статуса отчета:', { reportId, status });

    const payload =
      status === 'rejected'
        ? { status, rejection_reason: rejectionReason?.trim() }
        : { status, rejection_reason: null };

    const { error } = await supabase
      .from('reports')
      .update(payload)
      .eq('id', reportId);

    if (error) {
      console.error('❌ [ADMIN CHALLENGE] Ошибка обновления статуса:', error);
      return;
    }

    setReports(prev =>
      prev.map(r =>
        r.id === reportId
          ? { ...r, status, rejection_reason: payload.rejection_reason ?? null }
          : r
      )
    );

    setRejectingReportId(null);
    setRejectionText('');
  };

  /* =========================
     REQUEST ACTIONS
  ========================= */
  const handleApproveRequest = async (requestId: string, userId: string) => {
    if (!challenge) return;

    if (challenge.max_participants && participantsCount >= challenge.max_participants) {
      alert('Лимит участников достигнут');
      return;
    }

    setProcessing(requestId);

    await supabase
      .from('entry_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    await supabase
      .from('participants')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
      });

    setParticipantsCount(prev => prev + 1);
    setPendingRequestsCount(prev => prev - 1);
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setProcessing(null);
  };

  const handleRejectRequest = async (requestId: string) => {
    const confirmed = window.confirm('Отклонить заявку?');
    if (!confirmed) return;

    setProcessing(requestId);

    await supabase
      .from('entry_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    setPendingRequestsCount(prev => prev - 1);
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setProcessing(null);
  };

  const removeParticipant = async (participantId: string, userId: string) => {
    const confirmed = window.confirm('Удалить участника?');
    if (!confirmed) return;

    await supabase
      .from('participants')
      .delete()
      .eq('id', participantId);

    await supabase
      .from('entry_requests')
      .delete()
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);

    setParticipants(prev => prev.filter(p => p.id !== participantId));
    setParticipantsCount(prev => prev - 1);
  };

  const getDisplayName = (user: { username: string | null; telegram_id: string }) => {
    if (user?.username) return `@${user.username}`;
    if (user?.telegram_id) return `ID: ${user.telegram_id}`;
    return 'Неизвестно';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (username: string | null) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  if (!challenge) {
    return (
      <SafeArea>
        <LeftPanel>
          <PanelHeader>
            <BackButton onClick={onBack}>←</BackButton>
            <Title>Загрузка...</Title>
          </PanelHeader>
        </LeftPanel>
      </SafeArea>
    );
  }

  const currentDate = new Date(challenge.start_at);
  currentDate.setDate(currentDate.getDate() + dayIndex);

  // Статистика по отчетам
  const stats = {
    all: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    approved: reports.filter(r => r.status === 'approved').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
  };

  const filteredReports = activeTab === 'all' 
    ? reports 
    : reports.filter(r => r.status === activeTab);

  const limitReached = challenge.max_participants 
    ? participantsCount >= challenge.max_participants 
    : false;

  return (
    <SafeArea>
      <SplitContainer>
        {/* 👈 ЛЕВАЯ ПАНЕЛЬ - УПРАВЛЕНИЕ ВЫЗОВОМ */}
        <LeftPanel>
          <PanelHeader>
            <BackButton onClick={onBack}>←</BackButton>
            <Title>Управление</Title>
          </PanelHeader>

          <ScrollContent>
            {/* Информация о вызове */}
            <SettingsSection>
              <SettingsTitle>📊 Информация</SettingsTitle>
              <SettingsRow>
                <SettingsLabel>Название</SettingsLabel>
                <SettingsValue>{challenge.title}</SettingsValue>
              </SettingsRow>
              <SettingsRow>
                <SettingsLabel>Тип</SettingsLabel>
                <SettingsValue>
                  {challenge.entry_type === 'paid' && '💰 Платный'}
                  {challenge.entry_type === 'condition' && '🔒 По условию'}
                  {challenge.entry_type === 'free' && '🆓 Бесплатный'}
                </SettingsValue>
              </SettingsRow>
              <SettingsRow>
                <SettingsLabel>Участников</SettingsLabel>
                <SettingsValue>
                  {participantsCount}
                  {challenge.max_participants ? ` / ${challenge.max_participants}` : ''}
                </SettingsValue>
              </SettingsRow>
            </SettingsSection>

            {/* Заявки (только для paid/condition) */}
            {challenge.entry_type !== 'free' && (
              <RequestsSection>
                <RequestsHeader>
                  <RequestsTitle>
                    📋 Заявки
                    {pendingRequestsCount > 0 && (
                      <RequestCount>{pendingRequestsCount}</RequestCount>
                    )}
                  </RequestsTitle>
                  <SettingsButton onClick={() => setShowRequests(!showRequests)}>
                    {showRequests ? '▲' : '▼'}
                  </SettingsButton>
                </RequestsHeader>

                {showRequests && (
                  <>
                    {limitReached && (
                      <div style={{ color: '#ff3b30', fontSize: 13, marginBottom: 12 }}>
                        ⚠️ Лимит достигнут
                      </div>
                    )}

                    {requests.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: 20, opacity: 0.5 }}>
                        Нет активных заявок
                      </div>
                    ) : (
                      <ParticipantsList>
                        {requests.map(request => (
                          <AdminRequestCard key={request.id}>
                            <RequestUserInfo>
                              <RequestAvatar>
                                {getInitials(request.users.username)}
                              </RequestAvatar>
                              <div>
                                <RequestUsername>
                                  {getDisplayName(request.users)}
                                </RequestUsername>
                                <RequestMeta>
                                  <RequestDate>
                                    {formatDate(request.created_at)}
                                  </RequestDate>
                                </RequestMeta>
                              </div>
                            </RequestUserInfo>
                            <RequestActions>
                              <RequestApproveButton
                                onClick={() => handleApproveRequest(request.id, request.user_id)}
                                disabled={processing === request.id || limitReached}
                              >
                                ✓
                              </RequestApproveButton>
                              <RequestRejectButton
                                onClick={() => handleRejectRequest(request.id)}
                                disabled={processing === request.id}
                              >
                                ✕
                              </RequestRejectButton>
                            </RequestActions>
                          </AdminRequestCard>
                        ))}
                      </ParticipantsList>
                    )}
                  </>
                )}
              </RequestsSection>
            )}

            {/* Участники */}
            <SettingsSection>
              <SettingsTitle>👥 Участники ({participantsCount})</SettingsTitle>
              {participants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, opacity: 0.5 }}>
                  Пока нет участников
                </div>
              ) : (
                <ParticipantsList>
                  {participants.map(p => (
                    <ParticipantCard key={p.id}>
                      <ParticipantName>
                        <RequestAvatar style={{ background: 'rgba(255,255,255,0.1)' }}>
                          {getInitials(p.users.username)}
                        </RequestAvatar>
                        <span>{getDisplayName(p.users)}</span>
                      </ParticipantName>
                      <RemoveButton onClick={() => removeParticipant(p.id, p.user_id)}>
                        ✕
                      </RemoveButton>
                    </ParticipantCard>
                  ))}
                </ParticipantsList>
              )}
            </SettingsSection>

            {/* Кнопки действий */}
            <SettingsSection>
              <SettingsTitle>⚙️ Действия</SettingsTitle>
              {challenge.entry_type !== 'free' && onNavigateToRequests && (
                <SettingsButton onClick={onNavigateToRequests} style={{ marginBottom: 8 }}>
                  📬 Заявки (полный список)
                </SettingsButton>
              )}
              {onNavigateToSettings && (
                <SettingsButton onClick={onNavigateToSettings}>
                  ⚙️ Настройки вызова
                </SettingsButton>
              )}
            </SettingsSection>

            {/* Опасная зона */}
            <DangerZone>
              <SettingsTitle>🗑️ Опасная зона</SettingsTitle>
              <DangerButton onClick={() => console.log('Delete challenge')}>
                Удалить вызов
              </DangerButton>
            </DangerZone>
          </ScrollContent>
        </LeftPanel>

        {/* 👉 ПРАВАЯ ПАНЕЛЬ - ОТЧЕТЫ */}
        <RightPanel>
          <PanelHeader>
            <Title>{challenge.title}</Title>
            <Meta>
              <span>День {dayIndex + 1} / {challenge.duration_days}</span>
            </Meta>
          </PanelHeader>

          {/* Переключатель дней */}
          <DaySwitcher>
            <NavButton
              disabled={dayIndex === 0}
              onClick={() => setDayIndex(d => d - 1)}
            >
              ←
            </NavButton>
            <DayInfo>
              <DayNumber>День {dayIndex + 1}</DayNumber>
              <DayDate>{currentDate.toLocaleDateString('ru-RU')}</DayDate>
            </DayInfo>
            <NavButton
              disabled={dayIndex + 1 >= challenge.duration_days}
              onClick={() => setDayIndex(d => d + 1)}
            >
              →
            </NavButton>
          </DaySwitcher>

          {/* Статистика отчетов */}
          <StatsRow>
            <StatItem onClick={() => setActiveTab('all')}>
              <StatValue $active={activeTab === 'all'}>{stats.all}</StatValue>
              <StatLabel>Всего</StatLabel>
            </StatItem>
            <StatItem onClick={() => setActiveTab('pending')}>
              <StatValue $active={activeTab === 'pending'}>{stats.pending}</StatValue>
              <StatLabel>Ожидают</StatLabel>
            </StatItem>
            <StatItem onClick={() => setActiveTab('approved')}>
              <StatValue $active={activeTab === 'approved'}>{stats.approved}</StatValue>
              <StatLabel>Принято</StatLabel>
            </StatItem>
            <StatItem onClick={() => setActiveTab('rejected')}>
              <StatValue $active={activeTab === 'rejected'}>{stats.rejected}</StatValue>
              <StatLabel>Отклонено</StatLabel>
            </StatItem>
          </StatsRow>

          <ScrollContent>
            <Content>
              {filteredReports.length === 0 ? (
                <EmptyState>Нет отчетов в этой категории</EmptyState>
              ) : (
                filteredReports.map(r => (
                  <ReportCard key={r.id} $status={r.status}>
                    <ReportHeader>
                      <UserBlock>
                        <StyledAvatar>
                          {getInitials(r.participant?.user?.username)}
                        </StyledAvatar>
                        <UserText>
                          <Username>
                            @{r.participant?.user?.username ?? 'user'}
                          </Username>
                          <UserInfoRow>
                            <UserMeta>{r.report_date}</UserMeta>
                            {r.proof_media_urls && r.proof_media_urls.length > 0 && (
                              <UserMeta>📸 {r.proof_media_urls.length}</UserMeta>
                            )}
                          </UserInfoRow>
                        </UserText>
                      </UserBlock>
                      <StatusBadge $status={r.status}>
                        {r.status === 'pending' && '⏳'}
                        {r.status === 'approved' && '✅'}
                        {r.status === 'rejected' && '❌'}
                      </StatusBadge>
                    </ReportHeader>

                    <ReportBody>
                      <Label>Отчёт</Label>
                      <Value>
                        {challenge.report_mode === 'simple'
                          ? r.is_done ? '✅ Выполнил' : '❌ Не выполнил'
                          : `📊 ${r.value ?? 0} ${challenge.metric_name ?? ''}`}
                      </Value>

                      {r.proof_text && r.proof_text.trim() && (
                        <>
                          <Label>Комментарий</Label>
                          <CommentBox>{r.proof_text}</CommentBox>
                        </>
                      )}

                      {r.proof_media_urls && r.proof_media_urls.length > 0 && (
                        <>
                          <Label>Медиа</Label>
                          <MediaGrid>
                            {r.proof_media_urls.map((path, i) => {
                              const url = mediaUrls[path];
                              const isLoading = loadingMedia[path];

                              if (isLoading) {
                                return (
                                  <MediaItem key={i}>
                                    <MediaPreview $isLoading>
                                      <LoadingSpinner />
                                    </MediaPreview>
                                  </MediaItem>
                                );
                              }

                              if (!url) return null;

                              const isVideo = path.match(/\.(mp4|mov|webm)$/i);

                              return (
                                <MediaItem key={i}>
                                  {isVideo ? (
                                    <video
                                      src={url}
                                      controls
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        borderRadius: 12,
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src={url}
                                      alt={`proof-${i}`}
                                      onClick={() => setFullscreenImage(url)}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        borderRadius: 12,
                                        cursor: 'pointer',
                                      }}
                                    />
                                  )}
                                  <MediaCount>{i + 1}/{r.proof_media_urls!.length}</MediaCount>
                                </MediaItem>
                              );
                            })}
                          </MediaGrid>
                        </>
                      )}

                      {r.rejection_reason && (
                        <>
                          <Label>Причина</Label>
                          <Reason>{r.rejection_reason}</Reason>
                        </>
                      )}
                    </ReportBody>

                    {r.status === 'pending' && (
                      <>
                        {rejectingReportId !== r.id ? (
                          <Actions>
                            <ApproveButton onClick={() => updateStatus(r.id, 'approved')}>
                              ✓
                            </ApproveButton>
                            <RejectButton
                              onClick={() => {
                                setRejectingReportId(r.id);
                                setRejectionText('');
                              }}
                            >
                              ✕
                            </RejectButton>
                          </Actions>
                        ) : (
                          <div style={{ marginTop: 12 }}>
                            <textarea
                              value={rejectionText}
                              onChange={e => setRejectionText(e.target.value)}
                              placeholder="Причина отклонения..."
                              style={{
                                width: '100%',
                                minHeight: 60,
                                padding: 10,
                                borderRadius: 8,
                                background: '#111',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.15)',
                                fontSize: 13,
                              }}
                            />
                            <Actions style={{ marginTop: 8 }}>
                              <ApproveButton
                                disabled={!rejectionText.trim()}
                                onClick={() => updateStatus(r.id, 'rejected', rejectionText)}
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
        </RightPanel>
      </SplitContainer>

      {fullscreenImage && (
        <FullscreenOverlay onClick={() => setFullscreenImage(null)}>
          <FullscreenClose>×</FullscreenClose>
          <FullscreenImage src={fullscreenImage} onClick={e => e.stopPropagation()} />
        </FullscreenOverlay>
      )}
    </SafeArea>
  );
}