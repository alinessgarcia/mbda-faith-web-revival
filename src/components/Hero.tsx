
import React from "react";

const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://imgur.com/PVSNBoJ.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-primary/40"></div>
      <div className="relative z-10 text-center p-4">
        <h1 className="mb-0 animate-fade-in">
          <span className="text-5xl md:text-6xl font-bold text-white block">
            Ministério Bíblico da
          </span>
          <span className="text-6xl md:text-8xl font-bold text-amber-400 block mt-0.5 relative inline-block">
            Reconciliação
            <span className="block h-1 bg-amber-400 w-full mt-1 mx-auto"></span>
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Igreja cristã voltada ao ensino profundo da Palavra de Deus, comunhão familiar e edificação espiritual.
        </p>
      </div>
    </section>
  );
};

export default Hero;
