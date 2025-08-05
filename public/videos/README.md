# Pasta de Vídeos

Coloque seus vídeos locais aqui.

Formatos suportados:
- MP4 (recomendado)
- WebM
- OGG

## Como usar vídeos locais:

No arquivo `src/components/Devocional.tsx`, altere a configuração:

```javascript
const videoConfig = {
  type: "local", // ou "auto" para detecção automática
  src: "/videos/seu-video.mp4", // caminho do seu vídeo
  title: "Título do seu vídeo"
};
```

## Exemplos:

### Vídeo do YouTube:
```javascript
const videoConfig = {
  type: "youtube",
  src: "https://www.youtube.com/embed/VIDEO_ID",
  title: "Título do vídeo"
};
```

### Vídeo local:
```javascript
const videoConfig = {
  type: "local",
  src: "/videos/devocional-janeiro.mp4",
  title: "Devocional Janeiro 2025"
};
```

### Auto-detecção:
```javascript
const videoConfig = {
  type: "auto", // detecta automaticamente se é YouTube ou local
  src: "/videos/devocional.mp4", // ou URL do YouTube
  title: "Título do vídeo"
};
```