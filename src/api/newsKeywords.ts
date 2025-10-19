/**
 * Keyword extraction and simple relevance scoring
 * Used by NewsAPI.enrichWithKeywords to derive tags and scores from title+summary.
 */

export type MatchedKeywords = { tag: string; words: string[] };
export type ExtractResult = { tags: string[]; score: number; matchedKeywords: MatchedKeywords[] };

// Tag definitions with associated synonyms/keywords and weights
const TAG_DEFINITIONS: Array<{ tag: string; keywords: string[]; weight: number }> = [
  { tag: 'Arqueologia Bíblica', keywords: ['arqueologia','arqueológico','escavação','sítio','ruínas','descoberta','artefato','fóssil'], weight: 2 },
  { tag: 'Israel e Terra Santa', keywords: ['israel','jerusalém','galileia','terra santa'], weight: 3 },
  { tag: 'Oriente Médio Antigo', keywords: ['egito','egípcio','faraó','pérsia','babilônia','babilônico','nínive','síria','crescente fértil','assírio'], weight: 2 },
  { tag: 'Mundo Greco-Romano', keywords: ['grécia','helênico','romano','roma'], weight: 1 },
  { tag: 'Criacionismo', keywords: ['criacionismo','criacionista','design inteligente'], weight: 2 },
  { tag: 'Perseguição Cristã', keywords: ['perseguição','cristãos perseguidos','martírio','portas abertas'], weight: 2 },
  { tag: 'Teologia Reformada', keywords: ['reforma','calvinismo','solas','sola fide','sola scriptura','sola gratia'], weight: 1 },
  { tag: 'Missões', keywords: ['missões','missionário','evangelização','evangelizar','discipulado'], weight: 1 },
  { tag: 'Igreja Local', keywords: ['culto','igreja','congregação','pastor','membro','diácono'], weight: 1 },
  { tag: 'Família', keywords: ['família','casamento','pais','filhos'], weight: 1 },
  { tag: 'Crianças', keywords: ['crianças','escolinha','ebd'], weight: 1 },
  { tag: 'Educação', keywords: ['seminário','faculdade','mackenzie','escola','curso'], weight: 1 },
  { tag: 'Eventos', keywords: ['conferência','congresso','evento','agenda','calendário'], weight: 1 },
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/\s+/g, ' ');
}

export function extractTagsAndScore(title: string, summary: string): ExtractResult {
  const text = normalizeText(`${title} ${summary}`);
  let score = 0;
  const tags = new Set<string>();
  const matchedKeywords: MatchedKeywords[] = [];

  for (const def of TAG_DEFINITIONS) {
    const matched: string[] = [];
    for (const kw of def.keywords) {
      // normaliza keyword também
      const nkw = normalizeText(kw);
      if (text.includes(nkw)) {
        matched.push(kw);
      }
    }
    if (matched.length > 0) {
      tags.add(def.tag);
      // pontua por ocorrência e peso
      score += def.weight * matched.length;
      matchedKeywords.push({ tag: def.tag, words: Array.from(new Set(matched)) });
    }
  }

  return { tags: Array.from(tags), score, matchedKeywords };
}