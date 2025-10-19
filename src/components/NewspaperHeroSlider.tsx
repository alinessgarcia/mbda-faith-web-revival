import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, ExternalLink, Star } from "lucide-react";
import { loadChristianNews, refreshChristianNews, NewsItem } from "../api/newsApi";
import NewsFilters, { NewsFilterState } from "./NewsFilters";

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

type Slide = { kind: "news"; item: NewsItem };

const NewspaperHeroSlider: React.FC = () => {
  const PLACEHOLDER_IMG = "/images/boletim-placeholder.svg";
  const [items, setItems] = useState<NewsItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  // Estado dos filtros
  const [filters, setFilters] = useState<NewsFilterState>({
    searchTerm: '',
    selectedTags: [],
    selectedCategories: [],
    minRelevanceScore: 0,
  });

  // Busca inteligente com sinônimos
  const searchNews = (newsItems: NewsItem[], searchTerm: string): NewsItem[] => {
    if (!searchTerm.trim()) return newsItems;

    const normalizedSearch = searchTerm.toLowerCase().trim();
    const searchTerms = normalizedSearch.split(/\s+/);

    const synonyms: Record<string, string[]> = {
      'arqueologia': ['arqueológico', 'escavação', 'sítio', 'ruínas', 'descoberta'],
      'israel': ['jerusalém', 'galileia', 'terra santa'],
      'criacionismo': ['criacionista', 'design inteligente'],
      'egito': ['egípcio', 'faraó', 'pirâmide'],
      'babilônia': ['babilônico', 'nabucodonosor'],
    };

    return newsItems.filter(item => {
      const text = `${item.title} ${item.summary} ${item.detectedKeywords?.join(' ') || ''}`.toLowerCase();
      
      return searchTerms.some(term => {
        if (text.includes(term)) return true;
        
        for (const [key, syns] of Object.entries(synonyms)) {
          if (term === key || syns.includes(term)) {
            if (text.includes(key) || syns.some(syn => text.includes(syn))) {
              return true;
            }
          }
        }
        
        return false;
      });
    });
  };

  // Aplicar todos os filtros
  const filteredNews = useMemo(() => {
    let result = [...items];

    result = searchNews(result, filters.searchTerm);

    if (filters.selectedTags.length > 0) {
      result = result.filter(item => 
        item.autoTags?.some(tag => filters.selectedTags.includes(tag))
      );
    }

    if (filters.selectedCategories.length > 0) {
      result = result.filter(item => 
        filters.selectedCategories.includes(item.category)
      );
    }

    if (filters.minRelevanceScore > 0) {
      result = result.filter(item => 
        (item.relevanceScore || 0) >= filters.minRelevanceScore
      );
    }
    
    // Sort by derived relevance score
    result.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));

    return result;
  }, [items, filters]);

  // Extrair tags e categorias únicas
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach(item => {
      item.autoTags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [items]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    items.forEach(item => {
      if (item.category) categories.add(item.category);
    });
    return Array.from(categories).sort();
  }, [items]);

  // Constrói os slides com notícias filtradas
  const slides: Slide[] = useMemo(() => {
    const newsSlides: Slide[] = filteredNews.map((n) => ({ kind: "news", item: n }));
    return newsSlides;
  }, [filteredNews]);

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

  // Manter o indicador ativo visível/centralizado no container (mobile)
  useEffect(() => {
    const el = dotsRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLButtonElement>(`button[data-dot-index="${current}"]`);
    if (active) {
      active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [current]);

  useEffect(() => {
    if (slides.length === 0) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 15000); // 15s por slide
    return () => clearInterval(id);
  }, [slides.length]);

  const handlePrev = () => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev + 1) % slides.length);
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

  const featured = slides[current];
  const isHighRelevance = (score?: number) => score && score >= 5;
  
  // Reset slide quando filtros mudam
  useEffect(() => {
    setCurrent(0);
  }, [filters]);

  // Sanitiza HTML bruto vindo de alguns feeds (ex.: <a href="https://news.google.com/...">)
  const sanitizeSummary = (s?: string) => {
    if (!s) return "";
    return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  };

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
    <div className="relative w-full">
      {/* Textura de papel e fundo */}
      <div className="absolute inset-0 paper-texture opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60 backdrop-blur-sm" />

      {/* Filtros no topo */}
      <div className="relative z-30 px-4 pt-4">
        <NewsFilters
          availableTags={availableTags}
          availableCategories={availableCategories}
          filters={filters}
          onFiltersChange={setFilters}
          totalNews={items.length}
          filteredNews={filteredNews.length}
        />
      </div>

      {/* Barra de topo estilo jornal */}
      <div className="relative z-10 px-6 pt-6">
        <div className="mx-auto max-w-screen-2xl bg-neutral-100/5 backdrop-blur-sm rounded-md newspaper-border">
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
      
      {/* Conteúdo principal do slider */}
      <div className="relative z-10 px-6 pb-16">
        <div className="mx-auto max-w-screen-2xl grid grid-cols-1 gap-6 min-h-[620px] sm:min-h-[640px] lg:min-h-[720px] xl:min-h-[800px] 2xl:min-h-[860px]">

          <div className="bg-neutral-100/5 rounded-md overflow-hidden shadow-2xl">
            {featured && (
              <div className="grid grid-cols-1 md:grid-cols-2">

                <div className="relative h-[280px] md:h-[440px] lg:h-[520px] xl:h-[640px] 2xl:h-[720px] overflow-hidden bg-black">
                  <img
                    src={
                      featured?.kind === "news"
                        ? featured.item?.image_url || PLACEHOLDER_IMG
                        : PLACEHOLDER_IMG
                    }
                    alt={
                      featured?.kind === "news"
                        ? featured.item?.title || "Reconciliação News"
                        : "Reconciliação News"
                    }
                    className="w-full h-full object-cover object-center sepia-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                    }}
                  />

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

                <div className="p-5">
                  {featured?.kind === "news" && (
                    <>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {featured.item?.category && (
                          <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                            {featured.item.category}
                          </span>
                        )}
                        {isHighRelevance(featured.item.relevanceScore) && (
                          <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-semibold rounded-full px-3 py-1 animate-pulse">
                            <Star className="w-3 h-3 fill-current" />
                            Alta Relevância
                          </span>
                        )}
                        {featured.item.autoTags?.map(tag => (
                          <span key={tag} className="inline-block bg-blue-500/80 text-white text-xs font-medium rounded-full px-2 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a href={featured.item.url} target="_blank" rel="noopener noreferrer">
                        <h2 className="text-xl md:text-2xl font-serif text-neutral-100 tracking-wide hover:text-yellow-200 transition-colors">
                          {featured.item.title}
                        </h2>
                      </a>
                      
                      <p className="mt-3 text-neutral-200/90 leading-relaxed dropcap line-clamp-4 font-serif">
                        {sanitizeSummary(featured.item.summary)}
                      </p>

                      <div className="mt-4 text-neutral-400 text-sm flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <span className="font-medium text-neutral-300">{featured.item.source}</span>
                        
                        {featured.item.date && (
                            <span className="text-neutral-400">{formatDateShort(new Date(featured.item.date))}</span>
                        )}

                        {featured.item.url && (
                          <a
                            href={featured.item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition-colors"
                            title="Abrir na fonte"
                          >
                            <ExternalLink className="w-4 h-4" /> Ver na fonte
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
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
        
        {/* Indicadores de Paginação */}
        <div
          ref={dotsRef}
          className="absolute bottom-6 inset-x-0 px-4 sm:px-6 flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto whitespace-nowrap snap-x snap-mandatory z-30"
        >
          {slides.map((_, idx) => (
            <button
              key={`dot-${idx}`}
              type="button"
              aria-label={`Ir para página ${idx + 1}`}
              data-dot-index={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 snap-center ${
                idx === current ? "bg-yellow-400 w-6 sm:w-8" : "bg-white/60 w-2.5 sm:w-3 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewspaperHeroSlider;
