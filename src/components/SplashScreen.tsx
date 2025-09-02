import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    // Garantir que a splash apareça por pelo menos 1.5s
    const minDisplayTime = setTimeout(() => {
      setIsVisible(false);
      // Aguardar animação de saída antes de chamar onComplete
      setTimeout(onComplete, 500);
    }, 1500);

    return () => clearTimeout(minDisplayTime);
  }, [onComplete]);

  return (
    <div className={`splash-screen ${!isVisible ? 'fade-out' : ''}`}>
      <div className="splash-background">
        <div className="splash-gradient"></div>
        <div className="splash-glass"></div>
      </div>
      
      <div className="splash-content">
        <div className="splash-logo-container">
          <img
            src="/images/logo-maio.png"
            alt="MBdaR Logo"
            className={`splash-logo ${logoLoaded ? 'loaded' : ''}`}
            onLoad={() => setLogoLoaded(true)}
          />
          <div className="splash-ring"></div>
        </div>
        
        <div className="splash-text">
          <h1 className="splash-title">MBdaReconciliação</h1>
          <p className="splash-subtitle">Ministério Bíblico da Reconciliação</p>
        </div>
        
        <div className="splash-loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;