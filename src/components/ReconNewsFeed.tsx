import React, { useEffect, useMemo, useState, useCallback } from "react";
import { RefreshCcw, ArrowUpRight, Globe2, Clock, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { loadChristianNews, refreshChristianNews, NewsItem, resetNewsLocalState } from "../api/newsApi";
import NewsFilters, { NewsFilterState } from "./NewsFilters";

// Utilidades simples
const formatDate = (d?: string) => {
  if (!d) return "";
  const date = new Date(d);
  return isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
};

const ReconNewsCard: React.FC<{ item: NewsItem }> = ({ item }) => {
  const img = (item.image_url && item.image_url.trim()) ? item.image_url : "/images/boletim-placeholder.svg";
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-slate-100">
      <div className="aspect-[16/9] bg-slate-100">
        <img src={img} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="text-xs text-slate-500 flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1"><Globe2 className="w-3.5 h-3.5" />{item.source}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(item.date)}</span>
        </div>
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{item.title}</h3>
        {item.summary && (
          <p className="text-slate-600 text-sm line-clamp-3">{item.summary}</p>
        )}
        <div className="mt-4 flex justify-end">
          {item.url && (
            <a target="_blank" rel="noreferrer" href={item.url}
               className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Ler matéria <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ReconNewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Busca e filtros avançados, igual ao sistema do slider
  const [filters, setFilters] = useState<NewsFilterState>({
    searchTerm: '',
    selectedTags: [],
    selectedCategories: [],
    minRelevanceScore: 0,
  });
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(0);

  // Carregar notícias
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await loadChristianNews();
        if (mounted) setNews(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Responsividade: itens por página
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) setItemsPerPage(1);
      else if (w < 768) setItemsPerPage(2);
      else if (w < 1024) setItemsPerPage(3);
      else if (w < 1280) setItemsPerPage(4);
      else setItemsPerPage(6);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Busca inteligente com sinônimos (igual ao NewsSlider)
  const searchNews = useCallback((items: NewsItem[], term: string): NewsItem[] => {
    if (!term.trim()) return items;
    const normalized = term.toLowerCase().trim();
    const terms = normalized.split(/\s+/);
    const synonyms: Record<string, string[]> = {
      'arqueologia': ['arqueológico', 'escavação', 'sítio', 'ruínas', 'descoberta'],
      'israel': ['jerusalém', 'galileia', 'terra santa'],
      'criacionismo': ['criacionista', 'design inteligente'],
      'egito': ['egípcio', 'faraó', 'pirâmide'],
      'babilônia': ['babilônico', 'nabucodonosor'],
    };
    return items.filter(item => {
      const text = `${item.title} ${item.summary} ${item.detectedKeywords?.join(' ') || ''}`.toLowerCase();
      return terms.some(t => {
        if (text.includes(t)) return true;
        for (const [key, syns] of Object.entries(synonyms)) {
          if (t === key || syns.includes(t)) {
            if (text.includes(key) || syns.some(s => text.includes(s))) {
              return true;
            }
          }
        }
        return false;
      });
    });
  }, []);

  // Tags e categorias disponíveis
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    news.forEach(item => item.autoTags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [news]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    news.forEach(item => { if (item.category) categories.add(item.category); });
    return Array.from(categories).sort();
  }, [news]);

  // Aplica filtros e ordena por relevância
  const filtered = useMemo(() => {
    let result = [...news];
    // Busca
    result = searchNews(result, filters.searchTerm);
    // Tags
    if (filters.selectedTags.length > 0) {
      result = result.filter(item => item.autoTags?.some(tag => filters.selectedTags.includes(tag)));
    }
    // Categorias
    if (filters.selectedCategories.length > 0) {
      result = result.filter(item => filters.selectedCategories.includes(item.category));
    }
    // Relevância
    if (filters.minRelevanceScore > 0) {
      result = result.filter(item => (item.relevanceScore || 0) >= filters.minRelevanceScore);
    }
    // Ordena por relevância
    result.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
    return result;
  }, [news, filters, searchNews]);

  const pages = useMemo(() => {
    const arr: NewsItem[][] = [];
    for (let i = 0; i < filtered.length; i += itemsPerPage) {
      arr.push(filtered.slice(i, i + itemsPerPage));
    }
    return arr;
  }, [filtered, itemsPerPage]);

  useEffect(() => { setCurrentPage(0); }, [filters, itemsPerPage, news]);

  const totalPages = pages.length || 1;
  const prevPage = () => setCurrentPage(p => Math.max(0, p - 1));
  const nextPage = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await refreshChristianNews();
      setNews(data || []);
      setCurrentPage(0);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCollectNow = async () => {
    try {
      setRefreshing(true);
      const data = await resetNewsLocalState();
      setNews(data || []);
      setCurrentPage(0);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  // Contadores
  const totalNews = news.length;
  const todayCount = useMemo(() => {
    const today = new Date();
    return news.filter(n => {
      const d = new Date(n.date);
      return !isNaN(d.getTime()) && d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    }).length;
  }, [news]);
  const sourcesCount = useMemo(() => {
    const s = new Set<string>();
    news.forEach(n => { if (n.source) s.add(n.source); });
    return s.size;
  }, [news]);

  if (loading) {
    return (
      <section className="pt-20 sm:pt-24 pb-6 scroll-mt-24 md:scroll-mt-28">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-slate-700">Carregando notícias...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="reconnews" className="pt-20 sm:pt-24 pb-6 scroll-mt-24 md:scroll-mt-28">
      {/* Header com gradient, título e botões */}
      <div className="px-4 py-6 bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-500 text-white rounded-b-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img src="/favicon.ico" alt="ReconNews" className="w-8 h-8 rounded" />
              <h2 className="text-2xl md:text-3xl font-bold">ReconNews</h2>
            </div>
            <p className="text-white/90 text-sm mt-1">Descobertas cristãs, achados arqueológicos sérios e pesquisas históricas</p>
            <p className="text-white/80 text-xs mt-1">Atualização automática: 10:00 & 22:00</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} disabled={refreshing}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20">
              <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <button onClick={handleCollectNow} disabled={refreshing}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20">
              <Download className={`w-4 h-4 ${refreshing ? 'opacity-50' : ''}`} />
              Coletar Agora
            </button>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs">Total de Notícias</div>
            <div className="text-2xl font-bold">{totalNews}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs">Hoje</div>
            <div className="text-2xl font-bold">{todayCount}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs">Fontes</div>
            <div className="text-2xl font-bold">{sourcesCount}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs">Atualização</div>
            <div className="text-sm">10:00 & 22:00</div>
          </div>
        </div>
      </div>

      {/* Filtros ReconNews */}
      <div className="relative z-10 px-4 mt-4">
        <NewsFilters
          availableTags={availableTags}
          availableCategories={availableCategories}
          filters={filters}
          onFiltersChange={setFilters}
          totalNews={news.length}
          filteredNews={filtered.length}
        />
      </div>

      {/* Grade de cards */}
      <div className="px-4 mt-6">
        {pages.length === 0 ? (
          <p className="text-white">Nenhum resultado para sua busca.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pages[currentPage].map((item, idx) => (
              <ReconNewsCard key={`${item.url || item.title}-${idx}`} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Paginação por setas */}
      {pages.length > 1 && (
        <div className="mt-6 px-4 flex items-center justify-between">
          <button onClick={prevPage} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200">
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <div className="text-sm text-white">Página {currentPage + 1} de {totalPages}</div>
          <button onClick={nextPage} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200">
            Próxima <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};

export default ReconNewsFeed;