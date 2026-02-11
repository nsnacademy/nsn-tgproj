import { useEffect, useState } from 'react';

import { saveTelegramUser } from '../shared/lib/supabase';
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

/* === ЭКРАНЫ === */
type Screen =
  | 'splash'
  | 'home'
  | 'create'
  | 'create-flow'
  | 'create-flow-free'
  | 'create-flow-paid'
  | 'challenge-details'
  | 'challenge-progress'
  | 'challenge-report'
  | 'profile'
  | 'admin'
  | 'admin-challenge';

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

  useEffect(() => {
    saveTelegramUser();
  }, []);

  /* === НАВИГАЦИЯ === */
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

    // ⬅️ при выходе из отчёта — чистим дату
    if (next !== 'challenge-report') {
      setReportDate(null);
    }

    setScreen(next);
  };

  /* === ОТКРЫТЬ ОТЧЁТ === */
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

    if (data.reportMode) setReportMode(data.reportMode);
    if (data.metricName) setMetricName(data.metricName);

    setScreen('challenge-report');
  };

  const goHomeAndRefresh = () => {
    setHomeRefreshKey(k => k + 1);
    setScreen('home');
  };

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
        <Create onNavigate={navigate} />
      )}

      {screen === 'create-flow' && (
        <CreateFlow onNavigate={navigate} />
      )}

      {screen === 'create-flow-free' && (
        <CreateFlowFree onNavigate={navigate} />
      )}

      {screen === 'challenge-details' && selectedChallengeId && (
        <ChallengeDetails
          challengeId={selectedChallengeId}
          onNavigateHome={goHomeAndRefresh}
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

      {/* ✅ ВАЖНО: reportDate ОБЯЗАТЕЛЕН */}
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
        />
      )}

      {screen === 'create-flow-paid' && (
        <div
          style={{
            minHeight: '100vh',
            background: '#000',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          CreateFlowPaid (в разработке)
        </div>
      )}
    </>
  );
}

export default App;
