import { useEffect } from 'react';
import { SplashContainer, Title } from './styles';

type Props = {
  onFinish: () => void;
};

export function Splash({ onFinish }: Props) {
  useEffect(() => {
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