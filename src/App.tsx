import { useEffect } from 'react';
import { initTelegram, tg } from '../src/shared/lib/telegram';

function App() {
  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>nsnproj</h1>
      <p>User: {tg?.initDataUnsafe?.user?.username ?? 'guest'}</p>
    </div>
  );
}

export default App;