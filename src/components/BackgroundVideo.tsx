import React, { useState, useEffect } from 'react';

const BackgroundVideo = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const videoSrc = isMobile ? "/videos/hero-bg-mobile-animado.mp4" : "/videos/hero-animado.mp4";
  const posterSrc = isMobile ? "/images/hero-bg-mobile.jpg" : "/images/hero-bg.jpg";

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="fixed top-0 left-0 w-full h-full object-cover"
      poster={posterSrc}
      style={{ zIndex: -1 }}
      onLoadStart={() => console.log('Video loading:', videoSrc)}
      onCanPlay={() => console.log('Video can play:', videoSrc)}
      onError={(e) => console.error('Video error:', e)}
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
};

export default BackgroundVideo;