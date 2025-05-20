
import React from "react";

const fotos = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    alt: "Culto de Adoração",
    type: "image"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    alt: "Batismo",
    type: "image"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    alt: "Pregação",
    type: "image"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    alt: "Grupo de Louvor",
    type: "image"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    alt: "Evento Especial",
    type: "image"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    alt: "Escola Dominical",
    type: "image"
  }
];

const Midia = () => {
  return (
    <section id="midia" className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="section-title">Mídia</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8 text-center">
          Confira fotos e vídeos dos momentos especiais em nossa igreja.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fotos.map((item) => (
            <div key={item.id} className="card overflow-hidden group">
              <div className="relative h-64">
                {item.type === "image" ? (
                  <>
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <p className="text-white p-4">{item.alt}</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex justify-center items-center bg-gray-100">
                    <span>Vídeo não disponível</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button className="btn-primary">Ver Mais</button>
        </div>
      </div>
    </section>
  );
};

export default Midia;
