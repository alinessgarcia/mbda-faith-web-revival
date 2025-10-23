// Geração de JSON Feed 1.1 e RSS 2.0 a partir de public/data/christian_news.json
// Uso: node scripts/generate-feeds.mjs

import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const siteUrl = process.env.SITE_URL || 'http://localhost:8080';
const rootDir = process.cwd();
const inputPath = path.join(rootDir, 'public', 'data', 'christian_news.json');
const outputJsonFeedPath = path.join(rootDir, 'public', 'reconnews-feed.json');
const outputRssPath = path.join(rootDir, 'public', 'reconnews-rss.xml');

function xmlEscape(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function guessMimeTypeFromUrl(url = '') {
  const u = url.toLowerCase();
  if (u.endsWith('.jpg') || u.endsWith('.jpeg')) return 'image/jpeg';
  if (u.endsWith('.png')) return 'image/png';
  if (u.endsWith('.webp')) return 'image/webp';
  if (u.endsWith('.avif')) return 'image/avif';
  return 'image/*';
}

function toISO(dateStr) {
  const ts = Date.parse(dateStr);
  if (Number.isNaN(ts)) return undefined;
  return new Date(ts).toISOString();
}

function toUTC(dateStr) {
  const ts = Date.parse(dateStr);
  if (Number.isNaN(ts)) return undefined;
  return new Date(ts).toUTCString();
}

async function generate() {
  const raw = await readFile(inputPath, 'utf-8');
  const data = JSON.parse(raw);
  const metaLastUpdatedISO = toISO(data.last_updated) || new Date().toISOString();
  const metaLastUpdatedUTC = new Date(metaLastUpdatedISO).toUTCString();
  const articles = Array.isArray(data.articles) ? data.articles : [];

  // JSON Feed v1.1
  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Reconciliação News',
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/reconnews-feed.json`,
    description: 'Atualizações diárias de notícias cristãs e arqueologia bíblica.',
    language: 'pt-BR',
    icon: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    authors: [{ name: 'MB da Reconciliação' }],
    expired: false,
    items: articles.map((a) => {
      const id = a.url || `${a.source || 'news'}:${a.title}`;
      const date_published = toISO(a.date);
      const tags = [];
      if (a.category) tags.push(a.category);
      if (Array.isArray(a.tags)) tags.push(...a.tags);
      return {
        id,
        url: a.url,
        title: a.title,
        content_text: a.summary || '',
        date_published,
        image: a.image_url || undefined,
        tags: tags.length ? tags : undefined,
        authors: a.source ? [{ name: a.source }] : undefined,
      };
    }),
  };

  // RSS 2.0
  let rss = '';
  rss += '<?xml version="1.0" encoding="UTF-8"?>\n';
  rss += '<rss version="2.0">\n';
  rss += '  <channel>\n';
  rss += `    <title>${xmlEscape('Reconciliação News')}</title>\n`;
  rss += `    <link>${xmlEscape(siteUrl)}</link>\n`;
  rss += `    <description>${xmlEscape('Atualizações diárias de notícias cristãs e arqueologia bíblica.')}</description>\n`;
  rss += `    <language>pt-BR</language>\n`;
  rss += `    <lastBuildDate>${xmlEscape(metaLastUpdatedUTC)}</lastBuildDate>\n`;

  for (const a of articles) {
    const pubDate = toUTC(a.date) || metaLastUpdatedUTC;
    const enclosure = a.image_url
      ? `\n      <enclosure url="${xmlEscape(a.image_url)}" type="${xmlEscape(guessMimeTypeFromUrl(a.image_url))}" />`
      : '';
    rss += '    <item>\n';
    rss += `      <title>${xmlEscape(a.title || '')}</title>\n`;
    rss += `      <link>${xmlEscape(a.url || '')}</link>\n`;
    rss += `      <guid isPermaLink="true">${xmlEscape(a.url || '')}</guid>\n`;
    rss += `      <pubDate>${xmlEscape(pubDate)}</pubDate>\n`;
    if (a.category) rss += `      <category>${xmlEscape(a.category)}</category>\n`;
    rss += `      <description><![CDATA[${(a.summary || '').trim()}]]></description>\n`;
    rss += `      ${enclosure}\n`;
    rss += '    </item>\n';
  }

  rss += '  </channel>\n';
  rss += '</rss>\n';

  // Garante diretório public existente
  await mkdir(path.join(rootDir, 'public'), { recursive: true });

  await writeFile(outputJsonFeedPath, JSON.stringify(jsonFeed, null, 2), 'utf-8');
  await writeFile(outputRssPath, rss, 'utf-8');

  console.log('✅ Feeds gerados com sucesso:');
  console.log(' - JSON Feed:', outputJsonFeedPath);
  console.log(' - RSS:', outputRssPath);
}

generate().catch((err) => {
  console.error('❌ Erro ao gerar feeds:', err);
  process.exitCode = 1;
});