import { useEffect, useState } from 'react';
import { 
  SplashContainer, 
  Title, 
  ProgressBar, 
  ProgressFill
} from './styles';
import { initTelegramFullscreenHack } from '../../shared/lib/telegram';

type Props = {
  onFinish: () => void;
};

export function Splash({ onFinish }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 🔹 fullscreen hack
    initTelegramFullscreenHack();

    // 🔹 анимация прогресса за 3 секунды
    const startTime = Date.now();
    const duration = 3000;

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);

      if (elapsed < duration) {
        requestAnimationFrame(animateProgress);
      } else {
        onFinish();
      }
    };

    const frame = requestAnimationFrame(animateProgress);

    return () => cancelAnimationFrame(frame);
  }, [onFinish]);

  return (
    <SplashContainer>
      <Title>cronos</Title>
      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>
    </SplashContainer>
  );
}