import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero-section flex items-center justify-center overflow-hidden mt-16">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 w-full h-full hero-bg z-0" />

      {/* Overlay glassmorphism com gradiente azul */}
      <div className="absolute inset-0 gradient-blue-glass z-10" />

      {/* Círculos decorativos */}
      <div className="absolute inset-0 opacity-10 z-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse hero-decorative-circle-1" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-400 rounded-full blur-3xl animate-pulse hero-decorative-circle-2" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-40 text-center max-w-5xl mx-auto">
        <h1 className="mb-6 animate-fade-in leading-tight">
          <span className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white block drop-shadow-2xl mb-2 tracking-tight">
            Ministério Bíblico da
          </span>
          <span className="text-6xl md:text-8xl lg:text-9xl font-bold text-white block mt-0 relative inline-block drop-shadow-xl tracking-tight">
            Reconciliação
            <span className="block h-1 bg-blue-400 w-full mt-2 mx-auto rounded-full shadow-lg" />
          </span>
        </h1>

        <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-8 max-w-4xl mx-auto mt-0 animate-fade-in leading-snug drop-shadow-md hero-content-delay-1">
          Somos uma Igreja Cristã voltada ao ensino profundo da Palavra de Deus, comunhão familiar e edificação espiritual.
        </p>

        <div className="animate-fade-in hero-content-delay-2">
          <a
            href="#quem-somos"
            className="inline-flex items-center bg-amber-400 hover:bg-amber-300 text-primary font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-300/50"
          >
            Conheça Nossa Igreja
            <ChevronDown className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;