
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const imagens = [
  {
    src: "/images/escolinha1.jpg",
    alt: "Atividade especial para famílias na MBdA Reconciliação"
  },
  {
    src: "/images/escolinha2.jpg",
    alt: "Encontro familiar na igreja MBdA Reconciliação"
  },
  {
    src: "/images/escolinha3.jpg",
    alt: "Celebração familiar na MBdA Reconciliação"
  },
  {
    src: "/images/escolinha4.jpg",
    alt: "Momento de comunhão familiar na igreja"
  },
  {
    src: "/images/culto1.jpg",
    alt: "Evento especial do Espaço Família MBdA"
  }
];

const EspacoFamilia = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section id="espaco-familia" className="section-padding bg-white">
      <div className="container mx-auto">
        {/* Título com glassmorphism */}
        <div className="text-center mb-16">
          <div className="glass-card-modern inline-block px-8 py-4 mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-custom drop-shadow-lg">
              👨‍👩‍👧‍👦 Espaço Família
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Valorizamos as famílias e acreditamos que elas são a base da sociedade
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto px-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative">
              <Carousel 
                className="w-full"
                plugins={[plugin.current]}
                opts={{
                  align: "center",
                  loop: true,
                }}
                onMouseEnter={() => {
                  if (plugin.current) plugin.current.stop();
                }}
                onMouseLeave={() => {
                  if (plugin.current) plugin.current.reset();
                }}
              >
                <CarouselContent>
                  {imagens.map((imagem, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <div className="overflow-hidden rounded-lg shadow-xl">
                          <img
                            src={imagem.src}
                            alt={imagem.alt}
                            className="w-full h-56 sm:h-72 md:h-80 lg:h-[400px] object-cover transition-all hover:scale-105 duration-500"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-primary/20 hover:border-primary text-primary" />
                <CarouselNext className="right-2 bg-white/80 hover:bg-white border-primary/20 hover:border-primary text-primary" />
              </Carousel>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            {imagens.map((_, index) => (
              <span
                key={index}
                className="h-2 w-2 mx-1 rounded-full bg-gray-300 transition-all hover:bg-primary cursor-pointer"
                aria-label={`Imagem ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EspacoFamilia;
