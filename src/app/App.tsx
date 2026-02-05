import { useEffect, useState } from 'react';
import { saveTelegramUser } from '../shared/lib/supabase';

import { GlobalStyles } from '../shared/config/globalStyles';

import { Splash } from '../screens/Splash';
import { Home } from '../screens/Home';
import { Create } from '../screens/Create';

type Screen = 'splash' | 'home' | 'create';

function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  useEffect(() => {
    saveTelegramUser();
  }, []);

  return (
    <>
      <GlobalStyles />

      {screen === 'splash' && (
        <Splash onFinish={() => setScreen('home')} />
      )}

      {screen === 'home' && (
        <Home onNavigate={setScreen} />
      )}

      {screen === 'create' && (
        <Create onNavigate={setScreen} />
      )}
    </>
  );
}

export default App;