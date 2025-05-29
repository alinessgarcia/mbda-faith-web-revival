import React from "react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      ></div>
      {/* Overlay preto translúcido */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40 z-10"></div>
      {/* Overlay azul escuro translúcido */}
      <div className="absolute inset-0 bg-blue-900/60 z-20"></div>
      {/* Círculos decorativos */}
      <div className="absolute inset-0 opacity-10 z-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      {/* Conteúdo */}
      <div className="relative z-40 text-center p-4 max-w-5xl mx-auto">
        <h1 className="mb-0 animate-fade-in">
          <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-white block drop-shadow-lg">
            Ministério Bíblico da
          </span>
          <span className="text-6xl md:text-8xl lg:text-9xl font-bold text-blue block mt-1 relative inline-block drop-shadow-xl tracking-tight">
            Reconciliação
            <span className="block h-1 bg-blue w-full mt-2 mx-auto rounded-full shadow-lg"></span>
          </span>
        </h1>

        <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-8 max-w-4xl mx-auto mt-8 animate-fade-in leading-relaxed drop-shadow-md" style={{ animationDelay: "0.2s" }}>
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