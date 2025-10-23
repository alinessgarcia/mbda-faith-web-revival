// Keyword taxonomy and helper functions for scoring and tagging Christian news
// All logic here is client-side only (derived metadata). Nothing is persisted to Supabase.

export type KeywordCategoryConfig = {
  synonyms: string[];
  weight?: number; // base weight for a match (optional)
};

// Normalization: lowercase + remove accents/diacritics
export function normalize(text: string): string {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\p{L}\p{N}\s]/gu, "") // remove punctuation while preserving unicode letters/digits
    .replace(/\s+/g, " ")
    .trim();
}

// Keyword taxonomy based on the conversation with your pastor
// You can expand this list over time. Synonyms include PT-BR and EN terms.
export const KEYWORD_CATEGORIES: Record<string, KeywordCategoryConfig> = {
  "Arqueologia Bíblica": {
    synonyms: [
      "arqueologia", "arqueologico", "arqueológica", "arqueológico",
      "sitio", "sítio", "escavacao", "escavação", "escavar", "escavações",
      "museu", "museum", "achado", "achados", "descoberta", "descobertas",
      "inscricao", "inscrição", "epigrafia", "estela", "ceramica", "cerâmica",
      "antiguidades", "antiguity", "manuscrito", "manuscritos", "pergaminho", "pergaminhos",
    ],
    weight: 3,
  },
  "Criacionismo": {
    synonyms: [
      "criacionismo", "criacionista", "design inteligente", "intelligent design",
      "origens", "origem da vida", "gênesis", "genesis",
    ],
    weight: 2,
  },
  "Israel": {
    synonyms: [
      "israel", "jerusalem", "jerusalém", "galileia", "judéia", "judeia",
      "tel aviv", "cisjordania", "samaria", "judah", "judá",
    ],
    weight: 2,
  },
  "Egito": {
    synonyms: ["egito", "egypt", "cairo", "sinai", "nilo"],
    weight: 2,
  },
  "Grécia": {
    synonyms: ["grecia", "grécia", "greece", "atenas", "corinto", "macedonia", "macedônia", "creta"],
    weight: 2,
  },
  "Roma": {
    synonyms: ["roma", "rome", "romano", "romana", "império romano", "imperio romano"],
    weight: 2,
  },
  "Pérsia": {
    synonyms: ["persia", "pérsia", "iran", "irã", "medo-persa", "medos"],
    weight: 2,
  },
  "Babilônia": {
    synonyms: ["babilonia", "babilônia", "babylon", "mesopotamia", "mesopotâmia", "eufrates", "nabucodonosor"],
    weight: 2,
  },
  "Nínive": {
    synonyms: ["ninive", "nínive", "nineveh", "assiria", "assíria", "assur"],
    weight: 2,
  },
  "Síria": {
    synonyms: ["siria", "síria", "damasco", "damascus", "aram"],
    weight: 2,
  },
  "Terra Santa": {
    synonyms: ["terra santa", "holy land", "terra sagrada"],
    weight: 2,
  },
  "Crescente Fértil": {
    synonyms: ["crescente fertil", "crescente fértil", "fertile crescent", "levant", "anatólia", "anatolia"],
    weight: 2,
  },
  // Tópicos auxiliares sugeridos na conversa
  "Museu": { synonyms: ["museu", "museum", "acervo", "exposição", "exposicao"], weight: 1 },
  "Achados": { synonyms: ["achado", "achados", "descoberta", "descobertas", "evidencia", "evidência"], weight: 1 },
  "Cópias": { synonyms: ["copia", "cópia", "copias", "cópias", "replica", "réplica", "replicas", "réplicas"], weight: 1 },
  // Novo agrupamento explícito de sítios arqueológicos
  "Sítio": { synonyms: ["sitio", "sítio", "escavacao", "escavação", "escavar", "escavações"], weight: 1 },
};

export const ALL_NEWS_TAGS = Object.keys(KEYWORD_CATEGORIES);

export type ExtractResult = {
  tags: string[];
  score: number;
  matchedKeywords: { tag: string; words: string[] }[];
};

// Compute derived tags and a relevance score based on keywords found in title/summary
export function extractTagsAndScore(title: string, summary: string): ExtractResult {
  const titleNorm = normalize(title);
  const summaryNorm = normalize(summary);

  let score = 0;
  const tags: string[] = [];
  const matchedKeywords: { tag: string; words: string[] }[] = [];

  for (const [tag, cfg] of Object.entries(KEYWORD_CATEGORIES)) {
    const wordsHit: string[] = [];
    const base = cfg.weight ?? 1;

    for (const raw of cfg.synonyms) {
      const kw = normalize(raw);
      const inTitle = titleNorm.includes(kw);
      const inSummary = summaryNorm.includes(kw);
      if (inTitle || inSummary) {
        wordsHit.push(raw);
        // Title carries more importance than summary
        if (inTitle) score += base + 3;
        if (inSummary) score += base + 1;
      }
    }

    if (wordsHit.length > 0) {
      tags.push(tag);
      matchedKeywords.push({ tag, words: wordsHit });
    }
  }

  // Normalize: avoid overweighted articles without tags
  if (tags.length === 0 && score > 0) score = Math.min(score, 3);

  return { tags, score, matchedKeywords };
}