import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero-section bg-black/60 relative">
      {/* Conteúdo */}
      <div className="relative z-20 text-left w-full pl-8 pr-4 flex items-start justify-start h-full hero-content-position hero-content-desktop-lower">
        <div className="max-w-3xl">
          <h1 className="mb-2 md:mb-4 animate-fade-in leading-tight">
            <span className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white block drop-shadow-2xl mb-2 md:mb-2 tracking-tight translate-y-2 md:translate-y-2">
              Ministério Bíblico da
            </span>
            <span className="text-6xl md:text-9xl lg:text-12xl font-bold text-yellow-custom block -mt-2 md:-mt-2 drop-shadow-xl tracking-tight">
              Reconciliação
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-white mb-2 md:mb-12 animate-fade-in leading-relaxed drop-shadow-md hero-content-delay-1 tracking-wider">
            <b>Somos uma Igreja Cristã voltada ao ensino profundo da Palavra de Deus, comunhão familiar e edificação espiritual.</b>
            
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