import { useEffect } from 'react';
import { SEOConfig } from '../types';

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Título da página
    document.title = config.title;
    
    // Meta description
    const updateOrCreateMeta = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Meta tags básicas
    updateOrCreateMeta('description', config.description);
    updateOrCreateMeta('keywords', config.keywords);
    
    // Open Graph tags
    updateOrCreateMeta('og:title', config.ogTitle, 'property');
    updateOrCreateMeta('og:description', config.ogDescription, 'property');
    updateOrCreateMeta('og:type', 'website', 'property');
    
  }, [config]);
};