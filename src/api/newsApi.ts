/**
 * News API Module
 * Handles loading and caching of Christian news data from Supabase
 */

import { supabase, NewsArticle } from '../config/supabase';

// Limite de tempo para tentar Supabase antes de cair para JSON local
const SUPABASE_TIMEOUT_MS = 5000;
// Janela máxima para considerar artigos "recentes" (mantido em 12h)
const STALE_JSON_MAX_AGE_MS = 48 * 60 * 60 * 1000;

function withTimeout<T>(promise: Promise<T> | PromiseLike<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('SUPABASE_TIMEOUT')), ms);
    promise.then(
      (value) => { clearTimeout(id); resolve(value); },
      (err) => { clearTimeout(id); reject(err); }
    );
  });
}

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  date: string;
  category: string;
  image_url?: string;
}

export interface NewsData {
  last_updated: string;
  total_articles: number;
  sources: string[];
  articles: NewsItem[];
}

class NewsAPI {
  private cache: NewsItem[] | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  private readonly MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private readonly MIN_ARTICLES = 6; // Ensure we always show at least this many

  // Persistência local para política de retenção de 12h e blacklist permanente
  private readonly BLACKLIST_KEY = 'newsBlacklist';
  private readonly FIRST_SEEN_KEY = 'newsFirstSeen';
  private readonly RETENTION_MS = 24 * 60 * 60 * 1000; // 24 hours on site

  private getBlacklist(): Set<string> {
    try {
      const raw = localStorage.getItem(this.BLACKLIST_KEY);
      const arr = raw ? JSON.parse(raw) as string[] : [];
      return new Set(arr);
    } catch {
      return new Set<string>();
    }
  }

  private saveBlacklist(blacklist: Set<string>) {
    try {
      localStorage.setItem(this.BLACKLIST_KEY, JSON.stringify(Array.from(blacklist)));
    } catch {}
  }

  private getFirstSeenMap(): Record<string, number> {
    try {
      const raw = localStorage.getItem(this.FIRST_SEEN_KEY);
      return raw ? JSON.parse(raw) as Record<string, number> : {};
    } catch {
      return {};
    }
  }

  private saveFirstSeenMap(map: Record<string, number>) {
    try {
      localStorage.setItem(this.FIRST_SEEN_KEY, JSON.stringify(map));
    } catch {}
  }

  private applyRetentionPolicy(items: NewsItem[]): NewsItem[] {
    const now = Date.now();
    const blacklist = this.getBlacklist();
    const firstSeen = this.getFirstSeenMap();

    // Atualiza firstSeen e move para blacklist se passou de 12h no site
    for (const it of items) {
      if (!it.url) continue;
      if (blacklist.has(it.url)) continue;
      const seenAt = firstSeen[it.url];
      if (seenAt === undefined) {
        firstSeen[it.url] = now;
      } else if (now - seenAt > this.RETENTION_MS) {
        blacklist.add(it.url);
      }
    }

    // Persistir alterações
    this.saveFirstSeenMap(firstSeen);
    this.saveBlacklist(blacklist);

    // Filtrar itens em blacklist
    return items.filter(it => it.url && !blacklist.has(it.url));
  }

  // Allowlist de fontes no frontend para evitar conteúdo irrelevante
  private readonly allowedSources: Set<string> = (() => {
    const allowlistEnv = (import.meta.env.VITE_NEWS_SOURCES_ALLOWLIST || '').trim();
    if (allowlistEnv) {
      return new Set(allowlistEnv.split(',').map(s => s.trim()).filter(Boolean));
    }
    return new Set([
      // Principais fontes cristãs e reformadas
      'Gospel Prime',
      'Guiame',
      'Portas Abertas',
      'Portas Abertas - Cristãos Perseguidos',
      'Cafetorah - Notícias de Israel',
      'Folha Gospel',
      'Radio 93 - Giro Cristão',
      'CPAD News',
      'Notícias de Israel',
      'Voltemos ao Evangelho',
      'Ministério Fiel',
      'Biblical Archaeology Society',
      'Teologia Brasileira',
      'Monergismo',
      'IPB Nacional',
      'Instituto Mackenzie',
      'Cinco Solas',
      'Cristianismo Hoje',
      'Patrística News',
      'Arqueologia Bíblica BR',
      'Teologia Sistemática',
      'Editora Fiel',
      'CPAD Editora',
      'Livros Teológicos',
      'IPB Eventos',
      'Luís Sayão',
      'Hernandes Dias Lopes',
      'Augustus Nicodemus',
      'Revista Galileu'
    ]);
  })();

  private filterByAllowedSources(items: NewsItem[]): NewsItem[] {
    return items.filter(i => this.allowedSources.has(i.source));
  }

  private isRecent(dateStr?: string): boolean {
    if (!dateStr) return false;
    const ts = this.parseDateFlexible(dateStr);
    if (ts === null) return false;
    return (Date.now() - ts) <= this.MAX_AGE_MS;
  }

  // Parser resiliente para datas em pt-BR (ex: "12 de outubro de 2025"),
  // além de formatos RFC/ISO comuns (Date.parse cobre estes).
  private parseDateFlexible(dateStr?: string): number | null {
    if (!dateStr) return null;
    let ts = Date.parse(dateStr);
    if (!isNaN(ts)) return ts;

    // Tenta parse pt-BR: "12 de outubro de 2025" ou com hora
    const months: Record<string, number> = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'marco': 2, 'abril': 3, 'maio': 4, 'junho': 5,
      'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
    };
    const m = dateStr
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .match(/(\d{1,2})\s+de\s+([a-zçãáéíóú]+)\s+de\s+(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
    if (m) {
      const day = parseInt(m[1], 10);
      const monthName = m[2];
      const year = parseInt(m[3], 10);
      const hour = m[4] ? parseInt(m[4], 10) : 0;
      const minute = m[5] ? parseInt(m[5], 10) : 0;
      const second = m[6] ? parseInt(m[6], 10) : 0;
      const monthIndex = months[monthName] ?? months[monthName.normalize('NFD').replace(/[^a-z]/g, '')] ?? -1;
      if (monthIndex >= 0) {
        const d = new Date(year, monthIndex, day, hour, minute, second);
        return d.getTime();
      }
    }
    return null;
  }

  private mergeWithFallback(items: NewsItem[], minCount: number): NewsItem[] {
    if (items.length >= minCount) return items;
    const fallback = this.getFallbackNews();
    const existing = new Set(items.map(i => i.url));
    for (const f of fallback) {
      if (!existing.has(f.url)) items.push(f);
      if (items.length >= minCount) break;
    }
    return items;
  }

  /**
   * Load news data from Supabase or fallback to local JSON
   */
  async loadNews(): Promise<NewsItem[]> {
    try {
      // Check if cache is still valid
      if (this.cache && Date.now() < this.cacheExpiry) {
        console.log('📰 Loading news from cache');
        return this.cache;
      }

      console.log('📰 Loading fresh news data');
      
      // Try to load from Supabase first if available
      if (supabase) {
        // Evitar travamento quando Supabase não responde no preview/ambiente local
        const supabaseQuery = supabase
          .from('news_articles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)
          .then((res: any) => res);

        let supabaseResp: any;
        try {
          supabaseResp = await withTimeout(supabaseQuery, SUPABASE_TIMEOUT_MS);
        } catch (e) {
          console.warn('Supabase timeout/erro, usando JSON local:', e);
          return this.loadFromLocalJSON();
        }

        const { data: supabaseNews, error } = supabaseResp || {};

        if (!error && supabaseNews && supabaseNews.length > 0) {
          // Filter by recency (use created_at when available, otherwise date)
          const recentArticles = supabaseNews.filter((article: NewsArticle) => {
            const tsStr = article.created_at || article.date;
            return this.isRecent(tsStr);
          });

          // Convert Supabase data to NewsItem format
          let newsItems: NewsItem[] = recentArticles.map((article: NewsArticle) => ({
            title: article.title,
            summary: article.summary,
            url: article.url,
            source: article.source,
            date: article.date,
            category: article.category,
            image_url: article.image_url
          }));

          // Filtrar por allowlist
          newsItems = this.filterByAllowedSources(newsItems);

          // Aplicar política de retenção (12h no site + blacklist permanente)
          newsItems = this.applyRetentionPolicy(newsItems);

          // Se o dataset vindo do Supabase estiver pobre (poucos itens ou sem imagens),
          // preferimos o JSON local recém gerado pelo scraper para garantir boa experiência visual.
          const MIN_REQUIRED = 10; // queremos pelo menos 10 itens
          const MIN_IMAGE_RATIO = 0.6; // pelo menos 60% com imagem
          const imageCount = newsItems.filter(n => n.image_url && n.image_url.trim() !== '').length;
          const hasPoorQuality = newsItems.length < MIN_REQUIRED || imageCount < Math.ceil(newsItems.length * MIN_IMAGE_RATIO);

          if (hasPoorQuality) {
            console.warn(`Supabase retornou ${newsItems.length} itens (imagens: ${imageCount}). Caindo para JSON local por qualidade.`);
            const localItems = await this.loadFromLocalJSON();
            this.cache = localItems;
            this.cacheExpiry = Date.now() + this.CACHE_DURATION;
            return localItems;
          }

          // Ensure minimum number of articles using themed fallback
          newsItems = this.mergeWithFallback(newsItems, this.MIN_ARTICLES);

          // Update cache
          this.cache = newsItems;
          this.cacheExpiry = Date.now() + this.CACHE_DURATION;
          
          console.log(`📰 Loaded ${newsItems.length} recent articles from Supabase`);
          return newsItems;
        } else {
          console.warn('No data from Supabase or error occurred, trying local JSON fallback');
          return this.loadFromLocalJSON();
        }
      }

      // If Supabase not configured, use local JSON
      return this.loadFromLocalJSON();
      
    } catch (error) {
      console.error('Error loading news:', error);
      return this.loadFromLocalJSON();
    }
  }

  /**
   * Fallback to load from local JSON file
   */
  private async loadFromLocalJSON(): Promise<NewsItem[]> {
    try {
      console.log('📰 Loading from local JSON file');
      
      // Use JSON em /public/data para funcionar em produção e desenvolvimento
      // Evita cache CDN/browser: muda o query param a cada minuto e força no-store
      const cacheBust = Math.floor(Date.now() / 60000); // muda a cada 60s
      const response = await fetch(`/data/christian_news.json?cb=${cacheBust}`, { cache: 'no-store' as RequestCache });
      
      if (!response.ok) {
        console.warn('Failed to load local news data, using hardcoded fallback');
        return this.getFallbackNews();
      }

      const newsData: NewsData = await response.json();

      // If the JSON itself is older than 48h, consider it stale and use fallback
      const lastUpdatedTs = Date.parse(newsData.last_updated);
      const isJsonStale = isNaN(lastUpdatedTs) ? true : (Date.now() - lastUpdatedTs) > STALE_JSON_MAX_AGE_MS;
      if (isJsonStale) {
        console.warn('Local JSON is stale (>48h), using themed fallback news');
        const fallbackItems = this.getFallbackNews();
        this.cache = fallbackItems;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        return fallbackItems;
      }
      
      // Filter articles by their own date when available; only fallback to last_updated if the article has no date
      let filtered = (newsData.articles || []).filter(a => {
        if (a.date) return this.isRecent(a.date);
        return this.isRecent(newsData.last_updated);
      });

      // Filtrar por allowlist
      filtered = this.filterByAllowedSources(filtered);

      // Aplicar política de retenção (12h no site + blacklist permanente)
      filtered = this.applyRetentionPolicy(filtered);

      // Ensure minimum number of articles using themed fallback
      filtered = this.mergeWithFallback(filtered, this.MIN_ARTICLES);
      
      // Update cache
      this.cache = filtered;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      
      console.log(`📰 Loaded ${filtered.length} recent articles from local JSON`);
      return filtered;
      
    } catch (error) {
      console.error('Error loading local news data:', error);
      return this.getFallbackNews();
    }
  }

  /**
   * Get fallback news when main data source fails
   */
  private getFallbackNews(): NewsItem[] {
    return [
      {
        title: 'Arqueólogos descobrem evidências da época de Jesus na Galileia',
        summary: 'Nova descoberta arqueológica na região da Galileia fornece mais evidências sobre o contexto histórico da vida de Jesus Cristo.',
        url: 'https://www.gospelprime.com.br/arqueologia-galileia-jesus/',
        source: 'Gospel Prime',
        date: new Date().toISOString(),
        category: 'Arqueologia Bíblica'
      },
      {
        title: 'Perseguição religiosa atinge níveis recordes mundialmente',
        summary: 'Relatório da Portas Abertas revela aumento significativo da perseguição contra cristãos em diversos países.',
        url: 'https://www.portasabertas.org.br/noticias/perseguicao-mundial-2024/',
        source: 'Portas Abertas',
        date: new Date().toISOString(),
        category: 'Perseguição Religiosa'
      },
      {
        title: 'Nova tradução bíblica facilita leitura para jovens brasileiros',
        summary: 'Sociedade Bíblica do Brasil lança versão com linguagem contemporânea para alcançar a nova geração de cristãos.',
        url: 'https://www.guiame.com.br/biblia-jovens-brasil/',
        source: 'Guiame',
        date: new Date().toISOString(),
        category: 'Bíblia e Teologia'
      },
      {
        title: 'Igreja brasileira cresce em engajamento social nas comunidades',
        summary: 'Pastores e líderes relatam aumento na participação em projetos sociais e de reconciliação em diversas cidades.',
        url: 'https://www.gospelprime.com.br/igreja-brasileira-engajamento-social/',
        source: 'Gospel Prime',
        date: new Date().toISOString(),
        category: 'Igreja no Brasil'
      },
      {
        title: 'Teólogos debatem relevância da fé cristã na era digital',
        summary: 'Conferência reúne especialistas para discutir como a igreja pode se adaptar aos desafios da tecnologia moderna.',
        url: 'https://www.cristianismohoje.com.br/fe-era-digital/',
        source: 'Cristianismo Hoje',
        date: new Date().toISOString(),
        category: 'Teologia Contemporânea'
      }
    ];
  }

  /**
   * Refresh news data by clearing cache
   */
  async refreshNews(): Promise<NewsItem[]> {
    this.cache = null;
    this.cacheExpiry = 0;
    return this.loadNews();
  }

  /**
   * Get cache status
   */
  getCacheInfo() {
    return {
      isCached: this.cache !== null,
      cacheExpiry: this.cacheExpiry,
      timeUntilExpiry: Math.max(0, this.cacheExpiry - Date.now()),
      lastUpdated: this.cache ? new Date().toISOString() : null
    };
  }
}

// Export singleton instance
export const newsAPI = new NewsAPI();

// Export utility functions
export const loadChristianNews = () => newsAPI.loadNews();
export const refreshChristianNews = () => newsAPI.refreshNews();
export const getNewsCacheInfo = () => newsAPI.getCacheInfo();
// Função auxiliar para limpar estado local e forçar atualização
export const resetNewsLocalState = () => {
  try {
    localStorage.removeItem('newsBlacklist');
    localStorage.removeItem('newsFirstSeen');
  } catch {}
  return newsAPI.refreshNews();
};