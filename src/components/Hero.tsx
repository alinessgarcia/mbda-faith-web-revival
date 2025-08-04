import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero-section bg-black/60">
      {/* Conteúdo */}
      <div className="relative z-20 text-left w-full pl-8 pr-4 flex items-start justify-start h-full pt-32">
        <div className="max-w-3xl">
          <h1 className="mb-2 md:mb-4 animate-fade-in leading-tight">
            <span className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white block drop-shadow-2xl mb-0 md:mb-1 tracking-tight">
              Ministério Bíblico da
            </span>
            <span className="text-6xl md:text-8xl lg:text-9xl font-bold text-yellow-custom block mt-0 drop-shadow-xl tracking-tight">
              Reconciliação
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-white/95 mb-6 md:mb-8 animate-fade-in leading-relaxed drop-shadow-md hero-content-delay-1">
            Somos uma Igreja Cristã voltada ao ensino profundo da Palavra de Deus, comunhão familiar e edificação espiritual.
          </p>

          <div className="animate-fade-in hero-content-delay-2">
            <a
              href="#quem-somos"
              className="inline-flex items-center bg-yellow-custom hover:bg-orange-custom text-primary font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-300/50"
            >
              Conheça Nossa Igreja
              <ChevronDown className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;