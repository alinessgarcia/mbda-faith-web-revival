import { useEffect, useMemo, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, ExternalLink } from "lucide-react";
import { loadChristianNews, refreshChristianNews, NewsItem } from "../api/newsApi";

const formatDate = (date: Date) =>
  date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const NewspaperHeroSlider: React.FC = () => {
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
    }, 12000); // conforme pedido: 12s
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
  const secondary = useMemo(() => {
    return items.filter((_, idx) => idx !== current);
  }, [items, current]);

  // Organizar notícias secundárias por categoria para as abas
  const categorizedNews = useMemo(() => {
    const categories: { [key: string]: NewsItem[] } = {};
    
    secondary.forEach(item => {
      const category = item.category || 'Geral';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });

    return categories;
  }, [secondary]);

  const categoryTabs = Object.keys(categorizedNews);
  const [activeTab, setActiveTab] = useState(0);

  // Atualizar aba ativa quando as categorias mudarem
  useEffect(() => {
    if (categoryTabs.length > 0 && activeTab >= categoryTabs.length) {
      setActiveTab(0);
    }
  }, [categoryTabs.length, activeTab]);

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
              Boletim da Reconciliação
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
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px] lg:min-h-[500px]">
          {/* Destaque principal */}
          <div className="lg:col-span-2 bg-neutral-100/5 rounded-md overflow-hidden shadow-2xl">
            {featured && (
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Imagem */}
                <div className="relative">
                  {featured.image_url ? (
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover sepia-img"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                      <span className="text-neutral-400">Sem imagem</span>
                    </div>
                  )}
                  {featured.category && (
                    <span className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                      {featured.category}
                    </span>
                  )}
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
                  <a href={featured.url} target="_blank" rel="noopener noreferrer">
                    <h2 className="text-xl md:text-2xl font-serif text-neutral-100 tracking-wide hover:text-yellow-200 transition-colors">
                      {featured.title}
                    </h2>
                  </a>
                  <p className="mt-3 text-neutral-200/90 leading-relaxed dropcap line-clamp-4 font-serif">
                    {featured.summary}
                  </p>
                  <div className="mt-4 text-neutral-400 text-sm flex items-center flex-wrap gap-3">
                    <span>{featured.source}</span>
                    {featured.date && (
                      <span className="ml-2">• {new Date(featured.date).toLocaleString("pt-BR")}</span>
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

          {/* Lista lateral de secundárias com abas */}
          <div className="bg-neutral-100/5 rounded-md overflow-hidden shadow-xl relative z-20">
            {/* Abas de categorias */}
            {categoryTabs.length > 1 && (
              <div className="flex overflow-x-auto bg-neutral-800/50 border-b border-neutral-700 sticky top-0 z-30">
                {categoryTabs.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => setActiveTab(index)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === index
                        ? 'bg-yellow-600 text-white border-b-2 border-yellow-400'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
                    }`}
                  >
                    {category}
                    <span className="ml-2 text-xs opacity-75">
                      ({categorizedNews[category]?.length || 0})
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Conteúdo da aba ativa */}
            <div className="p-4 space-y-4 max-h-[400px] md:max-h-[500px] lg:max-h-[600px] overflow-y-auto pt-6 mt-2">
              {categoryTabs.length > 0 ? (
                <>
                  <h3 className="font-serif text-xl font-bold mb-4 uppercase tracking-wide text-neutral-200">
                    {categoryTabs.length > 1 ? categoryTabs[activeTab] : 'Outras Notícias'}
                  </h3>
                  {categorizedNews[categoryTabs[activeTab]]?.map((item, i) => (
                    <article key={`${item.url}-${i}`} className="border-l-4 border-neutral-700 pl-4 pb-4">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <h3 className="font-serif text-lg text-neutral-100 hover:text-yellow-200 transition-colors">
                          {item.title}
                        </h3>
                      </a>
                      <p className="text-neutral-300 text-sm mt-1 line-clamp-3 font-serif">
                        {item.summary}
                      </p>
                      <div className="mt-2 text-neutral-500 text-xs">
                        <span>{item.source}</span>
                        {item.date && (
                          <span className="ml-2">• {new Date(item.date).toLocaleDateString("pt-BR")}</span>
                        )}
                      </div>
                    </article>
                  )) || []}
                </>
              ) : (
                <>
                  <h3 className="font-serif text-xl font-bold mb-4 uppercase tracking-wide text-neutral-200">
                    Outras Notícias
                  </h3>
                  <div className="text-neutral-400 text-sm">Sem notícias adicionais</div>
                </>
              )}
            </div>
          </div>
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
      </div>
    </div>
  );
};

export default NewspaperHeroSlider;