import React from 'react';

const DesktopAnimation = () => {
  return (
    <div className="desktop-animation-container">
      {/* Fundo estático */}
      <img 
        src="/images/desktop-bg-estatico.svg" 
        alt="Desktop background" 
        className="desktop-layer desktop-bg-static"
      />
      
      {/* Nuvens animadas */}
      <img 
        src="/images/desktop-bg-nuvem-animar.svg" 
        alt="Cloud 1" 
        className="desktop-layer desktop-cloud-1"
      />
      
      <img 
        src="/images/desktop-bg-nuvem-animar2.svg" 
        alt="Cloud 2" 
        className="desktop-layer desktop-cloud-2"
      />
      
      {/* Relógio */}
      <img 
        src="/images/desktop-relógio.svg" 
        alt="Clock" 
        className="desktop-layer desktop-clock"
      />
      
      {/* Ponteiro do relógio */}
      <img 
        src="/images/desktop-ponteiro.svg" 
        alt="Clock pointer" 
        className="desktop-layer desktop-pointer"
      />
    </div>
  );
};

export default DesktopAnimation;