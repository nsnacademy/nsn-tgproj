import { useEffect, useState } from 'react';
import { saveTelegramUser } from '../shared/lib/supabase';

import { GlobalStyles } from '../shared/config/globalStyles';

import { Splash } from '../screens/Splash';
import { Home } from '../screens/Home';
import { Create } from '../screens/Create';
import { CreateFlow } from '../screens/CreateFlow';

type Screen =
  | 'splash'
  | 'home'
  | 'create'
  | 'create-flow';

type NavigateScreen = Exclude<Screen, 'splash'>;

function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  useEffect(() => {
    saveTelegramUser();
  }, []);

  // 👇 ВАЖНО: ОБЁРТКА
  const navigate = (next: NavigateScreen) => {
    setScreen(next);
  };

  return (
    <>
      <GlobalStyles />

      {screen === 'splash' && (
        <Splash onFinish={() => setScreen('home')} />
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
    </>
  );
}

export default App;
