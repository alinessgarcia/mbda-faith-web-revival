export type BannerMeta = {
  src: string;
  title: string;
  description: string;
  category?: string;
  alt?: string;
  link?: string;
};

// Banners do Mês da Reforma Protestante
// Observação: os caminhos referenciam arquivos em public/images
export const reformationBanners: BannerMeta[] = [
  {
    src: "/images/Os 5 Solas da Reforma.png",
    title: "Os 5 Solas da Reforma",
    description:
      "Princípios centrais: Sola Scriptura, Sola Fide, Sola Gratia, Solus Christus, Soli Deo Gloria.",
    category: "Reforma Protestante",
  },
  {
    src: "/images/As 95 Teses.png",
    title: "As 95 Teses",
    description:
      "As teses de Lutero que contestaram abusos e abriram caminho para a Reforma.",
    category: "Reforma Protestante",
  },
  {
    src: "/images/O Início da Reforma.png",
    title: "O Início da Reforma",
    description:
      "1517: o chamado à volta às Escrituras e ao Evangelho que mudou a história da Igreja.",
    category: "Reforma Protestante",
  },
  {
    src: "/images/Reflexos da Reforma.png",
    title: "Reflexos da Reforma",
    description:
      "Impactos teológicos, culturais e sociais da Reforma que permanecem até hoje.",
    category: "Reforma Protestante",
  },
  {
    src: "/images/Desperte para a Verdade.png",
    title: "Desperte para a Verdade",
    description:
      "Chamado à centralidade das Escrituras e ao evangelho autêntico.",
    category: "Reforma Protestante",
  },
  {
    src: "/images/Pagar o Preço da Verdade.png",
    title: "Pagar o Preço da Verdade",
    description:
      "Fidelidade à Palavra mesmo em meio à oposição e custos.",
    category: "Reforma Protestante",
  },
  {
    src: "/images/5solas-desktop.jpg",
    title: "Os 5 Solas",
    description:
      "Uma síntese visual dos fundamentos da Reforma e sua relevância para a fé cristã.",
    category: "Reforma Protestante",
  },
  // Removidos conforme solicitação: 5solas-mobile2.jpg, reforma-desktop.jpg, reforma-mobile.jpg
];