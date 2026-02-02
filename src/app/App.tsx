import { useEffect, useState } from 'react';
import { initTelegram } from '../shared/lib/telegram';
import { saveTelegramUser } from '../shared/lib/supabase';

import { Splash } from '../screens/Splash';
import { Home } from '../screens/Home';

type Screen = 'splash' | 'home';

function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  useEffect(() => {
    initTelegram();
    saveTelegramUser();
  }, []);

  return (
    <>
      {screen === 'splash' && (
        <Splash onFinish={() => setScreen('home')} />
      )}
      {screen === 'home' && <Home />}
    </>
  );
}

export default App;