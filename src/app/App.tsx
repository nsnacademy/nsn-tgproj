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

/* === ЭКРАНЫ === */
type Screen =
  | 'splash'
  | 'home'
  | 'create'
  | 'create-flow'
  | 'create-flow-free'
  | 'create-flow-paid'
  | 'challenge-details'
  | 'challenge-progress';

function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  // выбранный вызов
  const [selectedChallengeId, setSelectedChallengeId] =
    useState<string | null>(null);

  // выбранный participant
  const [selectedParticipantId, setSelectedParticipantId] =
    useState<string | null>(null);

  // 🔁 КЛЮЧ ОБНОВЛЕНИЯ HOME
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
    if (challengeId) {
      setSelectedChallengeId(challengeId);
    }

    if (participantId) {
      setSelectedParticipantId(participantId);
    }

    setScreen(next);
  };

  /* === ЯВНОЕ ОБНОВЛЕНИЕ HOME === */
  const goHomeAndRefresh = () => {
    console.log('[APP] goHomeAndRefresh');

    setHomeRefreshKey((k) => {
      const next = k + 1;
      console.log('[APP] homeRefreshKey', next);
      return next;
    });

    setScreen('home');
  };

  return (
    <>
      <GlobalStyles />

      {screen === 'splash' && (
        <Splash onFinish={() => navigate('home')} />
      )}

      {screen === 'home' && (
        <>
          {console.log('[APP] render Home with refreshKey', homeRefreshKey)}
          <Home
            onNavigate={navigate}
            refreshKey={homeRefreshKey}
          />
        </>
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
