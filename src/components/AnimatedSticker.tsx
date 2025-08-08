const AnimatedSticker = () => {
  // Array de 8 elementos intercalados - PADRONIZADO
  const stickerImages = [
    // Primeira sequência
    { src: '/images/logo-maio.png', alt: 'Logo MBdaR', type: 'logo' },
    { 
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQwIDEwTDQwIDcwTTE1IDMwTDY1IDMwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K', 
      alt: 'Cruz Cristã', 
      type: 'logo' 
    },
    { src: '/images/recom-fm.png', alt: 'Recom FM', type: 'logo' },
    { 
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQwIDEwTDQwIDcwTTE1IDMwTDY1IDMwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K', 
      alt: 'Cruz Cristã', 
      type: 'logo' 
    },
    // Segunda sequência (para loop infinito)
    { src: '/images/logo-maio.png', alt: 'Logo MBdaR', type: 'logo' },
    { 
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQwIDEwTDQwIDcwTTE1IDMwTDY1IDMwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K', 
      alt: 'Cruz Cristã', 
      type: 'logo' 
    },
    { src: '/images/recom-fm.png', alt: 'Recom FM', type: 'logo' },
    { 
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQwIDEwTDQwIDcwTTE1IDMwTDY1IDMwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K', 
      alt: 'Cruz Cristã', 
      type: 'logo' 
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none flex justify-center">
      {/* Container do sticker animado - 70% da largura */}
      <div className="sticker-container w-[70%]">
        {/* Gradiente para suavizar as bordas */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10"></div>
        <div className="sticker-track">
          {stickerImages.map((image, index) => (
            <div
              key={index}
              className="sticker-item"
            >
              {/* Container com círculo animado - TODOS PADRONIZADOS */}
              <div className="sticker-logo-container">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="sticker-image"
                  onError={(e) => {
                    // Fallback para imagem não encontrada
                    e.currentTarget.src = '/images/logo-maio.png';
                  }}
                />
                {/* Círculo animado padronizado para todos */}
                <div className="sticker-ring"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedSticker;