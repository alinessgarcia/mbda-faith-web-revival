import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero-section hero-bg">
      {/* Conteúdo */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
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