// Configuração centralizada do vídeo devocional
// Altere aqui para trocar entre YouTube e vídeos locais

export interface VideoConfig {
  type: "youtube" | "local" | "auto";
  src: string;
  title: string;
}

// CONFIGURAÇÃO ATUAL - Altere aqui para mudar o vídeo
export const videoConfig: VideoConfig = {
  type: "youtube", // "youtube", "local" ou "auto"
  src: "https://www.youtube.com/embed/gi5HSqTdDBA?t=186",
  title: "Devocionais da Reconciliação - Ministério Bíblico da Reconciliação"
};

// EXEMPLOS DE CONFIGURAÇÃO:

// Para vídeo do YouTube:
// export const videoConfig: VideoConfig = {
//   type: "youtube",
//   src: "https://www.youtube.com/embed/VIDEO_ID",
//   title: "Título do vídeo"
// };

// Para vídeo local:
// export const videoConfig: VideoConfig = {
//   type: "local",
//   src: "/videos/devocional-janeiro.mp4",
//   title: "Devocional Janeiro 2025"
// };

// Para auto-detecção:
// export const videoConfig: VideoConfig = {
//   type: "auto",
//   src: "/videos/devocional.mp4", // ou URL do YouTube
//   title: "Título do vídeo"
// };