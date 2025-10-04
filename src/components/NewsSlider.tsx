import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, RefreshCw } from "lucide-react";
import { loadChristianNews, refreshChristianNews, NewsItem } from "../api/newsApi";

// Tipos de slides: notícias e banners de imagens
type BannerSlide = { kind: "banner"; data: { src: string; alt?: string; link?: string } };
type NewsSlide = { kind: "news"; data: NewsItem };
type SlideItem = BannerSlide | NewsSlide;

const NewsSlider: React.FC = () => {
  const PLACEHOLDER_IMG = "/images/boletim-placeholder.svg";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Banners: utilizar imagens permitidas do diretório public/images
  // Exclusões: backgrounds, escolinha, blog, logo
  const allowedBannerFiles: string[] = [
    "/images/5solas-desktop.jpg",
    "/images/5solas-mobile2.jpg",
    "/images/apocalipse.jpg",
    "/images/atos-desktop.jpg",
    "/images/atos-mobile2.jpg",
    "/images/banner1-slide.png",
    "/images/ceia-mobile.jpg",
    "/images/ceia2.jpg",
    "/images/culto1.jpg",
    "/images/familia-desktop.jpg",
    "/images/familia-mobile-copy.jpg",
    "/images/familia-mobile.jpg",
    "/images/familia.jpg",
    "/images/fundamentos.jpg",
    "/images/indentificando-ofrutodafe.jpg",
    "/images/os-salmos.jpg",
    "/images/recom-fm.png",
    "/images/reforma-desktop.jpg",
    "/images/reforma-mobile.jpg",
  ];

  const bannerSlides: BannerSlide[] = allowedBannerFiles.map((src) => ({
    kind: "banner",
    data: { src, alt: "Banner" },
  }));

  // Intercalar fontes para evitar blocos de uma mesma origem
  const roundRobinBySource = (items: NewsItem[]): NewsItem[] => {
    const groups = new Map<string, NewsItem[]>();
    items.forEach((it) => {
      const arr = groups.get(it.source) ?? [];
      arr.push(it);
      groups.set(it.source, arr);
    });
    const buckets = Array.from(groups.values());
    const result: NewsItem[] = [];
    let index = 0;
    let added = true;
    while (added) {
      added = false;
      for (const bucket of buckets) {
        if (index < bucket.length) {
          result.push(bucket[index]);
          added = true;
        }
      }
      index++;
    }
    return result;
  };

  const slides: SlideItem[] = (() => {
    const balancedNews = roundRobinBySource(newsItems);
    const newsSlides: SlideItem[] = balancedNews.map((n) => ({ kind: "news", data: n }));
    if (bannerSlides.length === 0) return newsSlides;
    const result: SlideItem[] = [];
    let bIndex = 0;
    newsSlides.forEach((s, i) => {
      result.push(s);
      if ((i + 1) % 2 === 0 && bIndex < bannerSlides.length) {
        result.push(bannerSlides[bIndex]);
        bIndex++;
      }
    });
    return result;
  })();

  const loadNews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const news = await loadChristianNews();
      setNewsItems(news);
      console.log(`📰 Loaded ${news.length} Christian news articles`);
    } catch (err) {
      console.error('Error loading news:', err);
      setError('Erro ao carregar notícias. Tentando novamente...');
      // Retry after 3 seconds
      setTimeout(loadNews, 3000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar notícias ao montar o componente
  useEffect(() => {
    loadNews();
  }, [loadNews]);
  
  const handleRefreshNews = async () => {
    try {
      setIsRefreshing(true);
      const news = await refreshChristianNews();
      setNewsItems(news);
      setCurrentSlide(0); // Reset to first slide
      console.log(`📰 Refreshed ${news.length} Christian news articles`);
    } catch (err) {
      console.error('Error refreshing news:', err);
      setError('Erro ao atualizar notícias');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // Change slide every 10 seconds (slower)

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-black/80 via-black/60 to-black/40 backdrop-blur-sm">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="text-white text-lg">Carregando notícias cristãs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && newsItems.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-black/80 via-black/60 to-black/40 backdrop-blur-sm">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={loadNews}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors duration-300"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentNews = newsItems[currentSlide];

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background de papel amassado mais visível */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          filter: 'contrast(1.5) brightness(0.7)'
        }}
      />
      
      {/* Background sólido com textura */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
      
      {/* Overlay gradiente com textura de papel */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60 backdrop-blur-sm" />
      
      <div className="relative h-full z-10">
        {/* Refresh Button */}
        <button
          onClick={handleRefreshNews}
          disabled={isRefreshing}
          className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 group disabled:opacity-50"
          title="Atualizar notícias"
        >
          <RefreshCw className={`w-4 h-4 text-white group-hover:text-yellow-300 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
          title="Notícia anterior"
          aria-label="Ir para a notícia anterior"
        >
          <ChevronLeft className="w-5 h-5 text-white group-hover:text-yellow-300" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
          title="Próxima notícia"
          aria-label="Ir para a próxima notícia"
        >
          <ChevronRight className="w-5 h-5 text-white group-hover:text-yellow-300" />
        </button>

        {/* Slides */}
        <div className="relative h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={`slide-${slide.kind}-${index}`}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 translate-x-0"
                  : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <div className="h-full flex items-center">
                {slide.kind === "news" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full px-8">
                    {/* Coluna de Imagem - usa placeholder se faltar ou falhar */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-2xl">
                        <img
                          src={slide.data.image_url || PLACEHOLDER_IMG}
                          alt={slide.data.title || "Boletim da Reconciliação"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Se a imagem falhar, substitui pelo placeholder
                            e.currentTarget.src = PLACEHOLDER_IMG;
                          }}
                        />

                        {/* Overlay com categoria */}
                        {slide.data.category && (
                          <div className="absolute top-4 left-4">
                            <div className="inline-block px-3 py-1 bg-yellow-500/90 text-black text-xs font-semibold rounded-full backdrop-blur-sm">
                              {slide.data.category}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coluna de Conteúdo */}
                    <div className="flex flex-col justify-center space-y-6">
                      <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                        {slide.data.title}
                      </h3>

                      <p className="text-gray-200 text-lg leading-relaxed line-clamp-4">
                        {slide.data.summary}
                      </p>

                      <div className="flex items-center justify-between pt-4">
                        <span className="text-sm text-gray-300 font-medium">{slide.data.source}</span>
                        <a
                          href={slide.data.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Ler mais
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    {/* Mobile: mostrar banner no mesmo tamanho das imagens das notícias e textos abaixo */}
                    <div className="block md:hidden w-full px-8 pt-10 pb-6">
                      <div className="flex items-center justify-center">
                        <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-2xl">
                          <img
                            src={slide.data.src}
                            alt={slide.data.alt ?? "Banner"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Botão opcional do banner (somente se houver link) */}
                      {slide.data.link && (
                        <div className="mt-4 flex justify-center">
                          <a
                            href={slide.data.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            Saiba mais
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Desktop/Tablet: manter o comportamento atual com imagem ocupando toda a área */}
                    <div className="hidden md:block w-full pt-6">
                      <img
                        src={slide.data.src}
                        alt={slide.data.alt ?? "Banner"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((s, index) => (
            <button
              type="button"
              aria-label={`Ir para slide ${index + 1}`}
              key={s.kind === "news" ? `news-${s.data.url}` : `banner-${s.data.src}`}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-yellow-400 w-6" : "bg-white/40 w-2 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSlider;