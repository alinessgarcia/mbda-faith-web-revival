
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
    srcDesktop: "/images/atos-desktop.jpg",
    srcMobile: "/images/atos-mobile2.jpg",
    alt: "Estudo bíblico de Atos dos Apóstolos na MBdA Reconciliação"
  },
  {
    srcDesktop: "/images/ceia2.jpg",
    srcMobile: "/images/ceia-mobile.jpg",
    alt: "Santa Ceia na igreja MBdA Reconciliação"
  },
  {
    srcDesktop: "/images/ebd.jpg",
    srcMobile: "/images/ebd-mobile2.jpg",
    alt: "Escola Bíblica Dominical da MBdA Reconciliação"
  },
  {
    srcDesktop: "/images/familia.jpg",
    srcMobile: "/images/familia-mobile.jpg",
    alt: "Momento em família na igreja MBdA Reconciliação"
  },
  {
    srcDesktop: "/images/5solas-desktop.jpg",
    srcMobile: "/images/5solas-mobile2.jpg",
    alt: "As 5 Solas da Reforma Protestante - MBdA Reconciliação"
  },
  {
    srcDesktop: "/images/reforma-desktop.jpg",
    srcMobile: "/images/reforma-mobile.jpg",
    alt: "Celebração da Reforma Protestante na MBdA Reconciliação"
  }
];

const Midia = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section id="midia" className="section-padding" style={{ backgroundColor: 'rgba(0, 140, 227, 0.7)' }}>
      <div className="container mx-auto">
        {/* Título com glassmorphism */}
        <div className="text-center mb-16">
          <div className="glass-card-modern inline-block px-8 py-4 mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-title drop-shadow-lg">
              📸 Mídia
            </h2>
          </div>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Confira fotos e vídeos dos momentos especiais em nossa igreja
          </p>
        </div>

        <div className="w-full sm:max-w-7xl mx-auto px-2 sm:px-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
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
                          {/* Imagem para mobile */}
                          <img
                            src={imagem.srcMobile}
                            alt={imagem.alt}
                            className="block sm:hidden w-full h-72 object-cover"
                            loading="lazy"
                          />
                          {/* Imagem para desktop */}
                          <img
                            src={imagem.srcDesktop}
                            alt={imagem.alt}
                            className="hidden sm:block w-full h-96 md:h-[450px] lg:h-[700px] xl:h-[800px] object-cover"
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
