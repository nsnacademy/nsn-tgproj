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
  StyledAvatar, // 👈 Заменили Avatar на StyledAvatar
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
  FixedTop,
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
  entry_type: 'free' | 'paid' | 'condition';
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
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loadingMedia, setLoadingMedia] = useState<Record<string, boolean>>({});

  // 👉 состояние для отклонения
  const [rejectingReportId, setRejectingReportId] = useState<string | null>(null);
  const [rejectionText, setRejectionText] = useState('');

  /* === LOAD CHALLENGE === */
  useEffect(() => {
    console.log('📋 [ADMIN CHALLENGE] Загрузка данных вызова:', challengeId);
    
    supabase
      .from('challenges')
      .select('title, report_mode, metric_name, start_at, duration_days, entry_type')
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

  /* === LOAD REPORTS === */
  useEffect(() => {
    if (!challenge) {
      console.log('⏳ [ADMIN CHALLENGE] Ожидание загрузки challenge...');
      return;
    }

    const date = new Date(challenge.start_at);
    date.setDate(date.getDate() + dayIndex);
    const reportDate = date.toISOString().slice(0, 10);

    console.log('🔍 [ADMIN CHALLENGE] Загрузка отчетов:', {
      challengeId,
      dayIndex,
      reportDate,
      challengeTitle: challenge.title
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
        participant:participants!inner (
          user:users!inner ( 
            username 
          )
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

        console.log('✅ [ADMIN CHALLENGE] Отчеты загружены:', {
          count: data?.length || 0,
          reports: data?.map(r => ({
            id: r.id,
            username: r.participant?.user?.username,
            status: r.status,
            mediaCount: r.proof_media_urls?.length || 0
          }))
        });

        setReports(data ?? []);

        if (!data || data.length === 0) {
          console.log('ℹ️ [ADMIN CHALLENGE] Нет отчетов за этот день');
          return;
        }

        // Собираем все пути к медиа
        const allMediaPaths: string[] = [];
        data.forEach(report => {
          if (report.proof_media_urls) {
            allMediaPaths.push(...report.proof_media_urls);
          }
        });

        console.log('📸 [ADMIN CHALLENGE] Медиа файлы для загрузки:', {
          total: allMediaPaths.length,
          paths: allMediaPaths
        });

        // Загружаем signed URLs для каждого медиа
        const urls: Record<string, string> = {};
        
        for (const path of allMediaPaths) {
          if (mediaUrls[path]) {
            console.log('♻️ [ADMIN CHALLENGE] Медиа уже загружено, используем кэш:', path);
            continue;
          }

          setLoadingMedia(prev => ({ ...prev, [path]: true }));
          console.log('⏳ [ADMIN CHALLENGE] Запрос signed URL для:', path);

          const { data: signed, error: signedError } = await supabase.storage
            .from('report-media')
            .createSignedUrl(path, 60 * 60); // 1 час

          if (signedError) {
            console.error('❌ [ADMIN CHALLENGE] Ошибка получения signed URL:', {
              path,
              error: signedError
            });
          } else if (signed?.signedUrl) {
            console.log('✅ [ADMIN CHALLENGE] Signed URL получен:', {
              path,
              url: signed.signedUrl.substring(0, 50) + '...'
            });
            urls[path] = signed.signedUrl;
          }

          setLoadingMedia(prev => ({ ...prev, [path]: false }));
        }

        if (Object.keys(urls).length > 0) {
          console.log('📦 [ADMIN CHALLENGE] Обновление mediaUrls:', {
            newUrls: Object.keys(urls).length
          });
          setMediaUrls(prev => ({
            ...prev,
            ...urls,
          }));
        }
      });
  }, [challenge, dayIndex, challengeId]);

  if (!challenge) {
    console.log('⏳ [ADMIN CHALLENGE] Рендер заглушки загрузки...');
    return (
      <SafeArea>
        <FixedTop>
          <Header>
            <BackButton onClick={onBack}>←</BackButton>
            <div>
              <Title>Загрузка...</Title>
            </div>
          </Header>
        </FixedTop>
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

  console.log('📊 [ADMIN CHALLENGE] Статистика отчетов:', {
    day: dayIndex + 1,
    stats,
    activeTab
  });

  // Фильтрация отчетов по вкладке
  const filteredReports = activeTab === 'all' 
    ? reports 
    : reports.filter(r => r.status === activeTab);

  console.log('🎨 [ADMIN CHALLENGE] Отчеты для отображения:', {
    tab: activeTab,
    count: filteredReports.length,
    reports: filteredReports.map(r => ({
      id: r.id,
      username: r.participant?.user?.username,
      status: r.status,
      mediaCount: r.proof_media_urls?.length || 0
    }))
  });

  /* === UPDATE STATUS === */
  const updateStatus = async (
    reportId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string
  ) => {
    console.log('🔄 [ADMIN CHALLENGE] Обновление статуса отчета:', {
      reportId,
      status,
      rejectionReason
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

    if (error) {
      console.error('❌ [ADMIN CHALLENGE] Ошибка обновления статуса:', error);
      return;
    }

    console.log('✅ [ADMIN CHALLENGE] Статус обновлен:', data);
    
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

    setRejectingReportId(null);
    setRejectionText('');
  };

  const handleBackToAdmin = () => {
    console.log('👈 [ADMIN CHALLENGE] Возврат в админ-панель');
    onBack();
  };

  const openFullscreen = (url: string) => {
    console.log('🖼️ [ADMIN CHALLENGE] Открытие полноэкранного режима:', url.substring(0, 50) + '...');
    setFullscreenImage(url);
  };

  const getInitials = (username: string | null) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  return (
    <SafeArea>
      <FixedTop>
        <Header>
          <BackButton onClick={handleBackToAdmin}>←</BackButton>
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
            onClick={() => {
              console.log('⬅️ [ADMIN CHALLENGE] Переключение на предыдущий день:', dayIndex);
              setDayIndex(d => d - 1);
            }}
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
            onClick={() => {
              console.log('➡️ [ADMIN CHALLENGE] Переключение на следующий день:', dayIndex + 2);
              setDayIndex(d => d + 1);
            }}
          >
            →
          </NavButton>
        </DaySwitcher>

        {/* Статистика */}
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
      </FixedTop>

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
                        <UserMeta>Отправлено: {r.report_date}</UserMeta>
                        {r.proof_media_urls && r.proof_media_urls.length > 0 && (
                          <UserMeta>
                            📸 {r.proof_media_urls.length} файл(ов)
                          </UserMeta>
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

                  {/* 📸 МЕДИА с улучшенным отображением */}
{r.proof_media_urls && r.proof_media_urls.length > 0 && (
  <>
    <Label>Медиа доказательства</Label>
    <MediaGrid>
      {r.proof_media_urls.map((path, i) => {
        const url = mediaUrls[path];
        const isLoading = loadingMedia[path];
        const totalFiles = r.proof_media_urls ? r.proof_media_urls.length : 0;
        
        console.log(`🖼️ [ADMIN CHALLENGE] Отображение медиа ${i + 1}:`, {
          path,
          hasUrl: !!url,
          isLoading,
          status: r.status
        });

        if (isLoading) {
          return (
            <MediaItem key={i}>
              <MediaPreview $isLoading>
                <LoadingSpinner />
              </MediaPreview>
            </MediaItem>
          );
        }

        if (!url) {
          return (
            <MediaItem key={i}>
              <MediaPreview $error>
                <div>❌</div>
              </MediaPreview>
              <MediaCount>Ошибка</MediaCount>
            </MediaItem>
          );
        }

        const isVideo = path.toLowerCase().includes('.mp4')
          || path.toLowerCase().includes('.mov')
          || path.toLowerCase().includes('.webm');

        return (
          <MediaItem key={i}>
            {isVideo ? (
              <video
                src={url}
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
            ) : (
              <MediaPreview 
                $imageUrl={url}
                onClick={() => openFullscreen(url)}
              />
            )}
            <MediaCount>{i + 1}/{totalFiles}</MediaCount>
          </MediaItem>
        );
      })}
    </MediaGrid>
  </>
)}

                  {r.rejection_reason && (
                    <>
                      <Label>Причина отклонения</Label>
                      <Reason>{r.rejection_reason}</Reason>
                    </>
                  )}
                </ReportBody>

                {r.status === 'pending' && (
                  <>
                    {rejectingReportId !== r.id ? (
                      <Actions>
                        <ApproveButton onClick={() => updateStatus(r.id, 'approved')}>
                          ✓ Засчитать
                        </ApproveButton>
                        <RejectButton
                          onClick={() => {
                            console.log('🔴 [ADMIN CHALLENGE] Начало отклонения отчета:', r.id);
                            setRejectingReportId(r.id);
                            setRejectionText('');
                          }}
                        >
                          ✕ Отклонить
                        </RejectButton>
                      </Actions>
                    ) : (
                      <div style={{ marginTop: 12 }}>
                        <Label>Причина отклонения</Label>
                        <textarea
                          value={rejectionText}
                          onChange={e => setRejectionText(e.target.value)}
                          placeholder="Опишите причину..."
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

      {fullscreenImage && (
        <FullscreenOverlay onClick={() => setFullscreenImage(null)}>
          <FullscreenClose onClick={() => setFullscreenImage(null)}>
            ×
          </FullscreenClose>
          <FullscreenImage 
            src={fullscreenImage} 
            alt="fullscreen"
            onClick={e => e.stopPropagation()}
          />
        </FullscreenOverlay>
      )}
    </SafeArea>
  );
}