
import React from "react";
import { Youtube } from "lucide-react";

const Devocional = () => {
  return (
    <section id="devocional" className="section-padding bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="section-title">Devocional</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-4">
          Reflexões e devocionais para fortalecer sua caminhada com Deus.
        </p>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8">
          Medite nestas palavras diariamente e cresça em sua fé através dos nossos conteúdos.
        </p>
        
        {/* Video Frame */}
        <div className="w-full max-w-4xl mx-auto mb-10 aspect-video shadow-lg">
          <iframe 
            className="w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/videoseries?list=PLXiZJQ9yS4LcVl-7fj3Xx2o1u1XzqB2Hj" 
            title="Devocionais da Reconciliação"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
        
        <a 
          href="https://www.youtube.com/@ministeriobiblicodareconcilia" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-primary flex items-center justify-center mx-auto gap-2 max-w-xs"
        >
          <Youtube size={24} />
          Visite nosso Canal
        </a>
      </div>
    </section>
  );
};

export default Devocional;
