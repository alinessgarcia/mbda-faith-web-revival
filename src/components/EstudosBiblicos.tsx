
import React from "react";

const estudos = [
  {
    id: 1,
    title: "Fundamentos da Fé",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "#estudo1"
  },
  {
    id: 2,
    title: "O Livro de Apocalipse",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "#estudo2"
  },
  {
    id: 3,
    title: "Os Salmos",
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "#estudo3"
  }
];

const EstudosBiblicos = () => {
  return (
    <section id="estudos-biblicos" className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="section-title">Estudos Bíblicos</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8 text-center">
          Aprofunde seu conhecimento na Palavra de Deus através de nossos estudos
          bíblicos. Materiais preparados com cuidado para edificação espiritual.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {estudos.map((estudo) => (
            <a
              key={estudo.id}
              href={estudo.link}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={estudo.image}
                  alt={estudo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                  {estudo.title}
                </h3>
              </div>
              <div className="p-4">
                <p className="text-primary font-medium flex items-center justify-end">
                  Acessar Estudo
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
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
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EstudosBiblicos;
