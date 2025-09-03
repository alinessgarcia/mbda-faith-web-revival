import React, { useState, useEffect } from 'react';

const BackgroundImage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const imageSrc = isMobile ? "/images/mobile-site.jpg" : "/images/desktop-hero.png";

  return (
    <div
      className={`background-image ${isMobile ? 'background-image-mobile' : 'background-image-desktop'}`}
      style={{
        backgroundImage: `url(${imageSrc})`,
      }}
    />
  );


};

export default BackgroundImage;