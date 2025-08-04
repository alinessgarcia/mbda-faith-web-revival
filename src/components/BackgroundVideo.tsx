import React, { useState, useEffect } from 'react';

const BackgroundVideo = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [useVideo, setUseVideo] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const videoSrc = isMobile ? "/videos/hero-video-mobile.mp4" : "/videos/hero-video.mp4";
  const imageSrc = isMobile ? "/images/hero-bg-mobile.jpg" : "/images/hero-bg.jpg";

  if (!useVideo) {
    return (
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          zIndex: -1
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: -1 }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        poster={imageSrc}
        style={{
          objectPosition: isMobile ? 'center' : 'center bottom',
        }}
        onError={() => {
          console.log('❌ Video failed, switching to image');
          setUseVideo(false);
        }}
        onLoadedData={() => console.log('✅ Video loaded successfully')}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );


};

export default BackgroundVideo;