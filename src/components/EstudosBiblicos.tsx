import { ArrowUpRight, PlayCircle } from "lucide-react";
import { useState } from "react";
import VideoDialog from "./VideoDialog";

const estudos = [
  {
    id: 1,
    title: "Livre-Arbítrio - Augustus Nicodemus",
    image: "https://img.youtube.com/vi/u2R0dCZTFfM/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/u2R0dCZTFfM",
  },
  {
    id: 2,
    title: "Panorama do Apocalipse - Pr. Hernandes Dias Lopes",
    image: "https://img.youtube.com/vi/KdfnoeaPMv0/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/KdfnoeaPMv0",
  },
  {
    id: 3,
    title: "As Reformas Evangélicas - Luiz Sayão",
    image: "https://img.youtube.com/vi/_xEjtLTdcuQ/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/_xEjtLTdcuQ",
  },
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
    <section id="estudos-biblicos" className="section-padding relative overflow-hidden bg-[#093777]/95">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#0f4ea8]/25 via-transparent to-[#072a59]/60" />

      <div className="container mx-auto relative z-10">
        <div className="mb-10 md:mb-12">
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white/90">
            Formação
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">Estudos Bíblicos</h2>
          <p className="mt-2 max-w-3xl text-white/75">
            Aprofunde seu conhecimento na Palavra de Deus com conteúdos selecionados para crescimento espiritual.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {estudos.map((estudo) => (
            <article
              key={estudo.id}
              className="group overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-[0_12px_28px_rgba(2,22,64,0.28)] backdrop-blur-md transition-transform hover:-translate-y-1"
            >
              <button type="button" onClick={() => openVideoDialog(estudo.videoUrl)} className="block w-full text-left">
                <div className="relative h-56 overflow-hidden border-b border-white/15 bg-[#092d62]">
                  <img
                    src={estudo.image}
                    alt={estudo.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061a39]/85 via-[#061a39]/30 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                    <h3 className="text-base md:text-lg font-bold leading-tight text-white">{estudo.title}</h3>
                    <PlayCircle className="h-8 w-8 shrink-0 text-white/90" />
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-semibold text-white/80">Assistir estudo</span>
                  <ArrowUpRight className="h-4 w-4 text-white/80 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      <VideoDialog isOpen={videoDialogOpen} onClose={closeVideoDialog} videoUrl={currentVideoUrl} />
    </section>
  );
};

export default EstudosBiblicos;
