/**
 * News API Module
 * Handles loading and caching of Christian news data from Supabase
 */

import { supabase, NewsArticle } from '../config/supabase';

// Limite de tempo para tentar Supabase antes de cair para JSON local
const SUPABASE_TIMEOUT_MS = 5000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
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

  // Allowlist de fontes no frontend para evitar conteúdo irrelevante
  private readonly allowedSources: Set<string> = (() => {
    const fromEnv = (import.meta as any)?.env?.VITE_NEWS_SOURCES_ALLOWLIST as string | undefined;
    const list = (fromEnv || '').split(',').map(s => s.trim()).filter(Boolean);
    if (list.length > 0) return new Set(list);
    return new Set([
      'Gospel Prime',
      'Guiame',
      'Portas Abertas',
      'Portas Abertas - Cristãos Perseguidos',
      'Cafetorah - Notícias de Israel',
      'Folha Gospel',
      'Radio 93 - Giro Cristão',
      'CPAD News'
    ]);
  })();

  private filterByAllowedSources(items: NewsItem[]): NewsItem[] {
    return items.filter(i => this.allowedSources.has(i.source));
  }

  private isRecent(dateStr?: string): boolean {
    if (!dateStr) return false;
    const ts = Date.parse(dateStr);
    if (isNaN(ts)) return false;
    return (Date.now() - ts) <= this.MAX_AGE_MS;
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
          .limit(20);

        let supabaseResp;
        try {
          supabaseResp = await withTimeout(supabaseQuery, SUPABASE_TIMEOUT_MS);
        } catch (e) {
          console.warn('Supabase timeout/erro, usando JSON local:', e);
          return this.loadFromLocalJSON();
        }

        const { data: supabaseNews, error } = supabaseResp as any;

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
      const response = await fetch('/data/christian_news.json');
      
      if (!response.ok) {
        console.warn('Failed to load local news data, using hardcoded fallback');
        return this.getFallbackNews();
      }

      const newsData: NewsData = await response.json();

      // If the JSON itself is older than 48h, consider it stale and use fallback
      const lastUpdatedTs = Date.parse(newsData.last_updated);
      const isJsonStale = isNaN(lastUpdatedTs) ? true : (Date.now() - lastUpdatedTs) > this.MAX_AGE_MS;
      if (isJsonStale) {
        console.warn('Local JSON is stale (>48h), using themed fallback news');
        const fallbackItems = this.getFallbackNews();
        this.cache = fallbackItems;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        return fallbackItems;
      }
      
      // Filter articles older than 48h using article.date (fallback to last_updated if missing)
      let filtered = (newsData.articles || []).filter(a => {
        return this.isRecent(a.date || newsData.last_updated);
      });

      // Filtrar por allowlist
      filtered = this.filterByAllowedSources(filtered);

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