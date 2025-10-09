import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, ExternalLink } from "lucide-react";
import { loadChristianNews, refreshChristianNews, NewsItem } from "../api/newsApi";

const formatDate = (date: Date) =>
  date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Formatação curta para exibir somente dia, mês e ano
const formatDateShort = (date: Date) =>
  date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const NewspaperHeroSlider: React.FC = () => {
  const PLACEHOLDER_IMG = "/images/boletim-placeholder.svg";
  const [items, setItems] = useState<NewsItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const news = await loadChristianNews();
      setItems(news);
      setCurrent(0);
      console.log(`📰 NewspaperHero: carregadas ${news.length} notícias`);
    } catch (e) {
      console.error(e);
      setError("Erro ao carregar notícias. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (items.length === 0) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 15000); // ajuste: 15s por slide (reduzido de 30s)
    return () => clearInterval(id);
  }, [items.length]);

  const handlePrev = () => {
    if (items.length === 0) return;
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    if (items.length === 0) return;
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const news = await refreshChristianNews();
      setItems(news);
      setCurrent(0);
    } catch (e) {
      console.error(e);
      setError("Erro ao atualizar notícias");
    } finally {
      setRefreshing(false);
    }
  };

  const featured = items[current];
  const featuredDate = featured?.date ? new Date(featured.date) : null;
  const dmy = featuredDate
    ? {
        day: featuredDate.toLocaleDateString("pt-BR", { day: "2-digit" }),
        month: featuredDate.toLocaleDateString("pt-BR", { month: "long" }),
        year: featuredDate.toLocaleDateString("pt-BR", { year: "numeric" }),
      }
    : null;

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/60">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-white text-lg">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/60">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={load}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors duration-300"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Textura de papel e fundo */}
      <div className="absolute inset-0 paper-texture opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60 backdrop-blur-sm" />

      {/* Barra de topo estilo jornal */}
      <div className="relative z-10 px-6 pt-6">
        <div className="mx-auto max-w-6xl bg-neutral-100/5 backdrop-blur-sm rounded-md newspaper-border">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-3xl md:text-4xl font-serif tracking-wider text-yellow-300 drop-shadow">
              Reconciliação News
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-neutral-200 text-sm md:text-base">
                {formatDate(new Date())}
              </span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors disabled:opacity-50"
                title="Atualizar notícias"
              >
                <RefreshCw className={`w-4 h-4 text-white ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do slider */}
      <div className="relative z-10 px-6 pb-6">
        <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 min-h-[600px] lg:min-h-[500px]">
          {/* Destaque principal (full width) */}
          <div className="bg-neutral-100/5 rounded-md overflow-hidden shadow-2xl">
            {featured && (
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Imagem */}
                <div className="relative">
                  <img
                    src={featured?.image_url || PLACEHOLDER_IMG}
                    alt={featured?.title || "Reconciliação News"}
                    className="w-full h-full object-cover sepia-img"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMG;
                    }}
                  />
                  {/* Navegação mobile sobre a área da imagem (não cobre os textos) */}
                  <button
                    onClick={handlePrev}
                    className="md:hidden absolute bottom-3 left-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="md:hidden absolute bottom-3 right-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2"
                    aria-label="Próxima"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Texto */}
                <div className="p-5">
                  {featured?.category && (
                    <span className="inline-block mb-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                      {featured.category}
                    </span>
                  )}
                  <a href={featured.url} target="_blank" rel="noopener noreferrer">
                    <h2 className="text-xl md:text-2xl font-serif text-neutral-100 tracking-wide hover:text-yellow-200 transition-colors">
                      {featured.title}
                    </h2>
                  </a>
                  <p className="mt-3 text-neutral-200/90 leading-relaxed dropcap line-clamp-4 font-serif">
                    {featured.summary}
                  </p>
                  <div className="mt-4 text-neutral-400 text-sm flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <span className="font-medium text-neutral-300">{featured.source}</span>
                    {dmy && (
                      <>
                        {/* Mobile: dia, mês, ano organizados em linha mais legível */}
                        <div className="sm:hidden flex items-baseline gap-2 text-neutral-300">
                          <span className="text-lg font-semibold">{dmy.day}</span>
                          <span className="text-sm capitalize">{dmy.month}</span>
                          <span className="text-sm">{dmy.year}</span>
                        </div>
                        {/* Desktop/tablet: formato curto em uma única linha */}
                        <span className="hidden sm:inline">{`${dmy.day} de ${dmy.month} de ${dmy.year}`}</span>
                      </>
                    )}
                    {/* Botão para navegar à fonte real */}
                    {featured.url && (
                      <a
                        href={featured.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition-colors"
                        title="Abrir na fonte"
                      >
                        <ExternalLink className="w-4 h-4" /> Ver na fonte
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Removida lista lateral e abas de secundárias */}
        </div>

        {/* Navegação */}
        <button
          onClick={handlePrev}
          className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
          title="Edição Anterior"
          aria-label="Edição Anterior"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleNext}
          className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
          title="Próxima Edição"
          aria-label="Próxima Edição"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Indicadores de páginas (bolinhas) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {items.map((_, idx) => (
            <button
              key={`dot-${idx}`}
              type="button"
              aria-label={`Ir para página ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? "bg-yellow-400 w-6" : "bg-white/40 w-2 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewspaperHeroSlider;
