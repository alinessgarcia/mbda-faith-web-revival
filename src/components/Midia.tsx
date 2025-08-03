
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
    src: "/images/agenda.jpg",
    alt: "Momento especial da comunidade MBdA Reconciliação"
  },
  {
    src: "/images/atos-dos-apostolos.jpg", 
    alt: "Celebração na igreja MBdA Reconciliação"
  },
  {
    src: "/images/casamento3.jpg",
    alt: "Atividade da igreja MBdA Reconciliação"
  },
  {
    src: "https://imgur.com/zCz6Cuj.jpg",
    alt: "Evento especial da comunidade MBdA"
  },
  {
    src: "https://imgur.com/JYkWhFl.jpg",
    alt: "Encontro da igreja MBdA Reconciliação"
  },
  {
    src: "https://imgur.com/W1VxzK0.jpg",
    alt: "Momento de adoração na MBdA Reconciliação"
  },
  {
    src: "https://imgur.com/GGTtB1C.jpg",
    alt: "Atividade comunitária da igreja MBdA"
  },
  {
    src: "https://imgur.com/fjP7ueb.jpg",
    alt: "Celebração especial da MBdA Reconciliação"
  }
];

const Midia = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section id="midia" className="section-padding bg-light-blue">
      <div className="container mx-auto">
        {/* Título com glassmorphism */}
        <div className="text-center mb-16">
          <div className="glass-card-modern inline-block px-8 py-4 mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-title drop-shadow-lg">
              📸 Mídia
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Confira fotos e vídeos dos momentos especiais em nossa igreja
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

export default Midia;
