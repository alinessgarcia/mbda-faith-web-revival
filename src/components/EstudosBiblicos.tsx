
import React, { useState } from "react";
import VideoDialog from "./VideoDialog";

const estudos = [
  {
    id: 1,
    title: "Fundamentos da Fé",
    image: "/images/fundamentos.jpg",
    videoUrl: "https://youtu.be/c-8f_9w8OWA"
  },
  {
    id: 2,
    title: "O Livro de Apocalipse",
    image: "/images/apocalipse.jpg",
    videoUrl: "https://www.youtube.com/watch?v=KdfnoeaPMv0"
  },
  {
    id: 3,
    title: "Os Salmos",
    image: "/images/os-salmos.jpg",
    videoUrl: "https://www.youtube.com/watch?v=E1CqSwpaStI"
  }
];

const EstudosBiblicos = () => {
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const openVideoDialog = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setVideoDialogOpen(true);
  };

  const closeVideoDialog = () => {
    setVideoDialogOpen(false);
  };

  return (
    <section id="estudos-biblicos" className="section-padding bg-white">
      <div className="container mx-auto text-center pt-0">
        {/* Título */}
        <div className="text-center mb-16">
          <div className="glass-card-modern inline-block px-8 py-4 mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-custom drop-shadow-lg">
              📚 Estudos Bíblicos
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Aprofunde seu conhecimento na Palavra de Deus através de nossos estudos
            bíblicos preparados com cuidado para edificação espiritual
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {estudos.map((estudo) => (
            <div
              key={estudo.id}
              className="card group hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => openVideoDialog(estudo.videoUrl)}
            >
<div className="relative h-48 md:h-56 lg:h-64 overflow-hidden flex items-center justify-center bg-gray-100">
  <img
    src={estudo.image}
    alt={estudo.title}
    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
  <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
    {estudo.title}
  </h3>
</div>

              <div className="p-4">
                <p className="text-primary font-medium flex items-center justify-end">
                  Assistir Vídeo
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
            </div>
          ))}
        </div>
      </div>

      <VideoDialog 
        isOpen={videoDialogOpen} 
        onClose={closeVideoDialog} 
        videoUrl={currentVideoUrl} 
      />
    </section>
  );
};

export default EstudosBiblicos;
