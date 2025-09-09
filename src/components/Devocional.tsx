
import React from "react";
import { Youtube, Radio } from "lucide-react";

interface VideoConfig {
  type: "youtube" | "local" | "auto";
  src: string;
  title: string;
}

// Configuração do vídeo - altere aqui para trocar o vídeo
const videoConfig: VideoConfig = {
  type: "local",
  src: "/videos/aobrigatoriedade-de-evangelizar.mp4",
  title: "Devocional - A Obrigatoriedade de Evangelizar - Ministério Bíblico da Reconciliação"
};

// Função para detectar se é URL do YouTube
const isYouTubeUrl = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Componente para renderizar o player apropriado
const VideoPlayer = ({ config }: { config: VideoConfig }) => {
  const { type, src, title } = config;

  // Auto-detecta o tipo se não especificado
  const videoType = type === "auto" ? (isYouTubeUrl(src) ? "youtube" : "local") : type;

  if (videoType === "youtube") {
    return (
      <iframe
        className="w-full h-full"
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  // Vídeo local ou placeholder para YouTube bloqueado
  if (src.includes('youtu')) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center cursor-pointer hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
        onClick={() => window.open(src, '_blank')}>
        <div className="text-white text-center">
          <div className="text-6xl mb-4">▶️</div>
          <h3 className="text-xl font-bold mb-2">Assista no YouTube</h3>
          <p className="text-sm opacity-90">Clique para assistir o devocional</p>
          <p className="text-xs opacity-75 mt-2">"{title}"</p>
        </div>
      </div>
    );
  }

  return (
    <video
      className="w-full h-full object-cover"
      controls
      preload="metadata"
      title={title}
    >
      <source src={src} type="video/mp4" />
      <source src={src} type="video/webm" />
      <source src={src} type="video/ogg" />
      Seu navegador não suporta o elemento de vídeo.
    </video>
  );
};

const Devocional = () => {
  return (
    <section id="devocional" className="section-padding" style={{ backgroundColor: 'rgba(0, 140, 227, 0.7)' }}>
      <div className="container mx-auto text-center pt-0">
        {/* Título com glassmorphism */}
        <div className="text-center mb-16">

          <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-title drop-shadow-lg mb-4" style={{ fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", whiteSpace: 'nowrap' }}>
            🙏 Devocional
          </h2>

          <p className="text-xl text-white max-w-3xl mx-auto mt-4">
            Reflexões e devocionais para fortalecer sua caminhada com Deus
          </p>
        </div>

        {/* Video Frame */}
        <div className="w-full max-w-4xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative aspect-video shadow-2xl rounded-lg overflow-hidden">
              <VideoPlayer config={videoConfig} />
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
