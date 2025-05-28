
import React from "react";

const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    style={{
      backgroundImage: "url('/images/nova-hero.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Overlay escuro para melhorar a leitura do texto */}
    <div className="absolute inset-0 bg-black/50 z-0"></div>

    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <h1 className="animate-fade-in">
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white block drop-shadow-xl">
          Ministério Bíblico
        </span>
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white block drop-shadow-xl -mt-1">
          da
        </span>
        <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-amber-400 block mt-2 drop-shadow-2xl">
          Reconciliação
          <span className="block h-1 bg-amber-400 w-3/4 sm:w-1/2 mt-2 mx-auto rounded-full shadow-md"></span>
        </span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-white/90 mt-6 mb-10 drop-shadow-md leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
        Somos uma Igreja Cristã voltada ao ensino profundo da Palavra de Deus, comunhão familiar e edificação espiritual.
      </p>

      <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <a 
          href="#quem-somos" 
          className="inline-flex items-center bg-amber-400 hover:bg-amber-300 text-primary font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-300/50"
        >
          Conheça Nossa Igreja
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </div>
  </section>
  );
};

export default Hero;
