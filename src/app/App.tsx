import { useEffect } from 'react';
import { initTelegram, tg } from '../shared/lib/telegram';
import { saveTelegramUser } from '../shared/lib/supabase';

function App() {
  useEffect(() => {
    initTelegram();
    saveTelegramUser();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>nsnproj</h1>
      <p>User: {tg?.initDataUnsafe?.user?.username ?? 'guest'}</p>
    </div>
  );
}

export default App;