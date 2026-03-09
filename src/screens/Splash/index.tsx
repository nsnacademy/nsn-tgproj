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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 🔹 fullscreen hack
    initTelegramFullscreenHack();

    // 🔹 показываем анимацию через небольшой таймаут для надежности
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // 🔹 переход дальше через 3 секунды
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <SplashContainer>
      <Title>nsndsc</Title>
      <ProgressBar>
        <ProgressFill $isVisible={isVisible} />
      </ProgressBar>
    </SplashContainer>
  );
}