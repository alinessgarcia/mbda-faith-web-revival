
import React, { useState } from "react";
import VideoDialog from "./VideoDialog";

const estudos = [
  {
    id: 1,
    title: "LAB - Fundamentos da nossa fé - Leonardo Silva",
    image: "/images/fundamentos.jpg",
    videoUrl: "/videos/fundamentosda-nossa-fe.mp4" // Substitua pelo nome do seu arquivo
  },
  {
    id: 2,
    title: "Panorama do Apocalipse - Pr Hernandes Dias Lopes",
    image: "/images/apocalipse.jpg",
    videoUrl: "/videos/apocalipse.mp4" // Substitua pelo nome do seu arquivo
  },
  {
    id: 3,
    title: "Livro de Salmos",
    image: "/images/os-salmos.jpg",
    videoUrl: "/videos/salmos.mp4" // Substitua pelo nome do seu arquivo
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
    <section id="estudos-biblicos" className="section-padding bg-black/60">
      <div className="container mx-auto text-center pt-0">
        {/* Título */}
        <div className="text-center mb-16">

          <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-title drop-shadow-lg mb-4">
            📚 Estudos Bíblicos
          </h2>

          <p className="text-xl text-white max-w-3xl mx-auto mt-4">
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
