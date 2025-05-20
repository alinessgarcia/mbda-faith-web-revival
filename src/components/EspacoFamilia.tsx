
import React, { useState } from "react";

const imagens = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Família em culto",
    caption: "Momento de adoração em família"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Crianças na igreja",
    caption: "Ministério infantil em ação"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Jovens em atividade",
    caption: "Encontro de jovens e adolescentes"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Casais em retiro",
    caption: "Retiro de casais 2023"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Celebração familiar",
    caption: "Celebração especial para famílias"
  }
];

const EspacoFamilia = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
  };

  return (
    <section id="espaco-familia" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title">Espaço Família</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8 text-center">
          Valorizamos as famílias e acreditamos que elas são a base da sociedade.
          Confira alguns momentos especiais das atividades para famílias em nossa igreja.
        </p>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-out h-96"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {imagens.map((imagem) => (
                <div key={imagem.id} className="min-w-full h-full relative">
                  <img
                    src={imagem.src}
                    alt={imagem.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                    <p className="text-white text-center">{imagem.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md z-10"
            aria-label="Imagem anterior"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md z-10"
            aria-label="Próxima imagem"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="flex justify-center mt-4 space-x-2">
            {imagens.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EspacoFamilia;
