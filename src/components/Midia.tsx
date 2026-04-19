import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const imagens = [
  {
    srcDesktop: "/images/atos-desktop.jpg",
    srcMobile: "/images/atos-mobile2.jpg",
    alt: "Estudo bíblico de Atos dos Apóstolos na MBdA Reconciliação",
  },
  {
    srcDesktop: "/images/ceia2.jpg",
    srcMobile: "/images/ceia-mobile.jpg",
    alt: "Santa Ceia na igreja MBdA Reconciliação",
  },
  {
    srcDesktop: "/images/ebd.jpg",
    srcMobile: "/images/ebd-mobile2.jpg",
    alt: "Escola Bíblica Dominical da MBdA Reconciliação",
  },
  {
    srcDesktop: "/images/familia.jpg",
    srcMobile: "/images/familia-mobile.jpg",
    alt: "Momento em família na igreja MBdA Reconciliação",
  },
  {
    srcDesktop: "/images/5solas-desktop.jpg",
    srcMobile: "/images/5solas-mobile2.jpg",
    alt: "As 5 Solas da Reforma Protestante - MBdA Reconciliação",
  },
  {
    srcDesktop: "/images/reforma-desktop.jpg",
    srcMobile: "/images/reforma-mobile.jpg",
    alt: "Celebração da Reforma Protestante na MBdA Reconciliação",
  },
  {
    srcDesktop: "/images/agenda-semanal.png",
    srcMobile: "/images/agenda-semanal.png",
    alt: "Agenda semanal da MBdA Reconciliação com programação de cultos e atividades",
  },
];

const Midia = () => {
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <section id="midia" className="section-padding relative overflow-hidden bg-[#093573]/95">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#0f4ea8]/25 via-transparent to-[#072a59]/60" />

      <div className="container mx-auto relative z-10">
        <div className="mb-10 md:mb-12">
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white/90">
            Galeria
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">Mídia</h2>
          <p className="mt-2 max-w-3xl text-white/75">
            Registros dos momentos especiais da nossa comunidade em cultos, estudos e celebrações.
          </p>
        </div>

        <article className="rounded-2xl border border-white/20 bg-white/10 p-3 md:p-5 backdrop-blur-md shadow-[0_14px_30px_rgba(2,22,64,0.32)]">
          <Carousel
            className="w-full"
            plugins={[plugin.current]}
            opts={{ align: "center", loop: true }}
            onMouseEnter={() => plugin.current?.stop()}
            onMouseLeave={() => plugin.current?.reset()}
          >
            <CarouselContent>
              {imagens.map((imagem, index) => (
                <CarouselItem key={index}>
                  <div className="overflow-hidden rounded-xl border border-white/15 bg-[#092d62]">
                    <img
                      src={imagem.srcMobile}
                      alt={imagem.alt}
                      className="block h-72 w-full object-cover sm:hidden"
                      loading="lazy"
                    />
                    <img
                      src={imagem.srcDesktop}
                      alt={imagem.alt}
                      className="hidden h-[460px] w-full object-cover sm:block xl:h-[560px]"
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-3 border-white/30 bg-white/20 text-white hover:bg-white/30" />
            <CarouselNext className="right-3 border-white/30 bg-white/20 text-white hover:bg-white/30" />
          </Carousel>
        </article>
      </div>
    </section>
  );
};

export default Midia;
