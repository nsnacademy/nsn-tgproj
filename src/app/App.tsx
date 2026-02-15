import { useEffect, useRef, useState } from 'react';

import { saveTelegramUser, supabase } from '../shared/lib/supabase';
import { CreateFlowPaid } from '../screens/CreateFlowPaid';

import { GlobalStyles } from '../shared/config/globalStyles';

import { Splash } from '../screens/Splash';
import { Home } from '../screens/Home';
import { Create } from '../screens/Create';
import { CreateFlow } from '../screens/CreateFlow';
import { CreateFlowFree } from '../screens/CreateFlowFree';
import { ChallengeDetails } from '../screens/ChallengeDetails';
import ChallengeProgress from '../screens/ChallengeProgress';
import ChallengeReport from '../screens/ChallengeReport';
import Profile from '../screens/Profile';
import Admin from '../screens/Admin';
import AdminChallenge from '../screens/AdminChallenge';
import InviteSettings from '../screens/InviteSettings';
import ChallengePaid from '../screens/ChallengePaid';
import ChallengeCondition from '../screens/ChallengeCondition';

/* =========================
   SCREENS
========================= */

export type Screen =
  | 'splash'
  | 'home'
  | 'create'
  | 'create-flow'
  | 'create-flow-free'
  | 'create-flow-paid'
  | 'challenge-details'
  | 'challenge-paid'
  | 'challenge-condition'
  | 'challenge-progress'
  | 'challenge-report'
  | 'profile'
  | 'admin'
  | 'admin-challenge'
  | 'invite-settings';

function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  const [selectedChallengeId, setSelectedChallengeId] =
    useState<string | null>(null);

  const [selectedParticipantId, setSelectedParticipantId] =
    useState<string | null>(null);

  const [reportDate, setReportDate] =
    useState<string | null>(null);

  const [reportMode, setReportMode] =
    useState<'simple' | 'result'>('simple');

  const [metricName, setMetricName] = useState('');

  const [homeRefreshKey, setHomeRefreshKey] = useState(0);

  const inviteHandledRef = useRef(false);

  /* =========================
     INIT TELEGRAM + SAVE USER
  ========================= */

  useEffect(() => {
    saveTelegramUser();

    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      (tg as any).disableClosingConfirmation?.();
    }
  }, []);

  /* =========================
     AUTO → PROGRESS
  ========================= */

  useEffect(() => {
    const handler = (e: any) => {
      navigate(
        'challenge-progress',
        e.detail.challengeId,
        e.detail.participantId
      );
    };

    window.addEventListener('navigate-to-progress', handler);
    return () =>
      window.removeEventListener('navigate-to-progress', handler);
  }, []);

  /* =========================
     HANDLE INVITE LINKS
  ========================= */

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    const startParam = (tg.initDataUnsafe as any)?.start_param;
    if (!startParam || inviteHandledRef.current) return;

    console.log('🔗 [APP] Получен start_param:', startParam);
    inviteHandledRef.current = true;

    // Обработка разных типов ссылок
    if (startParam.startsWith('invite_')) {
      // Ссылка-приглашение (для вступления в вызов)
      const code = startParam.replace('invite_', '');
      console.log('🔗 [APP] Обработка invite с кодом:', code);

      supabase
        .rpc('get_challenge_by_invite', { p_code: code })
        .then(({ data, error }) => {
          if (error) {
            console.error('[APP] Ошибка получения challenge по invite:', error);
            return;
          }
          
          if (!data) {
            console.log('[APP] Вызов не найден по коду:', code);
            return;
          }

          console.log('[APP] Найден вызов по invite:', data);
          setSelectedChallengeId(data);
          
          // Определяем тип вызова и переходим на соответствующий экран
          supabase
            .from('challenges')
            .select('entry_type')
            .eq('id', data)
            .single()
            .then(({ data: challengeData }) => {
              if (challengeData) {
                const entryType = challengeData.entry_type;
                console.log('[APP] Тип вызова:', entryType);
                
                if (entryType === 'free') {
                  setScreen('challenge-details');
                } else if (entryType === 'paid') {
                  setScreen('challenge-paid');
                } else if (entryType === 'condition') {
                  setScreen('challenge-condition');
                }
              }
            });
        });

    } else if (startParam.startsWith('challenge_')) {
      // Прямая ссылка на вызов (для совместимости)
      const idFromLink = startParam.replace('challenge_', '');
      console.log('🔗 [APP] Обработка challenge ссылки с ID:', idFromLink);

      setSelectedChallengeId(idFromLink);
      
      supabase
        .from('challenges')
        .select('entry_type')
        .eq('id', idFromLink)
        .single()
        .then(({ data: challengeData }) => {
          if (challengeData) {
            const entryType = challengeData.entry_type;
            console.log('[APP] Тип вызова:', entryType);
            
            if (entryType === 'free') {
              setScreen('challenge-details');
            } else if (entryType === 'paid') {
              setScreen('challenge-paid');
            } else if (entryType === 'condition') {
              setScreen('challenge-condition');
            }
          }
        });
    }
  }, []);

  /* =========================
     NAVIGATION (SOURCE OF TRUTH)
  ========================= */

  const navigate = (
    next: Screen,
    challengeId?: string,
    participantId?: string
  ) => {
    if (challengeId !== undefined) {
      setSelectedChallengeId(challengeId);
    }

    if (participantId !== undefined) {
      setSelectedParticipantId(participantId);
    }

    if (next !== 'challenge-report') {
      setReportDate(null);
    }

    setScreen(next);
  };

  const openReport = (data: {
    challengeId: string;
    participantId: string;
    reportDate: string;
    reportMode: 'simple' | 'result';
    metricName: string | null;
  }) => {
    setSelectedChallengeId(data.challengeId);
    setSelectedParticipantId(data.participantId);
    setReportDate(data.reportDate);

    setReportMode(data.reportMode);
    if (data.metricName) setMetricName(data.metricName);

    setScreen('challenge-report');
  };

  const goHomeAndRefresh = () => {
    setHomeRefreshKey(k => k + 1);
    setScreen('home');
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <>
      <GlobalStyles />

      {screen === 'splash' && (
        <Splash onFinish={() => navigate('home')} />
      )}

      {screen === 'home' && (
        <Home
          screen={screen}
          onNavigate={navigate}
          refreshKey={homeRefreshKey}
        />
      )}

      {screen === 'create' && (
        <Create
          screen={screen}
          onNavigate={navigate}
        />
      )}

      {screen === 'create-flow' && (
        <CreateFlow onNavigate={navigate} />
      )}

      {screen === 'create-flow-free' && (
        <CreateFlowFree onNavigate={navigate} />
      )}

      {screen === 'create-flow-paid' && (
        <CreateFlowPaid onNavigate={navigate} />
      )}

      {screen === 'challenge-details' && selectedChallengeId && (
        <ChallengeDetails
          challengeId={selectedChallengeId}
          onNavigateHome={goHomeAndRefresh}
        />
      )}

      {screen === 'challenge-paid' && selectedChallengeId && (
        <ChallengePaid
          challengeId={selectedChallengeId}
          onBack={() => navigate('create')}
        />
      )}

      {screen === 'challenge-condition' && selectedChallengeId && (
        <ChallengeCondition
          challengeId={selectedChallengeId}
          onBack={() => navigate('create')}
        />
      )}

      {screen === 'challenge-progress' &&
        selectedChallengeId &&
        selectedParticipantId && (
          <ChallengeProgress
            challengeId={selectedChallengeId}
            participantId={selectedParticipantId}
            onBack={goHomeAndRefresh}
            onOpenReport={openReport}
          />
        )}

      {screen === 'challenge-report' &&
        selectedChallengeId &&
        selectedParticipantId &&
        reportDate && (
          <ChallengeReport
            challengeId={selectedChallengeId}
            participantId={selectedParticipantId}
            reportDate={reportDate}
            reportMode={reportMode}
            metricName={metricName}
            onBack={() =>
              navigate(
                'challenge-progress',
                selectedChallengeId,
                selectedParticipantId
              )
            }
          />
        )}

      {screen === 'profile' && (
        <Profile
          screen={screen}
          onNavigate={navigate}
        />
      )}

      {screen === 'admin' && (
        <Admin
          screen={screen}
          onNavigate={navigate}
        />
      )}

      {screen === 'admin-challenge' && selectedChallengeId && (
        <AdminChallenge
          challengeId={selectedChallengeId}
          onBack={() => navigate('admin')}
          onNavigate={(screen: Screen, id?: string) => navigate(screen, id)}
        />
      )}

      {screen === 'invite-settings' && selectedChallengeId && (
        <InviteSettings
          challengeId={selectedChallengeId}
          onBack={() => navigate('admin-challenge', selectedChallengeId)}
        />
      )}
    </>
  );
}

export default App;