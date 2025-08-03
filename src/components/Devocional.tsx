
import React from "react";
import { Youtube, Radio } from "lucide-react";

const Devocional = () => {
  return (
    <section id="devocional" className="section-padding bg-white">
      <div className="container mx-auto text-center pt-0">
        {/* Título com glassmorphism */}
        <div className="text-center mb-16">
          <div className="glass-card-modern inline-block px-8 py-4 mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-custom drop-shadow-lg">
              🙏 Devocional
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Reflexões e devocionais para fortalecer sua caminhada com Deus
          </p>
        </div>
        
        {/* Video Frame */}
        <div className="w-full max-w-4xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative aspect-video shadow-2xl rounded-lg overflow-hidden">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/gi5HSqTdDBA?t=186" 
                title="Devocionais da Reconciliação - Ministério Bíblico da Reconciliação"
                frameBorder="0" 
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <a 
            href="https://www.youtube.com/@ministeriobiblicodareconcilia" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary flex items-center justify-center gap-2 max-w-xs group"
            aria-label="Visite nosso canal no YouTube"
          >
            <Youtube size={24} className="group-hover:scale-110 transition-transform" />
            Visite nosso Canal
          </a>
          
          <a 
            href="https://www.ipb.org.br/projetos-radio-ipb.php" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-secondary flex items-center justify-center gap-2 max-w-xs group"
            aria-label="Ouça hinos antigos - rádio cristã"
          >
            <Radio size={24} className="group-hover:scale-110 transition-transform" />
            Rádio - Hinos Antigos
          </a>
        </div>
      </div>
    </section>
  );
};

export default Devocional;
