/**
 * News API Module
 * Handles loading and caching of Christian news data from Supabase
 */

import { supabase, NewsArticle } from '../config/supabase';

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

      console.log('📰 Loading fresh news data from Supabase');
      
      // Try to load from Supabase first
      const { data: supabaseNews, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && supabaseNews && supabaseNews.length > 0) {
        // Convert Supabase data to NewsItem format
        const newsItems: NewsItem[] = supabaseNews.map((article: NewsArticle) => ({
          title: article.title,
          summary: article.summary,
          url: article.url,
          source: article.source,
          date: article.date,
          category: article.category,
          image_url: article.image_url
        }));

        // Update cache
        this.cache = newsItems;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        
        console.log(`📰 Loaded ${newsItems.length} articles from Supabase`);
        return newsItems;
      } else {
        console.warn('No data from Supabase, trying local JSON fallback');
        return this.loadFromLocalJSON();
      }
      
    } catch (error) {
      console.error('Error loading news from Supabase:', error);
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
      
      // Update cache
      this.cache = newsData.articles;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      
      console.log(`📰 Loaded ${newsData.articles.length} articles from local JSON`);
      return newsData.articles;
      
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
        title: 'Missionários brasileiros expandem trabalho na África',
        summary: 'Organizações missionárias brasileiras relatam crescimento significativo do trabalho evangelístico no continente africano.',
        url: 'https://www.guiame.com.br/missoes-brasil-africa/',
        source: 'Guiame',
        date: new Date().toISOString(),
        category: 'Missões'
      },
      {
        title: 'CPAD lança nova série de estudos sobre período intertestamentário',
        summary: 'Casa Publicadora das Assembleias de Deus apresenta material didático sobre os 400 anos entre o Antigo e Novo Testamento.',
        url: 'https://www.cpadnews.com.br/estudos-intertestamentario/',
        source: 'CPAD News',
        date: new Date().toISOString(),
        category: 'Educação Cristã'
      },
      {
        title: 'Descoberta de manuscrito antigo confirma texto bíblico',
        summary: 'Pesquisadores encontram fragmento de manuscrito que corrobora a precisão da transmissão do texto bíblico ao longo dos séculos.',
        url: 'https://www.cristianismohoje.com.br/manuscrito-biblico-descoberta/',
        source: 'Cristianismo Hoje',
        date: new Date().toISOString(),
        category: 'Arqueologia Bíblica'
      },
      {
        title: 'Igreja brasileira cresce em meio a desafios sociais',
        summary: 'Pesquisa revela crescimento da igreja evangélica brasileira e seu papel na transformação social das comunidades.',
        url: 'https://www.guiame.com.br/igreja-brasil-crescimento/',
        source: 'Guiame',
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