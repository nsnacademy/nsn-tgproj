import { useEffect } from 'react';
import { SplashContainer, Title } from './styles';
import { initTelegramFullscreenHack } from '../../shared/lib/telegram';

type Props = {
  onFinish: () => void;
};

export function Splash({ onFinish }: Props) {
  useEffect(() => {
    // 🔹 fullscreen hack (как в рабочем примере)
    initTelegramFullscreenHack();

    // 🔹 переход дальше через 5 секунд
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SplashContainer>
      <Title>nsnproj</Title>
      <p>Загрузка...</p>
    </SplashContainer>
  );
}