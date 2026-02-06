import { useEffect, useState } from 'react';

import { saveTelegramUser } from '../shared/lib/supabase';
import { GlobalStyles } from '../shared/config/globalStyles';

import { Splash } from '../screens/Splash';
import { Home } from '../screens/Home';
import { Create } from '../screens/Create';
import { CreateFlow } from '../screens/CreateFlow';
import { CreateFlowFree } from '../screens/CreateFlowFree';
import { ChallengeDetails } from '../screens/ChallengeDetails';

/* === ЭКРАНЫ === */
type Screen =
  | 'splash'
  | 'home'
  | 'create'
  | 'create-flow'
  | 'create-flow-free'
  | 'create-flow-paid'
  | 'challenge-details';

function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  // 🔑 ВАЖНО: выбранный вызов
  const [selectedChallengeId, setSelectedChallengeId] =
    useState<string | null>(null);

  useEffect(() => {
    saveTelegramUser();
  }, []);

  /* === ЕДИНАЯ НАВИГАЦИЯ === */
  const navigate = (next: Screen, challengeId?: string) => {
    if (challengeId) {
      setSelectedChallengeId(challengeId);
    }

    setScreen(next);
  };

  return (
    <>
      <GlobalStyles />

      {screen === 'splash' && (
        <Splash onFinish={() => navigate('home')} />
      )}

      {screen === 'home' && (
        <Home onNavigate={navigate} />
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
          onBack={() => navigate('create')}
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
