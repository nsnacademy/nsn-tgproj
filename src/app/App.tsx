import { useEffect, useState } from 'react';

import { GlobalStyles } from '../shared/config/globalStyles';
import {
  initTelegramFullscreenHack,
  applyTelegramLayoutVars,
} from '../shared/lib/telegram';

import { Splash } from '../screens/Splash';
import { Home } from '../screens/Home';

type Screen = 'splash' | 'home';

function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  useEffect(() => {
    applyTelegramLayoutVars();
    initTelegramFullscreenHack();
  }, []);

  return (
    <>
      <GlobalStyles />

      {screen === 'splash' && (
        <Splash onFinish={() => setScreen('home')} />
      )}

      {screen === 'home' && <Home />}
    </>
  );
}

export default App;