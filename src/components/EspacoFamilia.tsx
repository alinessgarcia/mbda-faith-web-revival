
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
  "https://imgur.com/1fZWqMo.jpg",
  "https://imgur.com/TIDseK2.jpg",
  "https://imgur.com/BVnMETR.jpg",
  "https://imgur.com/zgYqFbx.jpg",
  "https://imgur.com/qAmQVDC.jpg"
];

const EspacoFamilia = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section id="espaco-familia" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title">Espaço Família</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8 text-center">
          Valorizamos as famílias e acreditamos que elas são a base da sociedade.
          Confira alguns momentos especiais das atividades para famílias em nossa igreja.
        </p>
        
        <div className="max-w-4xl mx-auto px-10">
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
              {imagens.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={src}
                        alt={`Atividade família ${index + 1}`}
                        className="w-full h-[300px] md:h-[400px] object-cover transition-all hover:scale-105 duration-300"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          
          <div className="flex justify-center mt-4">
            {imagens.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 mx-1 rounded-full bg-gray-300`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EspacoFamilia;
