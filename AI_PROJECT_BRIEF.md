# Brief do Projeto para IAs

Este documento orienta outras IAs sobre o projeto "Boletim da Reconciliação": o que é, como está estruturado, até onde chegamos, quais são as principais reclamações do dono, seus desejos e o objetivo a alcançar.

## Visão Geral
- Projeto web em `React + TypeScript` (Vite) que exibe um slider de notícias cristãs.
- Scraper em `Python` coleta artigos de múltiplas fontes e grava em JSON local. Integração opcional com Supabase.
- Foco: conteúdo cristão em português, com curadoria e fontes confiáveis, evitando duplicidades e mantendo imagens estáveis.

## Estrutura Essencial
- `scripts/news_scraper.py`: principal coletor; contém scrapers específicos e um método genérico de RSS.
- `public/data/christian_news.json` e `src/data/christian_news.json`: dados consumidos pelo frontend.
- `src/components/NewsSlider.tsx` e `src/components/NewspaperHeroSlider.tsx`: sliders de notícias (com fallback de imagem).
- `public/images/boletim-placeholder.svg`: placeholder usado quando a notícia não tem imagem.
- `src/api/newsApi.ts`: acesso aos dados (local/Supabase, se configurado).

## Estado Atual (resumo técnico)
- Implementado `scrape_generic_rss` e integradas novas fontes livres (ex.: Gospel Prime, Folha Gospel, Guiame, Voltemos ao Evangelho, Ministério Fiel, CPAD etc.).
- Deduplicação por `title + url` nos resultados do scraper.
- Execução do scraper gerou novos itens em `christian_news.json` (tanto em `src/data` quanto `public/data`).
- Frontend atualizado para usar um placeholder de imagem com texto "Boletim da Reconciliação" quando a imagem falta ou falha.
- Preview sem erros aparentes; Supabase não recebeu novos artigos recentes (provavelmente já existentes/duplicados ou regras de recência).

## Principais Reclamações do Dono (observadas)
- Poucos artigos visíveis em certos momentos ou fontes com baixa atualização.
- Muitas notícias sem imagem; falta de consistência visual no slider.
- Duplicidades e variações de títulos/links causando confusão.
- Integrações que não salvam no Supabase quando já existem ou quando não passam filtros de recência.

## Desejos do Dono
- Aumentar a cobertura com fontes cristãs brasileiras confiáveis e sustentáveis (RSS, páginas estáticas).
- Garantir imagem em todas as notícias (fallback obrigatório com texto "Boletim da Reconciliação").
- Evitar duplicidade (dedup agressivo por título + URL).
- Experiência de UI estável, sem quebra quando imagens falham.
- Possível controle/toggle de fontes visíveis no frontend.

## Objetivo a Alcançar
- Entregar uma vitrine de notícias cristãs atualizada e robusta, com bom volume diário, imagens consistentes, fontes confiáveis e sem duplicatas; opcionalmente persistindo em Supabase para histórico/analytics.

## Decisões Técnicas Recentes
- No scraper (`scripts/news_scraper.py`):
  - Adicionado `scrape_generic_rss(feed_url, source_name, category)` para integrar rapidamente RSSs.
  - Melhorada extração de imagens via `extract_image_from_content` tentando meta tags (`og:image`, `twitter:image`) e seletores comuns.
  - Deduplicação por chave composta (título + URL).
- No frontend:
  - `NewsSlider.tsx` e `NewspaperHeroSlider.tsx` agora usam `/images/boletim-placeholder.svg` como fallback com `alt` "Boletim da Reconciliação".

## Por que Falta Imagem (causas típicas)
- Fonte sem `og:image`/`twitter:image` e sem `<img>` no conteúdo; RSS sem `enclosure`/`media:content`.
- Post apenas textual ou aviso/evento (alguns scrapers setam `image_url: None`).
- Imagem carregada via JS/lazyload (`data-src`, `srcset`), enquanto o scraper é estático.
- Hotlink/CDN bloqueando (403) sem `Referer` adequado.
- HTML fora do padrão, links relativos incomuns ou timeouts na página.

## Como Reproduzir Localmente
- Rodar coletor: `python scripts/news_scraper.py`
- Rodar frontend: `npm install` e depois `npm run dev` (ver `http://localhost:8080/`, `8081/`, `8082/`).
- Verificar dados: abra `public/data/christian_news.json` e o slider na home.

## Como Adicionar Novas Fontes RSS
- Preferir o método genérico: chame `scrape_generic_rss("<feed_url>", "<Nome da Fonte>", "<Categoria>")` dentro do fluxo de scraping.
- Se necessário, criar função específica seguindo o padrão existente e usar `extract_image_from_content` primeiro; depois tentar `<img>` dentro de `content:encoded`.
- Validar: executar o scraper, conferir JSONs e visualizar no dev server.

## Próximas Melhorias Sugeridas
- Suporte a lazyload: ler `img[data-src]`, `srcset`, `picture > source`.
- Cobrir variantes RSS: `media:content`, `media:thumbnail`, `twitter:image:src`, `og:image:secure_url`.
- Melhor normalização de URLs (redirecionamentos, relativas complexas).
- Ajuste fino no filtro de recência e na política de atualização do Supabase.
- Toggle de fontes no UI e limites configuráveis por fonte.

## Boas Práticas para IAs neste Repositório
- Manter mudanças focadas e consistentes com o estilo atual.
- Validar sempre com execução do scraper e visualização no dev server.
- Evitar corrigir bugs não relacionados ao escopo atual; apenas sinalizar.
- Documentar novas integrações/fuentes e decisões no PR ou aqui.

---
Última atualização: este brief foi criado para orientar IAs sobre o estado atual do projeto e suas prioridades. Atualize este documento conforme novas decisões forem tomadas.