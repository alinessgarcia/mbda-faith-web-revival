#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
News Scraper for Christian Content
Scrapes real news from reliable Christian sources in Brazil
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime, timedelta, timezone
import re
from urllib.parse import urljoin, urlparse, quote, parse_qs, unquote
import logging
from typing import List, Dict, Optional
import os
import sys

# Add parent directory to path to import supabase config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Supabase imports
from supabase import create_client, Client
from dotenv import load_dotenv
from dateutil import parser as dateutil_parser

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local'))

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ChristianNewsScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Initialize Supabase client
        self.supabase_url = os.getenv('VITE_SUPABASE_URL')
        self.supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase credentials not found. Will save to JSON only.")
            self.supabase = None
        else:
            try:
                self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
                logger.info("Supabase client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                self.supabase = None
        
        # News sources configuration - Focado em conteúdo teológico reformado e conservador
        self.sources = {
            'gospel_prime': {
                'name': 'Gospel Prime',
                'url': 'https://www.gospelprime.com.br',
                'rss': 'https://www.gospelprime.com.br/feed/',
                'categories': ['teologia', 'igreja', 'doutrina', 'reforma']
            },
            'guiame': {
                'name': 'Guiame',
                'url': 'https://guiame.com.br',
                'rss': 'https://guiame.com.br/rss.xml',
                'categories': ['teologia', 'igreja', 'doutrina']
            },
            'cristianismo_hoje': {
                'name': 'Cristianismo Hoje',
                'url': 'https://cristianismohoje.com.br',
                'categories': ['teologia', 'igreja', 'reforma', 'doutrina']
            },
            'portas_abertas': {
                'name': 'Portas Abertas',
                'url': 'https://www.portasabertas.org.br',
                'categories': ['perseguicao', 'igreja-perseguida', 'missoes']
            },
            'portas_abertas_perseguidos': {
                'name': 'Portas Abertas - Cristãos Perseguidos',
                'url': 'https://portasabertas.org.br/noticias/cristaos-perseguidos/',
                'categories': ['perseguicao', 'igreja-perseguida', 'missoes', 'reconciliacao']
            },
            'cafetorah_israel': {
                'name': 'Cafetorah - Notícias de Israel',
                'url': 'https://cafetorah.com/category/noticias-de-israel/',
                'categories': ['israel', 'profecias', 'escatologia', 'oriente-medio']
            },
            'voltemos_ao_evangelho': {
                'name': 'Voltemos ao Evangelho',
                'url': 'https://voltemosaoevangelho.com',
                'categories': ['teologia-reformada', 'doutrina', 'pregacao']
            },
            'monergismo': {
                'name': 'Monergismo',
                'url': 'https://www.monergismo.com',
                'categories': ['teologia-reformada', 'calvinismo', 'doutrina']
            },
            'folha_gospel': {
                'name': 'Folha Gospel',
                'url': 'https://folhagospel.com/c/fg-news/',
                'categories': ['noticias-cristas', 'igreja', 'evangelicos', 'reconciliacao']
            },
            'radio93': {
                'name': 'Radio 93 - Giro Cristão',
                'url': 'https://radio93.com.br/noticias/giro-cristao/',
                'rss': 'https://radio93.com.br/categoria/giro-cristao/feed/',
                'categories': ['noticias-cristas', 'igreja', 'evangelicos', 'reconciliacao']
            },
            'bbc_portuguese': {
                'name': 'BBC News Brasil',
                'url': 'https://www.bbc.com/portuguese',
                'categories': ['mundo', 'ciencia', 'arqueologia', 'historia']
            },
            'bbc_arqueologia': {
                'name': 'BBC News Brasil - Arqueologia',
                'url': 'https://www.bbc.com/portuguese/topics/c06gq6k4vk3t',
                'categories': ['arqueologia', 'historia']
            },
            'galileu_arqueologia': {
                'name': 'Revista Galileu - Arqueologia',
                'url': 'https://revistagalileu.globo.com/ciencia/arqueologia/',
                'categories': ['ciencia', 'arqueologia', 'historia']
            },
            'cnnbrasil_arqueologia': {
                'name': 'CNN Brasil - Arqueologia',
                'url': 'https://www.cnnbrasil.com.br/tudo-sobre/arqueologia/',
                'categories': ['arqueologia', 'historia', 'ciencia']
            },
            'nationalgeo_br_arqueologia': {
                'name': 'National Geographic Brasil - Arqueologia',
                'url': 'https://www.nationalgeographicbrasil.com/assunto/temas/historia/arqueologia',
                'categories': ['arqueologia', 'historia', 'ciencia']
            },
            'google_news': {
                'name': 'Google News',
                'queries': [
                    {'label': 'Arqueologia Bíblica', 'q': '"arqueologia bíblica" OR "biblical archaeology" OR "manuscritos do Mar Morto" OR "Dead Sea Scrolls" OR Qumran OR Israel arqueologia', 'category': 'Arqueologia e História'},
                    {'label': 'Cristãos Perseguidos', 'q': '"cristãos perseguidos" OR "igreja perseguida" OR "Portas Abertas" OR site:portasabertas.org.br', 'category': 'Igreja Perseguida'},
                    {'label': 'Reconciliação Cristã', 'q': '"reconciliação cristã" OR "perdão bíblico" OR "unidade da igreja"', 'category': 'Ministério da Reconciliação'},
                    {'label': 'Período Interbíblico', 'q': '"período interbíblico" OR intertestamental OR Macabeus', 'category': 'História Bíblica'},
                    {'label': 'Patrística', 'q': 'patrística OR "pais da igreja" OR Agostinho OR Orígenes OR Tertuliano', 'category': 'História da Igreja'},
                    {'label': 'Escavações Bíblicas', 'q': '"escavações bíblicas" OR "arqueologia bíblica" OR Qumran OR "cidade de Davi" OR "Jerusalém antiga"', 'category': 'Arqueologia Bíblica'},
                    {'label': 'Idade Média', 'q': '"idade média" OR medieval OR "história da igreja medieval" OR "reforma protestante"', 'category': 'História da Igreja'},
                    {'label': 'Debates Teológicos', 'q': '"debates teológicos" OR "controvérsias teológicas" OR soteriologia OR "livre arbítrio" OR predestinação', 'category': 'Teologia'},
                    {'label': 'Calvinismo', 'q': 'calvinismo OR reformado OR "João Calvino"', 'category': 'Teologia Reformada'},
                    {'label': 'Arminianismo', 'q': 'arminianismo OR "Jacó Armínio" OR "livre arbítrio"', 'category': 'Teologia'},
                    {'label': 'Seitas da Época de Jesus', 'q': 'fariseus OR saduceus OR essênios OR zelotes OR "seitas da época de Jesus"', 'category': 'Contexto Histórico'},
                    {'label': 'Usos e Costumes da Bíblia', 'q': '"usos e costumes da bíblia" OR "costumes bíblicos" OR "contexto judaico" OR "cultura bíblica"', 'category': 'Contexto Cultural'}
                ]
            }
        }

    def parse_article_date(self, date_str: Optional[str]) -> Optional[datetime]:
        try:
            if not date_str:
                return None
            dt = dateutil_parser.parse(str(date_str))
            if dt.tzinfo is not None:
                dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
            return dt
        except Exception:
            return None

    def is_recent_article(self, article: Dict, max_age_hours: int = 24) -> bool:
        dt = None
        if 'date' in article:
            dt = self.parse_article_date(article.get('date'))
        if dt is None:
            return True
        age = datetime.utcnow() - dt
        return age <= timedelta(hours=max_age_hours)

    def filter_recent_articles(self, articles: List[Dict], max_age_hours: int = 24) -> List[Dict]:
        return [a for a in articles if self.is_recent_article(a, max_age_hours=max_age_hours)]

    def scrape_generic_rss(self, source_name: str, rss_url: str, category: str = 'Notícias Cristãs', limit: int = 10) -> List[Dict]:
        """Coletor genérico de RSS: normaliza itens para o nosso esquema."""
        news_list: List[Dict] = []
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml',
                'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            }
            response = requests.get(rss_url, headers=headers, timeout=15)
            if response.status_code != 200:
                logger.warning(f"Falha ao acessar RSS {source_name}: {response.status_code}")
                return news_list

            soup = BeautifulSoup(response.content, 'xml')
            items = soup.find_all('item')[:limit]
            for item in items:
                try:
                    title_elem = item.find('title')
                    link_elem = item.find('link')
                    description_elem = item.find('description')
                    pub_date_elem = item.find('pubDate')

                    if not title_elem or not link_elem:
                        continue

                    title = self.clean_text(title_elem.get_text())
                    link = (link_elem.get_text() or '').strip()
                    summary_raw = description_elem.get_text() if description_elem else ''
                    summary = self.clean_text(BeautifulSoup(summary_raw, 'html.parser').get_text()) if summary_raw else ''
                    date = pub_date_elem.get_text() if pub_date_elem else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')

                    image_url = self.extract_image_from_content(link)

                    news_list.append({
                        'title': title,
                        'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                        'url': link,
                        'source': source_name,
                        'date': date,
                        'category': category,
                        'image_url': image_url
                    })
                except Exception as e:
                    logger.warning(f"Erro ao parsear item de {source_name}: {e}")
                    continue

        except Exception as e:
            logger.error(f"Erro ao coletar RSS genérico {source_name}: {e}")
        return news_list

    def cleanup_old_supabase_records(self, max_age_hours: int = 24) -> None:
        """Remove registros antigos (> max_age_hours) da tabela news_articles no Supabase."""
        try:
            if not self.supabase:
                logger.warning("Supabase não configurado; pulando limpeza.")
                return

            cutoff = datetime.utcnow() - timedelta(hours=max_age_hours)
            cutoff_iso = cutoff.isoformat() + 'Z'

            # Prioriza remoção por created_at (timestamptz gerenciado pelo banco)
            logger.info(f"Limpando registros com created_at < {cutoff_iso}")
            result = self.supabase.table('news_articles').delete().lt('created_at', cutoff_iso).execute()
            # Alguns registros antigos podem não ter created_at consistente; como fallback, tente por date quando for formato ISO
            try:
                _ = self.supabase.table('news_articles').delete().lt('date', cutoff_iso).execute()
            except Exception:
                # Se a coluna 'date' não for compatível com comparação temporal, ignore silenciosamente
                pass

            logger.info("✅ Limpeza concluída no Supabase (registros >24h removidos)")
        except Exception as e:
            logger.error(f"Erro ao limpar registros antigos no Supabase: {e}")

    def filter_content_for_reconciliation(self, news_list: List[Dict]) -> List[Dict]:
        """Filter news content to align with Reconciliation brotherhood values"""
        
        # Keywords that align with reformed theology and reconciliation ministry
        positive_keywords = [
            'reconciliação', 'reconciliation', 'graça', 'grace', 'doutrina', 'doctrine',
            'teologia', 'theology', 'reforma', 'reformed', 'calvinismo', 'calvinist',
            'soberania', 'sovereignty', 'predestinação', 'predestination', 'eleição', 'election',
            'santificação', 'sanctification', 'justificação', 'justification', 'regeneração',
            'igreja', 'church', 'irmandade', 'brotherhood', 'comunhão', 'fellowship',
            'dons espirituais', 'spiritual gifts', 'edificação', 'edification', 'unidade', 'unity',
            'paz', 'peace', 'perdão', 'forgiveness', 'restauração', 'restoration',
            'perseguição', 'persecution', 'missões', 'missions', 'evangelização', 'evangelism',
            'bíblia', 'bible', 'escrituras', 'scripture', 'palavra de deus', 'word of god',
            'oração', 'prayer', 'jejum', 'fasting', 'adoração', 'worship',
            'israel', 'jerusalem', 'jerusalém', 'profecia', 'prophecy', 'escatologia', 'eschatology',
            'oriente médio', 'middle east', 'sionismo', 'zionism', 'judeus', 'jews',
            'arqueologia', 'archaeology', 'história antiga', 'ancient history', 'egito', 'egypt',
            'mesopotâmia', 'mesopotamia', 'israel antigo', 'ancient israel', 'jericó', 'jericho',
            'jerusalém antiga', 'ancient jerusalem', 'mar morto', 'dead sea', 'qumran', 'caverna', 'cave',
            'manuscritos do mar morto', 'dead sea scrolls', 'tabernáculo', 'templo', 'arqueólogos', 'archaeologists',
            'escavação', 'excavation', 'achados', 'finds', 'descoberta', 'discovery', 'civilizações', 'civilizations'
            # Novos temas solicitados
            'período interbíblico', 'intertestamental', 'patrística', 'pais da igreja',
            'escavações bíblicas', 'idade média', 'história da igreja',
            'debates teológicos', 'controvérsias teológicas',
            'arminianismo',
            'fariseus', 'saduceus', 'essênios', 'zelotes',
            'usos e costumes da bíblia', 'costumes bíblicos', 'cultura bíblica', 'cultura judaica'
        ]
        
        # Keywords to avoid (prosperity gospel, extreme charismatic, liberal theology)
        negative_keywords = [
            'prosperidade', 'prosperity', 'determinação', 'confissão positiva',
            'teologia liberal', 'liberal theology', 'universalismo', 'universalism',
            'barganhar com deus', 'bargain with god', 'milagres financeiros',
            'unção do riso', 'holy laughter', 'cair no espírito', 'slain in spirit',
            'profetadas', 'prophetic words', 'revelações extras', 'extra revelations'
        ]
        
        # Whitelist de domínios confiáveis
        trusted_domains = [
            'gospelprime.com.br', 'guiame.com.br', 'portasabertas.org.br',
            'cafetorah.com', 'folhagospel.com', 'cpadnews.com.br', 'cpad.com.br',
            'bbc.com', 'bbc.co.uk', 'bbc.com.br', 'cnnbrasil.com.br',
            'nationalgeographic.com', 'nationalgeographicbrasil.com', 'abril.com.br',
            'uol.com.br', 'terra.com.br'
        ]
        
        filtered_news = []
        
        for article in news_list:
            title_lower = article['title'].lower()
            summary_lower = article['summary'].lower()
            content = f"{title_lower} {summary_lower}"
            
            # Check for positive keywords
            has_positive = any(keyword.lower() in content for keyword in positive_keywords)
            
            # Check for negative keywords
            has_negative = any(keyword.lower() in content for keyword in negative_keywords)
            
            # Fonte confiável por nome
            trusted_sources = ['Voltemos ao Evangelho', 'Monergismo', 'Portas Abertas', 
                              'Portas Abertas - Cristãos Perseguidos', 'Cafetorah - Notícias de Israel',
                              'Folha Gospel']
            
            # Verificar domínio do link
            domain = ''
            try:
                domain = urlparse(article.get('url', '')).netloc.lower()
            except Exception:
                domain = ''
            domain_is_trusted = any(domain.endswith(d) for d in trusted_domains if d)
            
            # Regras de aprovação:
            # - possui palavras positivas e não possui negativas
            # - OU é de fonte confiável por nome
            # - OU é de domínio confiável
            # - Para Google News (Temas): permitir se (has_positive OU domínio confiável) e não negativo
            is_google_news = str(article.get('source', '')).startswith('Google News - ')
            if is_google_news:
                if (has_positive or domain_is_trusted) and not has_negative:
                    filtered_news.append(article)
                    logger.info(f"✅ Approved (Google News) article: {article['title'][:50]}...")
                else:
                    logger.info(f"❌ Filtered out (Google News) article: {article['title'][:50]}...")
                continue
            
            if (has_positive and not has_negative) or (article['source'] in trusted_sources) or domain_is_trusted:
                filtered_news.append(article)
                logger.info(f"✅ Approved article: {article['title'][:50]}...")
            else:
                logger.info(f"❌ Filtered out article: {article['title'][:50]}...")
        
        return filtered_news

    def clean_text(self, text: str) -> str:
        """Clean and normalize text content"""
        if not text:
            return ""
        
        # Remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', text.strip())
        # Remove special characters that might cause issues
        text = re.sub(r'[^\w\s\-.,!?;:()\[\]"\'áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]', '', text)
        return text

    def extract_image_from_content(self, url: str) -> Optional[str]:
        """Extract the main image from article content"""
        try:
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Try different selectors for images
                image_selectors = [
                    'meta[property="og:image"]',
                    'meta[name="twitter:image"]',
                    '.post-thumbnail img',
                    '.featured-image img',
                    'article img',
                    '.content img',
                    '.entry-content img'
                ]
                
                for selector in image_selectors:
                    if selector.startswith('meta'):
                        meta_tag = soup.select_one(selector)
                        if meta_tag and meta_tag.get('content'):
                            img_url = meta_tag.get('content')
                            if img_url.startswith('http'):
                                return img_url
                            elif img_url.startswith('/'):
                                return urljoin(url, img_url)
                    else:
                        img_tag = soup.select_one(selector)
                        if img_tag and img_tag.get('src'):
                            img_url = img_tag.get('src')
                            if img_url.startswith('http'):
                                return img_url
                            elif img_url.startswith('/'):
                                return urljoin(url, img_url)
                                
        except Exception as e:
            logger.warning(f"Error extracting image from {url}: {e}")
            
        return None

    def scrape_gospel_prime(self) -> List[Dict]:
        """Scrape news from Gospel Prime"""
        news_list = []
        try:
            # Try RSS first
            response = self.session.get(self.sources['gospel_prime']['rss'], timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'xml')
                items = soup.find_all('item')[:10]  # Get latest 10 items
                
                for item in items:
                    try:
                        title = self.clean_text(item.title.text if item.title else "")
                        description = self.clean_text(item.description.text if item.description else "")
                        link = item.link.text if item.link else ""
                        pub_date = item.pubDate.text if item.pubDate else ""
                        
                        if title and link:
                            # Extract image from article
                            image_url = self.extract_image_from_content(link)
                            
                            news_list.append({
                                'title': title,
                                'summary': description[:200] + "..." if len(description) > 200 else description,
                                'url': link,
                                'source': 'Gospel Prime',
                                'date': pub_date,
                                'category': 'Notícias Cristãs',
                                'image_url': image_url
                            })
                    except Exception as e:
                        logger.warning(f"Error parsing Gospel Prime item: {e}")
                        continue
                        
        except Exception as e:
            logger.error(f"Error scraping Gospel Prime: {e}")
            
        return news_list

    def scrape_ipb_eventos(self) -> List[Dict]:
        """Scrape IPB - Igreja Presbiteriana do Brasil eventos"""
        news_list = []
        try:
            query = "IPB Igreja Presbiteriana Brasil eventos teológicos"
            url = f"https://news.google.com/rss/search?q={query}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'xml')
            items = soup.find_all('item')[:5]
            
            for item in items:
                try:
                    title = self.clean_text(item.title.text) if item.title else "Sem título"
                    link = item.link.text if item.link else ""
                    description = self.clean_text(item.description.text) if item.description else ""
                    pub_date = item.pubDate.text if item.pubDate else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
                    
                    if title and link:
                        news_list.append({
                            'title': title,
                            'summary': description[:200] + "..." if len(description) > 200 else description,
                            'url': link,
                            'source': 'IPB Eventos',
                            'date': pub_date,
                            'category': 'Eventos Teológicos',
                            'image_url': None
                        })
                        
                except Exception as e:
                    logger.error(f"Error parsing IPB eventos article: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping IPB eventos: {e}")
            
        return news_list

    def scrape_luis_sayao(self) -> List[Dict]:
        """Scrape notícias sobre Luís Sayão"""
        news_list = []
        try:
            query = "Luís Sayão teólogo pastor pregador"
            url = f"https://news.google.com/rss/search?q={query}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'xml')
            items = soup.find_all('item')[:3]
            
            for item in items:
                try:
                    title = self.clean_text(item.title.text) if item.title else "Sem título"
                    link = item.link.text if item.link else ""
                    description = self.clean_text(item.description.text) if item.description else ""
                    pub_date = item.pubDate.text if item.pubDate else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
                    
                    if title and link:
                        news_list.append({
                            'title': title,
                            'summary': description[:200] + "..." if len(description) > 200 else description,
                            'url': link,
                            'source': 'Luís Sayão',
                            'date': pub_date,
                            'category': 'Teólogos',
                            'image_url': None
                        })
                        
                except Exception as e:
                    logger.error(f"Error parsing Luís Sayão article: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Luís Sayão: {e}")
            
        return news_list

    def scrape_hernandes_dias_lopes(self) -> List[Dict]:
        """Scrape notícias sobre Hernandes Dias Lopes"""
        news_list = []
        try:
            query = "Hernandes Dias Lopes pastor pregador teólogo"
            url = f"https://news.google.com/rss/search?q={query}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'xml')
            items = soup.find_all('item')[:3]
            
            for item in items:
                try:
                    title = self.clean_text(item.title.text) if item.title else "Sem título"
                    link = item.link.text if item.link else ""
                    description = self.clean_text(item.description.text) if item.description else ""
                    pub_date = item.pubDate.text if item.pubDate else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
                    
                    if title and link:
                        news_list.append({
                            'title': title,
                            'summary': description[:200] + "..." if len(description) > 200 else description,
                            'url': link,
                            'source': 'Hernandes Dias Lopes',
                            'date': pub_date,
                            'category': 'Teólogos',
                            'image_url': None
                        })
                        
                except Exception as e:
                    logger.error(f"Error parsing Hernandes Dias Lopes article: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Hernandes Dias Lopes: {e}")
            
        return news_list

    def scrape_augustus_nicodemus(self) -> List[Dict]:
        """Scrape notícias sobre Augustus Nicodemus"""
        news_list = []
        try:
            query = "Augustus Nicodemus pastor teólogo reformado"
            url = f"https://news.google.com/rss/search?q={query}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'xml')
            items = soup.find_all('item')[:3]
            
            for item in items:
                try:
                    title = self.clean_text(item.title.text) if item.title else "Sem título"
                    link = item.link.text if item.link else ""
                    description = self.clean_text(item.description.text) if item.description else ""
                    pub_date = item.pubDate.text if item.pubDate else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
                    
                    if title and link:
                        news_list.append({
                            'title': title,
                            'summary': description[:200] + "..." if len(description) > 200 else description,
                            'url': link,
                            'source': 'Augustus Nicodemus',
                            'date': pub_date,
                            'category': 'Teólogos',
                            'image_url': None
                        })
                        
                except Exception as e:
                    logger.error(f"Error parsing Augustus Nicodemus article: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Augustus Nicodemus: {e}")
            
        return news_list

    def scrape_guiame(self) -> List[Dict]:
        """Scrape news from Guiame"""
        news_list = []
        try:
            # Try RSS first
            response = self.session.get(self.sources['guiame']['rss'], timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'xml')
                items = soup.find_all('item')[:8]  # Get latest 8 items
                
                for item in items:
                    try:
                        title = self.clean_text(item.title.text if item.title else "")
                        description = self.clean_text(item.description.text if item.description else "")
                        link = item.link.text if item.link else ""
                        pub_date = item.pubDate.text if item.pubDate else ""
                        
                        if title and link:
                            # Extract image from article
                            image_url = self.extract_image_from_content(link)
                            
                            news_list.append({
                                'title': title,
                                'summary': description[:200] + "..." if len(description) > 200 else description,
                                'url': link,
                                'source': 'Guiame',
                                'date': pub_date,
                                'category': 'Gospel',
                                'image_url': image_url
                            })
                    except Exception as e:
                        logger.warning(f"Error parsing Guiame item: {e}")
                        continue
                        
        except Exception as e:
            logger.error(f"Error scraping Guiame: {e}")
            
        return news_list

    def scrape_portas_abertas(self) -> List[Dict]:
        """Scrape news from Portas Abertas"""
        news_list = []
        try:
            # Scrape main news page
            response = self.session.get(f"{self.sources['portas_abertas']['url']}/noticias", timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Look for news articles (this might need adjustment based on actual site structure)
                articles = soup.find_all(['article', 'div'], class_=re.compile(r'(news|article|post)', re.I))[:6]
                
                for article in articles:
                    try:
                        title_elem = article.find(['h1', 'h2', 'h3', 'h4'], class_=re.compile(r'(title|headline)', re.I))
                        if not title_elem:
                            title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                        
                        link_elem = article.find('a', href=True)
                        summary_elem = article.find(['p', 'div'], class_=re.compile(r'(summary|excerpt|description)', re.I))
                        
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = urljoin(self.sources['portas_abertas']['url'], link_elem['href'])
                            summary = self.clean_text(summary_elem.get_text() if summary_elem else "")
                            
                            if title and 'portas' in link.lower():
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + "..." if len(summary) > 200 else summary,
                                    'url': link,
                                    'source': 'Portas Abertas',
                                    'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                                    'category': 'Perseguição Religiosa'
                                })
                    except Exception as e:
                        logger.warning(f"Error parsing Portas Abertas item: {e}")
                        continue
                        
        except Exception as e:
            logger.error(f"Error scraping Portas Abertas: {e}")
            
        return news_list

    def scrape_portas_abertas_perseguidos(self) -> List[Dict]:
        """Scrape news from Portas Abertas - Cristãos Perseguidos"""
        news_list = []
        try:
            url = self.sources['portas_abertas_perseguidos']['url']
            response = self.session.get(url, timeout=15)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Look for news articles in the persecution section
                articles = soup.find_all(['article', 'div'], class_=re.compile(r'(post|article|news|item)', re.I))[:8]
                
                for article in articles:
                    try:
                        # Find title
                        title_elem = article.find(['h1', 'h2', 'h3', 'h4', 'a'])
                        if not title_elem:
                            continue
                            
                        # Find link
                        link_elem = article.find('a', href=True)
                        if not link_elem and title_elem.name == 'a':
                            link_elem = title_elem
                        
                        # Find summary/excerpt
                        summary_elem = article.find(['p', 'div'], class_=re.compile(r'(excerpt|summary|description|content)', re.I))
                        
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = urljoin('https://portasabertas.org.br', link_elem['href'])
                            summary = self.clean_text(summary_elem.get_text() if summary_elem else "")
                            
                            # Extract image
                            image_url = self.extract_image_from_content(link)
                            
                            if title and len(title) > 10:
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + "..." if len(summary) > 200 else summary,
                                    'url': link,
                                    'source': 'Portas Abertas - Cristãos Perseguidos',
                                    'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                                    'category': 'Perseguição Religiosa',
                                    'image_url': image_url
                                })
                    except Exception as e:
                        logger.warning(f"Error parsing Portas Abertas Perseguidos item: {e}")
                        continue
                        
        except Exception as e:
            logger.error(f"Error scraping Portas Abertas Perseguidos: {e}")
            
        return news_list

    def scrape_cafetorah_israel(self) -> List[Dict]:
        """Scrape news from Cafetorah - Notícias de Israel"""
        news_list = []
        try:
            url = self.sources['cafetorah_israel']['url']
            response = self.session.get(url, timeout=15)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Look for news articles about Israel
                articles = soup.find_all(['article', 'div'], class_=re.compile(r'(post|article|news|entry)', re.I))[:8]
                
                for article in articles:
                    try:
                        # Find title
                        title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                        if not title_elem:
                            title_elem = article.find('a', class_=re.compile(r'(title|headline)', re.I))
                            
                        # Find link
                        link_elem = article.find('a', href=True)
                        
                        # Find summary/excerpt
                        summary_elem = article.find(['p', 'div'], class_=re.compile(r'(excerpt|summary|description|content)', re.I))
                        if not summary_elem:
                            # Try to get first paragraph
                            summary_elem = article.find('p')
                        
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = urljoin('https://cafetorah.com', link_elem['href'])
                            summary = self.clean_text(summary_elem.get_text() if summary_elem else "")
                            
                            # Extract image
                            image_url = self.extract_image_from_content(link)
                            
                            if title and len(title) > 10:
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + "..." if len(summary) > 200 else summary,
                                    'url': link,
                                    'source': 'Cafetorah - Notícias de Israel',
                                    'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                                    'category': 'Israel e Oriente Médio',
                                    'image_url': image_url
                                })
                    except Exception as e:
                        logger.warning(f"Error parsing Cafetorah Israel item: {e}")
                        continue
                        
        except Exception as e:
            logger.error(f"Error scraping Cafetorah Israel: {e}")
            
        return news_list

    def scrape_folha_gospel(self) -> List[Dict]:
        """Scrape news from Folha Gospel using RSS feed"""
        news_list = []
        try:
            # Use RSS feed for more reliable scraping
            rss_url = 'https://folhagospel.com/feed/'
            response = self.session.get(rss_url, timeout=15)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'xml')
                items = soup.find_all('item')[:8]  # Get up to 8 articles
                
                for item in items:
                    try:
                        title_elem = item.find('title')
                        link_elem = item.find('link')
                        description_elem = item.find('description')
                        pub_date_elem = item.find('pubDate')
                        
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = link_elem.get_text().strip()
                            
                            # Get description/summary
                            summary = ""
                            if description_elem:
                                # Clean HTML from description
                                desc_soup = BeautifulSoup(description_elem.get_text(), 'html.parser')
                                summary = self.clean_text(desc_soup.get_text())
                            
                            # Get publication date or use current
                            date = pub_date_elem.get_text() if pub_date_elem else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
                            
                            # Extract image
                            image_url = self.extract_image_from_content(link)
                            
                            if title and len(title) > 10:
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + "..." if len(summary) > 200 else summary,
                                    'url': link,
                                    'source': 'Folha Gospel',
                                    'date': date,
                                    'category': 'Notícias Cristãs',
                                    'image_url': image_url
                                })
                                
                    except Exception as e:
                        logger.warning(f"Error parsing Folha Gospel RSS item: {e}")
                        continue
            else:
                logger.warning(f"Failed to access Folha Gospel RSS feed. Status: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Error scraping Folha Gospel: {e}")
            
        return news_list

    def scrape_radio93(self) -> List[Dict]:
        """Scrape news from Radio 93 - Giro Cristão using RSS feed"""
        news_list = []
        try:
            # Use RSS feed for reliable scraping
            rss_url = 'https://radio93.com.br/categoria/giro-cristao/feed/'
            
            # Headers to avoid 403 errors
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml',
                'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            }
            
            response = requests.get(rss_url, headers=headers, timeout=15)
            
            if response.status_code == 200:
                # Parse XML using xml parser for RSS
                soup = BeautifulSoup(response.content, 'xml')
                items = soup.find_all('item')[:8]  # Get up to 8 articles
                
                for item in items:
                    try:
                        title_elem = item.find('title')
                        link_elem = item.find('link')
                        description_elem = item.find('description')
                        pub_date_elem = item.find('pubDate')
                        
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = link_elem.get_text().strip()
                            
                            # Get description/summary
                            summary = ""
                            if description_elem:
                                # Clean HTML from description
                                desc_soup = BeautifulSoup(description_elem.get_text(), 'html.parser')
                                summary = self.clean_text(desc_soup.get_text())
                            
                            # Get publication date or use current
                            date = pub_date_elem.get_text() if pub_date_elem else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
                            
                            # Extract image from enclosure or content
                            image_url = ""
                            enclosure = item.find('enclosure')
                            if enclosure and enclosure.get('url'):
                                image_url = enclosure.get('url')
                            else:
                                # Try to extract from content
                                content_elem = item.find('content:encoded') or item.find('encoded')
                                if content_elem:
                                    content_soup = BeautifulSoup(content_elem.get_text(), 'html.parser')
                                    img_tag = content_soup.find('img')
                                    if img_tag and img_tag.get('src'):
                                        image_url = img_tag.get('src')
                            
                            if title and len(title) > 10:
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + "..." if len(summary) > 200 else summary,
                                    'url': link,
                                    'source': 'Radio 93 - Giro Cristão',
                                    'date': date,
                                    'category': 'Notícias Cristãs',
                                    'image_url': image_url
                                })
                                
                    except Exception as e:
                        logger.warning(f"Error parsing Radio 93 RSS item: {e}")
                        continue
            else:
                logger.warning(f"Failed to access Radio 93 RSS feed. Status: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Error scraping Radio 93: {e}")
            
        return news_list

    def scrape_cpad_news(self) -> List[Dict]:
        """Scrape news from CPAD News"""
        news_list = []
        try:
            # Scrape main news page
            response = self.session.get(f"{self.sources['cpad_news']['url']}/noticias", timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Look for news articles
                articles = soup.find_all(['article', 'div'], class_=re.compile(r'(news|article|post)', re.I))[:5]
                
                for article in articles:
                    try:
                        title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                        link_elem = article.find('a', href=True)
                        summary_elem = article.find(['p', 'div'], class_=re.compile(r'(summary|excerpt)', re.I))
                        
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = urljoin(self.sources['cpad_news']['url'], link_elem['href'])
                            summary = self.clean_text(summary_elem.get_text() if summary_elem else "")
                            
                            if title:
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + "..." if len(summary) > 200 else summary,
                                    'url': link,
                                    'source': 'CPAD News',
                                    'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                                    'category': 'Educação Cristã'
                                })
                    except Exception as e:
                        logger.warning(f"Error parsing CPAD News item: {e}")
                        continue
                        
        except Exception as e:
            logger.error(f"Error scraping CPAD News: {e}")
            
        return news_list

    def scrape_bbc_portuguese(self) -> List[Dict]:
        """Scrape notícias gerais da BBC News Brasil"""
        news_list = []
        try:
            url = self.sources['bbc_portuguese']['url']
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                # Tenta diferentes padrões de blocos de promoção/stream usados pela BBC
                articles = soup.find_all(['article', 'div'], class_=re.compile(r'(Promo|promo|article|lx-stream|gs-c-promo)', re.I))[:8]
                for article in articles:
                    try:
                        title_elem = article.find(['h3', 'h2', 'a'], class_=re.compile(r'(promo-heading|gs-c-promo-heading|lx-stream-post)', re.I)) or article.find(['h3', 'h2'])
                        link_elem = article.find('a', href=True)
                        summary_elem = article.find(['p', 'div'], class_=re.compile(r'(summary|promo-summary|gs-c-promo-summary|lx-stream-post-body)', re.I))
                        if not link_elem and title_elem and title_elem.name == 'a':
                            link_elem = title_elem
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = urljoin(url, link_elem['href'])
                            summary = self.clean_text(summary_elem.get_text() if summary_elem else '')
                            image_url = self.extract_image_from_content(link)
                            if title and len(title) > 10:
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                                    'url': link,
                                    'source': 'BBC News Brasil',
                                    'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                                    'category': 'Arqueologia e História',
                                    'image_url': image_url
                                })
                    except Exception as e:
                        logger.warning(f"Error parsing BBC Portuguese item: {e}")
                        continue
        except Exception as e:
            logger.error(f"Error scraping BBC Portuguese: {e}")
        return news_list

    def scrape_bbc_arqueologia(self) -> List[Dict]:
        """Scrape notícias da BBC no tópico de Arqueologia"""
        news_list = []
        try:
            url = self.sources['bbc_arqueologia']['url']
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all(['article', 'div'], class_=re.compile(r'(Promo|promo|article|lx-stream|gs-c-promo)', re.I))[:8]
                for article in articles:
                    try:
                        title_elem = article.find(['h3', 'h2', 'a'], class_=re.compile(r'(promo-heading|gs-c-promo-heading|lx-stream-post)', re.I)) or article.find(['h3', 'h2'])
                        link_elem = article.find('a', href=True)
                        summary_elem = article.find(['p', 'div'], class_=re.compile(r'(summary|promo-summary|gs-c-promo-summary|lx-stream-post-body)', re.I))
                        if not link_elem and title_elem and title_elem.name == 'a':
                            link_elem = title_elem
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = urljoin(url, link_elem['href'])
                            summary = self.clean_text(summary_elem.get_text() if summary_elem else '')
                            image_url = self.extract_image_from_content(link)
                            if title and len(title) > 10:
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                                    'url': link,
                                    'source': 'BBC News Brasil - Arqueologia',
                                    'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                                    'category': 'Arqueologia e História',
                                    'image_url': image_url
                                })
                    except Exception as e:
                        logger.warning(f"Error parsing BBC Arqueologia item: {e}")
                        continue
        except Exception as e:
            logger.error(f"Error scraping BBC Arqueologia: {e}")
        return news_list

    def scrape_galileu_arqueologia(self) -> List[Dict]:
        """Scrape notícias de Arqueologia da Revista Galileu"""
        news_list = []
        try:
            url = self.sources['galileu_arqueologia']['url']
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all(['article', 'div'], class_=re.compile(r'(post|article|materia|card)', re.I))[:8]
                for article in articles:
                    try:
                        title_elem = article.find(['h3', 'h2', 'a'])
                        link_elem = article.find('a', href=True)
                        summary_elem = article.find(['p', 'div'], class_=re.compile(r'(summary|excerpt|description|deck)', re.I))
                        if not link_elem and title_elem and title_elem.name == 'a':
                            link_elem = title_elem
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = urljoin(url, link_elem['href'])
                            summary = self.clean_text(summary_elem.get_text() if summary_elem else '')
                            image_url = self.extract_image_from_content(link)
                            if title and len(title) > 10:
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                                    'url': link,
                                    'source': 'Revista Galileu - Arqueologia',
                                    'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                                    'category': 'Arqueologia e História',
                                    'image_url': image_url
                                })
                    except Exception as e:
                        logger.warning(f"Error parsing Galileu Arqueologia item: {e}")
                        continue
        except Exception as e:
            logger.error(f"Error scraping Galileu Arqueologia: {e}")
        return news_list

    def scrape_cnnbrasil_arqueologia(self) -> List[Dict]:
        """Scrape notícias de Arqueologia da CNN Brasil"""
        news_list = []
        try:
            url = self.sources['cnnbrasil_arqueologia']['url']
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all(['article', 'div'], class_=re.compile(r'(post|article|card|tags-list|news)', re.I))[:8]
                for article in articles:
                    try:
                        title_elem = article.find(['h3', 'h2', 'a'])
                        link_elem = article.find('a', href=True)
                        summary_elem = article.find(['p', 'div'], class_=re.compile(r'(summary|excerpt|description)', re.I))
                        if not link_elem and title_elem and title_elem.name == 'a':
                            link_elem = title_elem
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = urljoin(url, link_elem['href'])
                            summary = self.clean_text(summary_elem.get_text() if summary_elem else '')
                            image_url = self.extract_image_from_content(link)
                            if title and len(title) > 10:
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                                    'url': link,
                                    'source': 'CNN Brasil - Arqueologia',
                                    'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                                    'category': 'Arqueologia e História',
                                    'image_url': image_url
                                })
                    except Exception as e:
                        logger.warning(f"Error parsing CNN Brasil Arqueologia item: {e}")
                        continue
        except Exception as e:
            logger.error(f"Error scraping CNN Brasil Arqueologia: {e}")
        return news_list

    def scrape_galileu_daily(self) -> List[Dict]:
        """Scrape notícias diárias da Revista Galileu (todas as categorias)"""
        news_list = []
        try:
            # URL principal da Revista Galileu
            url = "https://revistagalileu.globo.com/"
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Buscar artigos nas seções principais
                articles = soup.find_all(['article', 'div'], class_=re.compile(r'(post|article|materia|card|feed-post)', re.I))[:10]
                
                for article in articles:
                    try:
                        # Buscar título
                        title_elem = article.find(['h1', 'h2', 'h3', 'a'], class_=re.compile(r'(title|headline|manchete)', re.I))
                        if not title_elem:
                            title_elem = article.find(['h1', 'h2', 'h3'])
                        if not title_elem:
                            title_elem = article.find('a', href=True)
                        
                        # Buscar link
                        link_elem = article.find('a', href=True)
                        if not link_elem and title_elem and title_elem.name == 'a':
                            link_elem = title_elem
                        
                        # Buscar resumo/descrição
                        summary_elem = article.find(['p', 'div'], class_=re.compile(r'(summary|excerpt|description|deck|subtitle)', re.I))
                        
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = urljoin(url, link_elem['href'])
                            summary = self.clean_text(summary_elem.get_text() if summary_elem else '')
                            
                            # Extrair imagem
                            image_url = None
                            img_elem = article.find('img')
                            if img_elem and img_elem.get('src'):
                                image_url = urljoin(url, img_elem['src'])
                            
                            # Determinar categoria baseada no conteúdo
                            category = 'Ciência e Tecnologia'
                            title_lower = title.lower()
                            if any(word in title_lower for word in ['arqueologia', 'história', 'antigo', 'descoberta']):
                                category = 'Arqueologia e História'
                            elif any(word in title_lower for word in ['espaço', 'astronomia', 'planeta', 'universo']):
                                category = 'Astronomia'
                            elif any(word in title_lower for word in ['saúde', 'medicina', 'doença', 'tratamento']):
                                category = 'Saúde e Medicina'
                            elif any(word in title_lower for word in ['meio ambiente', 'clima', 'sustentabilidade', 'natureza']):
                                category = 'Meio Ambiente'
                            
                            if title and len(title) > 10 and 'galileu' not in title.lower():
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + '...' if len(summary) > 200 else summary or title[:200] + '...',
                                    'url': link,
                                    'source': 'Revista Galileu',
                                    'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                                    'category': category,
                                    'image_url': image_url
                                })
                    except Exception as e:
                        logger.warning(f"Error parsing Galileu daily item: {e}")
                        continue
                        
        except Exception as e:
            logger.error(f"Error scraping Galileu daily: {e}")
            
        return news_list

    def scrape_nationalgeo_br_arqueologia(self) -> List[Dict]:
        """Scrape notícias de Arqueologia da National Geographic Brasil"""
        news_list = []
        try:
            url = self.sources['nationalgeo_br_arqueologia']['url']
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all(['article', 'div'], class_=re.compile(r'(post|article|card|listing|item)', re.I))[:8]
                for article in articles:
                    try:
                        title_elem = article.find(['h3', 'h2', 'a'])
                        link_elem = article.find('a', href=True)
                        summary_elem = article.find(['p', 'div'], class_=re.compile(r'(summary|excerpt|description)', re.I))
                        if not link_elem and title_elem and title_elem.name == 'a':
                            link_elem = title_elem
                        if title_elem and link_elem:
                            title = self.clean_text(title_elem.get_text())
                            link = urljoin(url, link_elem['href'])
                            summary = self.clean_text(summary_elem.get_text() if summary_elem else '')
                            image_url = self.extract_image_from_content(link)
                            if title and len(title) > 10:
                                news_list.append({
                                    'title': title,
                                    'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                                    'url': link,
                                    'source': 'National Geographic Brasil - Arqueologia',
                                    'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                                    'category': 'Arqueologia e História',
                                    'image_url': image_url
                                })
                    except Exception as e:
                        logger.warning(f"Error parsing National Geographic Brasil Arqueologia item: {e}")
                        continue
        except Exception as e:
            logger.error(f"Error scraping National Geographic Brasil Arqueologia: {e}")
        return news_list

    def scrape_google_news(self) -> List[Dict]:
        """Scrape Google News RSS para temas específicos (pt-BR)"""
        news_list = []
        try:
            base = "https://news.google.com/rss/search"
            queries = self.sources.get('google_news', {}).get('queries', [])
            for qconf in queries:
                label = qconf.get('label', '')
                query = qconf.get('q', '')
                category = qconf.get('category', 'Notícias')
                if not query:
                    continue
                url = f"{base}?q={quote(query)}&hl=pt-BR&gl=BR&ceid=BR:pt"
                response = self.session.get(url, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'xml')
                    items = soup.find_all('item')[:6]
                    for item in items:
                        try:
                            title = self.clean_text(item.title.text if item.title else '')
                            link_raw = item.link.text if item.link else ''
                            # Extrair URL original quando possível (news.google.com com parâmetro url=)
                            link = link_raw
                            try:
                                parsed = urlparse(link_raw)
                                qs = parse_qs(parsed.query)
                                if 'url' in qs and len(qs['url']) > 0:
                                    link = unquote(qs['url'][0])
                            except Exception:
                                link = link_raw
                            description = self.clean_text(item.description.text if item.description else '')
                            pub_date = item.pubDate.text if item.pubDate else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
                            if title and link:
                                image_url = self.extract_image_from_content(link)
                                news_list.append({
                                    'title': title,
                                    'summary': description[:200] + '...' if len(description) > 200 else description,
                                    'url': link,
                                    'source': f"Google News - {label}" if label else 'Google News',
                                    'date': pub_date,
                                    'category': category,
                                    'image_url': image_url
                                })
                        except Exception as e:
                            logger.warning(f"Error parsing Google News item for '{label}': {e}")
                            continue
        except Exception as e:
            logger.error(f"Error scraping Google News: {e}")
        return news_list

    def scrape_noticias_israel(self) -> List[Dict]:
        """Scrape news from Notícias de Israel"""
        news_list = []
        try:
            url = 'https://noticiasdeisrael.com.br/'
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Procurar por artigos
            articles = soup.find_all(['article', 'div'], class_=lambda x: x and any(
                keyword in x.lower() for keyword in ['post', 'article', 'entry', 'news']
            ))[:10]
            
            for article in articles:
                try:
                    # Título
                    title_elem = article.find(['h1', 'h2', 'h3', 'h4'], class_=lambda x: x and any(
                        keyword in x.lower() for keyword in ['title', 'headline', 'entry-title']
                    ))
                    if not title_elem:
                        title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                    
                    if not title_elem:
                        continue
                        
                    title = self.clean_text(title_elem.get_text())
                    if not title or len(title) < 10:
                        continue
                    
                    # Link
                    link_elem = title_elem.find('a') or article.find('a')
                    if not link_elem:
                        continue
                    link = urljoin(url, link_elem.get('href', ''))
                    
                    # Resumo
                    summary_elem = article.find(['p', 'div'], class_=lambda x: x and any(
                        keyword in x.lower() for keyword in ['excerpt', 'summary', 'content']
                    ))
                    if not summary_elem:
                        summary_elem = article.find('p')
                    
                    summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:100] + '...'
                    
                    # Imagem
                    image_url = self.extract_image_from_content(link)
                    if not image_url:
                        img_elem = article.find('img')
                        if img_elem and img_elem.get('src'):
                            image_url = urljoin(url, img_elem.get('src'))
                    
                    news_list.append({
                        'title': title,
                        'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                        'url': link,
                        'source': 'Notícias de Israel',
                        'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                        'category': 'Israel e Oriente Médio',
                        'image_url': image_url
                    })
                except Exception as e:
                    logger.warning(f"Error parsing Notícias de Israel item: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Notícias de Israel: {e}")
            
        return news_list

    def scrape_pulpito_cristao(self) -> List[Dict]:
        """Scrape news from Púlpito Cristão"""
        news_list = []
        try:
            url = 'https://www.pulpitocristao.com/'
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Procurar por artigos
            articles = soup.find_all(['article', 'div'], class_=lambda x: x and any(
                keyword in x.lower() for keyword in ['post', 'article', 'entry', 'news']
            ))[:10]
            
            for article in articles:
                try:
                    # Título
                    title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                    if not title_elem:
                        continue
                        
                    title = self.clean_text(title_elem.get_text())
                    if not title or len(title) < 10:
                        continue
                    
                    # Link
                    link_elem = title_elem.find('a') or article.find('a')
                    if not link_elem:
                        continue
                    link = urljoin(url, link_elem.get('href', ''))
                    
                    # Resumo
                    summary_elem = article.find('p')
                    summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:100] + '...'
                    
                    # Imagem
                    image_url = self.extract_image_from_content(link)
                    if not image_url:
                        img_elem = article.find('img')
                        if img_elem and img_elem.get('src'):
                            image_url = urljoin(url, img_elem.get('src'))
                    
                    news_list.append({
                        'title': title,
                        'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                        'url': link,
                        'source': 'Púlpito Cristão',
                        'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                        'category': 'Pregação e Ensino',
                        'image_url': image_url
                    })
                except Exception as e:
                    logger.warning(f"Error parsing Púlpito Cristão item: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Púlpito Cristão: {e}")
            
        return news_list

    def scrape_voltemos_evangelho(self) -> List[Dict]:
        """Scrape news from Voltemos ao Evangelho"""
        news_list = []
        try:
            url = 'https://voltemosaoevangelho.com/'
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Procurar por artigos
            articles = soup.find_all(['article', 'div'], class_=lambda x: x and any(
                keyword in x.lower() for keyword in ['post', 'article', 'entry']
            ))[:10]
            
            for article in articles:
                try:
                    # Título
                    title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                    if not title_elem:
                        continue
                        
                    title = self.clean_text(title_elem.get_text())
                    if not title or len(title) < 10:
                        continue
                    
                    # Link
                    link_elem = title_elem.find('a') or article.find('a')
                    if not link_elem:
                        continue
                    link = urljoin(url, link_elem.get('href', ''))
                    
                    # Resumo
                    summary_elem = article.find('p')
                    summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:100] + '...'
                    
                    # Imagem
                    image_url = self.extract_image_from_content(link)
                    if not image_url:
                        img_elem = article.find('img')
                        if img_elem and img_elem.get('src'):
                            image_url = urljoin(url, img_elem.get('src'))
                    
                    news_list.append({
                        'title': title,
                        'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                        'url': link,
                        'source': 'Voltemos ao Evangelho',
                        'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                        'category': 'Teologia Reformada',
                        'image_url': image_url
                    })
                except Exception as e:
                    logger.warning(f"Error parsing Voltemos ao Evangelho item: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Voltemos ao Evangelho: {e}")
            
        return news_list

    def scrape_ministerio_fiel(self) -> List[Dict]:
        """Scrape news from Ministério Fiel"""
        news_list = []
        try:
            url = 'https://ministeriofiel.com.br/'
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Procurar por artigos
            articles = soup.find_all(['article', 'div'], class_=lambda x: x and any(
                keyword in x.lower() for keyword in ['post', 'article', 'entry']
            ))[:10]
            
            for article in articles:
                try:
                    # Título
                    title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                    if not title_elem:
                        continue
                        
                    title = self.clean_text(title_elem.get_text())
                    if not title or len(title) < 10:
                        continue
                    
                    # Link
                    link_elem = title_elem.find('a') or article.find('a')
                    if not link_elem:
                        continue
                    link = urljoin(url, link_elem.get('href', ''))
                    
                    # Resumo
                    summary_elem = article.find('p')
                    summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:100] + '...'
                    
                    # Imagem
                    image_url = self.extract_image_from_content(link)
                    if not image_url:
                        img_elem = article.find('img')
                        if img_elem and img_elem.get('src'):
                            image_url = urljoin(url, img_elem.get('src'))
                    
                    news_list.append({
                        'title': title,
                        'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                        'url': link,
                        'source': 'Ministério Fiel',
                        'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                        'category': 'Teologia e Ensino',
                        'image_url': image_url
                    })
                except Exception as e:
                    logger.warning(f"Error parsing Ministério Fiel item: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Ministério Fiel: {e}")
            
        return news_list

    def scrape_biblical_archaeology(self) -> List[Dict]:
        """Scrape news from Biblical Archaeology Society"""
        news_list = []
        try:
            url = 'https://www.biblicalarchaeology.org/news/'
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Procurar por artigos
            articles = soup.find_all(['article', 'div'], class_=lambda x: x and any(
                keyword in x.lower() for keyword in ['post', 'article', 'entry']
            ))[:10]
            
            for article in articles:
                try:
                    # Título
                    title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                    if not title_elem:
                        continue
                        
                    title = self.clean_text(title_elem.get_text())
                    if not title or len(title) < 10:
                        continue
                    
                    # Link
                    link_elem = title_elem.find('a') or article.find('a')
                    if not link_elem:
                        continue
                    link = urljoin(url, link_elem.get('href', ''))
                    
                    # Resumo
                    summary_elem = article.find('p')
                    summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:100] + '...'
                    
                    # Imagem
                    image_url = self.extract_image_from_content(link)
                    if not image_url:
                        img_elem = article.find('img')
                        if img_elem and img_elem.get('src'):
                            image_url = urljoin(url, img_elem.get('src'))
                    
                    news_list.append({
                        'title': title,
                        'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                        'url': link,
                        'source': 'Biblical Archaeology Society',
                        'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                        'category': 'Arqueologia Bíblica',
                        'image_url': image_url
                    })
                except Exception as e:
                    logger.warning(f"Error parsing Biblical Archaeology item: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Biblical Archaeology Society: {e}")
            
        return news_list

    def scrape_teologia_brasileira(self) -> List[Dict]:
        """Scrape news from Teologia Brasileira"""
        news_list = []
        try:
            url = 'https://teologiabrasileira.com.br/noticias/'
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Procurar por artigos
            articles = soup.find_all(['article', 'div'], class_=lambda x: x and any(
                keyword in x.lower() for keyword in ['post', 'article', 'entry']
            ))[:10]
            
            for article in articles:
                try:
                    # Título
                    title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                    if not title_elem:
                        continue
                        
                    title = self.clean_text(title_elem.get_text())
                    if not title or len(title) < 10:
                        continue
                    
                    # Link
                    link_elem = title_elem.find('a') or article.find('a')
                    if not link_elem:
                        continue
                    link = urljoin(url, link_elem.get('href', ''))
                    
                    # Resumo
                    summary_elem = article.find('p')
                    summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:100] + '...'
                    
                    # Imagem
                    image_url = self.extract_image_from_content(link)
                    if not image_url:
                        img_elem = article.find('img')
                        if img_elem and img_elem.get('src'):
                            image_url = urljoin(url, img_elem.get('src'))
                    
                    news_list.append({
                        'title': title,
                        'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                        'url': link,
                        'source': 'Teologia Brasileira',
                        'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                        'category': 'Teologia e Doutrina',
                        'image_url': image_url
                    })
                except Exception as e:
                    logger.warning(f"Error parsing Teologia Brasileira item: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Teologia Brasileira: {e}")
            
        return news_list

    def scrape_monergismo(self) -> List[Dict]:
        """Scrape Monergismo - Teologia Reformada"""
        news_list = []
        try:
            url = "https://www.monergismo.com/"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find articles
            articles = soup.find_all(['article', 'div'], class_=['post', 'entry', 'article'])[:5]
            
            for article in articles:
                try:
                    title_elem = article.find(['h1', 'h2', 'h3', 'h4'], class_=['title', 'entry-title', 'post-title'])
                    if not title_elem:
                        title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                    
                    link_elem = title_elem.find('a') if title_elem else None
                    if not link_elem:
                        link_elem = article.find('a')
                    
                    if title_elem and link_elem:
                        title = self.clean_text(title_elem.get_text())
                        link = urljoin(url, link_elem.get('href'))
                        
                        # Extract summary
                        summary_elem = article.find(['p', 'div'], class_=['excerpt', 'summary', 'description'])
                        if not summary_elem:
                            summary_elem = article.find('p')
                        summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:200] + "..."
                        
                        # Extract image
                        img_elem = article.find('img')
                        image_url = urljoin(url, img_elem.get('src')) if img_elem else None
                        
                        news_list.append({
                            'title': title,
                            'summary': summary,
                            'url': link,
                            'source': 'Monergismo',
                            'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                            'category': 'Teologia Reformada',
                            'image_url': image_url
                        })
                        
                except Exception as e:
                    logger.error(f"Error parsing Monergismo article: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Monergismo: {e}")
            
        return news_list

    def scrape_ipb_nacional(self) -> List[Dict]:
        """Scrape IPB Nacional - Igreja Presbiteriana do Brasil"""
        news_list = []
        try:
            url = "https://ipb.org.br/"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find news articles
            articles = soup.find_all(['article', 'div'], class_=['post', 'news', 'noticia'])[:5]
            
            for article in articles:
                try:
                    title_elem = article.find(['h1', 'h2', 'h3'], class_=['title', 'post-title', 'news-title'])
                    if not title_elem:
                        title_elem = article.find(['h1', 'h2', 'h3'])
                    
                    link_elem = title_elem.find('a') if title_elem else None
                    if not link_elem:
                        link_elem = article.find('a')
                    
                    if title_elem and link_elem:
                        title = self.clean_text(title_elem.get_text())
                        link = urljoin(url, link_elem.get('href'))
                        
                        # Extract summary
                        summary_elem = article.find(['p', 'div'], class_=['excerpt', 'summary'])
                        if not summary_elem:
                            summary_elem = article.find('p')
                        summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:200] + "..."
                        
                        # Extract image
                        img_elem = article.find('img')
                        image_url = urljoin(url, img_elem.get('src')) if img_elem else None
                        
                        news_list.append({
                            'title': title,
                            'summary': summary,
                            'url': link,
                            'source': 'IPB Nacional',
                            'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                            'category': 'Igreja Presbiteriana',
                            'image_url': image_url
                        })
                        
                except Exception as e:
                    logger.error(f"Error parsing IPB Nacional article: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping IPB Nacional: {e}")
            
        return news_list

    def scrape_instituto_mackenzie(self) -> List[Dict]:
        """Scrape Instituto Mackenzie - Teologia"""
        news_list = []
        try:
            url = "https://www.mackenzie.br/noticias/"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find news articles
            articles = soup.find_all(['article', 'div'], class_=['noticia', 'news-item', 'post'])[:5]
            
            for article in articles:
                try:
                    title_elem = article.find(['h1', 'h2', 'h3'], class_=['title', 'titulo'])
                    if not title_elem:
                        title_elem = article.find(['h1', 'h2', 'h3'])
                    
                    link_elem = title_elem.find('a') if title_elem else None
                    if not link_elem:
                        link_elem = article.find('a')
                    
                    if title_elem and link_elem:
                        title = self.clean_text(title_elem.get_text())
                        link = urljoin(url, link_elem.get('href'))
                        
                        # Extract summary
                        summary_elem = article.find(['p', 'div'], class_=['resumo', 'excerpt'])
                        if not summary_elem:
                            summary_elem = article.find('p')
                        summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:200] + "..."
                        
                        # Extract image
                        img_elem = article.find('img')
                        image_url = urljoin(url, img_elem.get('src')) if img_elem else None
                        
                        news_list.append({
                            'title': title,
                            'summary': summary,
                            'url': link,
                            'source': 'Instituto Mackenzie',
                            'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                            'category': 'Educação Teológica',
                            'image_url': image_url
                        })
                        
                except Exception as e:
                    logger.error(f"Error parsing Instituto Mackenzie article: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Instituto Mackenzie: {e}")
            
        return news_list

    def scrape_bereianos(self) -> List[Dict]:
        """Scrape Bereianos - Apologética Cristã"""
        news_list = []
        try:
            url = "https://bereianos.blogspot.com/"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find blog posts
            articles = soup.find_all(['article', 'div'], class_=['post', 'blog-post'])[:5]
            
            for article in articles:
                try:
                    title_elem = article.find(['h1', 'h2', 'h3'], class_=['post-title', 'entry-title'])
                    if not title_elem:
                        title_elem = article.find(['h1', 'h2', 'h3'])
                    
                    link_elem = title_elem.find('a') if title_elem else None
                    if not link_elem:
                        link_elem = article.find('a')
                    
                    if title_elem and link_elem:
                        title = self.clean_text(title_elem.get_text())
                        link = link_elem.get('href')
                        
                        # Extract summary
                        summary_elem = article.find(['div', 'p'], class_=['post-body', 'entry-content'])
                        if not summary_elem:
                            summary_elem = article.find('p')
                        summary = self.clean_text(summary_elem.get_text()[:300]) if summary_elem else title[:200] + "..."
                        
                        # Extract image
                        img_elem = article.find('img')
                        image_url = img_elem.get('src') if img_elem else None
                        
                        news_list.append({
                            'title': title,
                            'summary': summary,
                            'url': link,
                            'source': 'Bereianos',
                            'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                            'category': 'Apologética',
                            'image_url': image_url
                        })
                        
                except Exception as e:
                    logger.error(f"Error parsing Bereianos article: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Bereianos: {e}")
            
        return news_list

    def scrape_cinco_solas(self) -> List[Dict]:
        """Scrape Cinco Solas - Teologia Reformada"""
        news_list = []
        try:
            url = "https://www.cincosolas.com.br/"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find articles
            articles = soup.find_all(['article', 'div'], class_=['post', 'entry'])[:5]
            
            for article in articles:
                try:
                    title_elem = article.find(['h1', 'h2', 'h3'], class_=['title', 'entry-title'])
                    if not title_elem:
                        title_elem = article.find(['h1', 'h2', 'h3'])
                    
                    link_elem = title_elem.find('a') if title_elem else None
                    if not link_elem:
                        link_elem = article.find('a')
                    
                    if title_elem and link_elem:
                        title = self.clean_text(title_elem.get_text())
                        link = urljoin(url, link_elem.get('href'))
                        
                        # Extract summary
                        summary_elem = article.find(['p', 'div'], class_=['excerpt', 'summary'])
                        if not summary_elem:
                            summary_elem = article.find('p')
                        summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:200] + "..."
                        
                        # Extract image
                        img_elem = article.find('img')
                        image_url = urljoin(url, img_elem.get('src')) if img_elem else None
                        
                        news_list.append({
                            'title': title,
                            'summary': summary,
                            'url': link,
                            'source': 'Cinco Solas',
                            'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                            'category': 'Teologia Reformada',
                            'image_url': image_url
                        })
                        
                except Exception as e:
                    logger.error(f"Error parsing Cinco Solas article: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Cinco Solas: {e}")
            
        return news_list

    def scrape_patristica(self) -> List[Dict]:
        """Scrape conteúdo sobre Patrística"""
        news_list = []
        try:
            # Usando Google News para buscar conteúdo sobre patrística
            query = "patrística+teologia+pais+da+igreja"
            url = f"https://news.google.com/rss/search?q={query}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
            
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'xml')
            items = soup.find_all('item')[:3]
            
            for item in items:
                try:
                    title = self.clean_text(item.title.text) if item.title else "Sem título"
                    link = item.link.text if item.link else ""
                    description = self.clean_text(item.description.text) if item.description else title[:200] + "..."
                    pub_date = item.pubDate.text if item.pubDate else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
                    
                    news_list.append({
                        'title': title,
                        'summary': description,
                        'url': link,
                        'source': 'Patrística News',
                        'date': pub_date,
                        'category': 'Patrística',
                        'image_url': None
                    })
                    
                except Exception as e:
                    logger.error(f"Error parsing Patrística item: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Patrística: {e}")
            
        return news_list

    def scrape_arqueologia_biblica_br(self) -> List[Dict]:
        """Scrape conteúdo sobre Arqueologia Bíblica em português"""
        news_list = []
        try:
            # Usando Google News para buscar conteúdo sobre arqueologia bíblica
            query = "arqueologia+bíblica+descobertas+israel+jerusalém"
            url = f"https://news.google.com/rss/search?q={query}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
            
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'xml')
            items = soup.find_all('item')[:5]
            
            for item in items:
                try:
                    title = self.clean_text(item.title.text) if item.title else "Sem título"
                    link = item.link.text if item.link else ""
                    description = self.clean_text(item.description.text) if item.description else title[:200] + "..."
                    pub_date = item.pubDate.text if item.pubDate else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
                    
                    news_list.append({
                        'title': title,
                        'summary': description,
                        'url': link,
                        'source': 'Arqueologia Bíblica BR',
                        'date': pub_date,
                        'category': 'Arqueologia Bíblica',
                        'image_url': None
                    })
                    
                except Exception as e:
                    logger.error(f"Error parsing Arqueologia Bíblica item: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Arqueologia Bíblica: {e}")
            
        return news_list

    def scrape_calvinismo_arminianismo(self) -> List[Dict]:
        """Scrape conteúdo sobre Calvinismo e Arminianismo"""
        news_list = []
        try:
            # Usando Google News para buscar conteúdo sobre calvinismo e arminianismo
            query = "calvinismo+arminianismo+predestinação+livre+arbítrio+teologia"
            url = f"https://news.google.com/rss/search?q={query}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
            
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'xml')
            items = soup.find_all('item')[:3]
            
            for item in items:
                try:
                    title = self.clean_text(item.title.text) if item.title else "Sem título"
                    link = item.link.text if item.link else ""
                    description = self.clean_text(item.description.text) if item.description else title[:200] + "..."
                    pub_date = item.pubDate.text if item.pubDate else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
                    
                    # Determine category based on content
                    category = 'Calvinismo' if 'calvin' in title.lower() or 'predestina' in title.lower() else 'Arminianismo'
                    
                    news_list.append({
                        'title': title,
                        'summary': description,
                        'url': link,
                        'source': 'Teologia Sistemática',
                        'date': pub_date,
                        'category': category,
                        'image_url': None
                    })
                    
                except Exception as e:
                    logger.error(f"Error parsing Calvinismo/Arminianismo item: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Calvinismo/Arminianismo: {e}")
            
        return news_list

    def scrape_editora_fiel(self) -> List[Dict]:
        """Scrape Editora Fiel - Livros e recursos teológicos reformados"""
        news_list = []
        try:
            url = "https://www.editorafiel.com.br/blog/"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find articles
            articles = soup.find_all(['article', 'div'], class_=['post', 'entry', 'blog-post'])[:5]
            
            for article in articles:
                try:
                    title_elem = article.find(['h1', 'h2', 'h3'], class_=['title', 'entry-title', 'post-title'])
                    if not title_elem:
                        title_elem = article.find(['h1', 'h2', 'h3'])
                    
                    link_elem = title_elem.find('a') if title_elem else None
                    if not link_elem:
                        link_elem = article.find('a')
                    
                    if title_elem and link_elem:
                        title = self.clean_text(title_elem.get_text())
                        link = urljoin(url, link_elem.get('href'))
                        
                        # Extract summary
                        summary_elem = article.find(['p', 'div'], class_=['excerpt', 'summary', 'description'])
                        if not summary_elem:
                            summary_elem = article.find('p')
                        summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:200] + "..."
                        
                        # Extract image
                        img_elem = article.find('img')
                        image_url = urljoin(url, img_elem.get('src')) if img_elem else None
                        
                        news_list.append({
                            'title': title,
                            'summary': summary,
                            'url': link,
                            'source': 'Editora Fiel',
                            'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                            'category': 'Livros Teológicos',
                            'image_url': image_url
                        })
                        
                except Exception as e:
                    logger.error(f"Error parsing Editora Fiel article: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping Editora Fiel: {e}")
            
        return news_list

    def scrape_cpad_editora(self) -> List[Dict]:
        """Scrape CPAD - Casa Publicadora das Assembleias de Deus"""
        news_list = []
        try:
            url = "https://www.cpad.com.br/noticias/"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find articles
            articles = soup.find_all(['article', 'div'], class_=['post', 'entry', 'news-item'])[:5]
            
            for article in articles:
                try:
                    title_elem = article.find(['h1', 'h2', 'h3'], class_=['title', 'entry-title', 'post-title'])
                    if not title_elem:
                        title_elem = article.find(['h1', 'h2', 'h3'])
                    
                    link_elem = title_elem.find('a') if title_elem else None
                    if not link_elem:
                        link_elem = article.find('a')
                    
                    if title_elem and link_elem:
                        title = self.clean_text(title_elem.get_text())
                        link = urljoin(url, link_elem.get('href'))
                        
                        # Extract summary
                        summary_elem = article.find(['p', 'div'], class_=['excerpt', 'summary', 'description'])
                        if not summary_elem:
                            summary_elem = article.find('p')
                        summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:200] + "..."
                        
                        # Extract image
                        img_elem = article.find('img')
                        image_url = urljoin(url, img_elem.get('src')) if img_elem else None
                        
                        news_list.append({
                            'title': title,
                            'summary': summary,
                            'url': link,
                            'source': 'CPAD',
                            'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                            'category': 'Editora Cristã',
                            'image_url': image_url
                        })
                        
                except Exception as e:
                    logger.error(f"Error parsing CPAD article: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping CPAD: {e}")
            
        return news_list

    def scrape_livros_teologicos(self) -> List[Dict]:
        """Scrape conteúdo sobre livros teológicos recomendados"""
        news_list = []
        try:
            # Usando Google News para buscar conteúdo sobre livros teológicos
            query = "livros+teológicos+reformados+recomendações"
            url = f"https://news.google.com/rss/search?q={query}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
            
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'xml')
            items = soup.find_all('item')[:3]
            
            for item in items:
                try:
                    title = self.clean_text(item.title.text) if item.title else "Sem título"
                    link = item.link.text if item.link else ""
                    
                    # Extract description/summary
                    description = item.description.text if item.description else title[:200] + "..."
                    summary = self.clean_text(description)
                    
                    # Extract publication date
                    pub_date = item.pubDate.text if item.pubDate else datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
                    
                    news_list.append({
                        'title': title,
                        'summary': summary,
                        'url': link,
                        'source': 'Livros Teológicos',
                        'date': pub_date,
                        'category': 'Literatura Teológica',
                        'image_url': None
                    })
                    
                except Exception as e:
                    logger.error(f"Error parsing theological books item: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping theological books: {e}")
            
        return news_list

    def get_fallback_news(self) -> List[Dict]:
        """Provide high-quality fallback news aligned with reformed theology and Reconciliation brotherhood"""
        return [
            {
                'title': 'A Importância da Doutrina da Graça na Vida Cristã',
                'summary': 'Reflexão sobre como a compreensão bíblica da graça soberana de Deus transforma nossa vida de fé e nossa relação com o próximo na irmandade cristã.',
                'url': 'https://voltemosaoevangelho.com/doutrina-graca-vida-crista/',
                'source': 'Voltemos ao Evangelho',
                'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                'category': 'Teologia Reformada'
            },
            {
                'title': 'Perseguição aos Cristãos: Como Orar pela Igreja Perseguida',
                'summary': 'Orientações bíblicas sobre como a igreja local pode interceder pelos irmãos que sofrem perseguição ao redor do mundo, fortalecendo os laços da irmandade cristã.',
                'url': 'https://www.portasabertas.org.br/oracao-igreja-perseguida/',
                'source': 'Portas Abertas',
                'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                'category': 'Igreja Perseguida'
            },
            {
                'title': 'Os Dons Espirituais na Igreja Reformada: Ordem e Edificação',
                'summary': 'Estudo sobre como os dons espirituais devem ser exercidos com ordem e para edificação da igreja, mantendo o equilíbrio bíblico entre espiritualidade e reverência.',
                'url': 'https://www.monergismo.com/dons-espirituais-ordem-edificacao/',
                'source': 'Monergismo',
                'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                'category': 'Dons Espirituais'
            },
            {
                'title': 'Reconciliação: O Ministério da Igreja no Mundo',
                'summary': 'Como a igreja deve exercer o ministério da reconciliação, promovendo a paz e a unidade entre os irmãos e sendo instrumento de Deus para a restauração.',
                'url': 'https://cristianismohoje.com.br/ministerio-reconciliacao/',
                'source': 'Cristianismo Hoje',
                'date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                'category': 'Ministério da Reconciliação'
            }
        ]

    def scrape_all_sources(self) -> List[Dict]:
        """Scrape news from all configured sources"""
        all_news = []
        
        logger.info("Starting news scraping from all sources...")
        
        # Allowlist de fontes: pode ser configurado por env NEWS_SOURCES_ALLOWLIST
        # Exemplo: NEWS_SOURCES_ALLOWLIST="Gospel Prime,Guiame,Portas Abertas,Folha Gospel"
        allowlist_env = os.getenv('NEWS_SOURCES_ALLOWLIST', '').strip()
        if allowlist_env:
            allowed_sources = {s.strip() for s in allowlist_env.split(',') if s.strip()}
        else:
            # Padrão: todas as fontes cristãs solicitadas pelo usuário
            allowed_sources = {
                'Gospel Prime',
                'Guiame',
                'Portas Abertas',
                'Portas Abertas - Cristãos Perseguidos',
                'Cafetorah - Notícias de Israel',
                'Folha Gospel',
                'Radio 93 - Giro Cristão',
                'CPAD News',
                'Notícias de Israel',
                'Púlpito Cristão',
                'Voltemos ao Evangelho',
                'Ministério Fiel',
                'Biblical Archaeology Society',
                'Teologia Brasileira',
                'Monergismo',
                'IPB Nacional',
                'Instituto Mackenzie',
                'Bereianos',
                'Cinco Solas',
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
            }

        logger.info(f"Allowed sources: {sorted(list(allowed_sources))}")
        
        # Todas as fontes disponíveis no scraper
        scrapers_all = [
            ('Gospel Prime', self.scrape_gospel_prime),
            ('Guiame', self.scrape_guiame),
            ('Portas Abertas', self.scrape_portas_abertas),
            ('Portas Abertas - Cristãos Perseguidos', self.scrape_portas_abertas_perseguidos),
            ('Cafetorah - Notícias de Israel', self.scrape_cafetorah_israel),
            ('Folha Gospel', self.scrape_folha_gospel),
            ('Radio 93 - Giro Cristão', self.scrape_radio93),
            ('CPAD News', self.scrape_cpad_news),
            ('Notícias de Israel', self.scrape_noticias_israel),
            ('Púlpito Cristão', self.scrape_pulpito_cristao),
            ('Voltemos ao Evangelho', self.scrape_voltemos_evangelho),
            ('Ministério Fiel', self.scrape_ministerio_fiel),
            ('Biblical Archaeology Society', self.scrape_biblical_archaeology),
            ('Teologia Brasileira', self.scrape_teologia_brasileira),
            ('Monergismo', self.scrape_monergismo),
            ('IPB Nacional', self.scrape_ipb_nacional),
            ('Instituto Mackenzie', self.scrape_instituto_mackenzie),
            ('Bereianos', self.scrape_bereianos),
            ('Cinco Solas', self.scrape_cinco_solas),
            ('Patrística News', self.scrape_patristica),
            ('Arqueologia Bíblica BR', self.scrape_arqueologia_biblica_br),
            ('Teologia Sistemática', self.scrape_calvinismo_arminianismo),
            ('Editora Fiel', self.scrape_editora_fiel),
            ('CPAD Editora', self.scrape_cpad_editora),
            ('Livros Teológicos', self.scrape_livros_teologicos),
            ('IPB Eventos', self.scrape_ipb_eventos),
            ('Luís Sayão', self.scrape_luis_sayao),
            ('Hernandes Dias Lopes', self.scrape_hernandes_dias_lopes),
            ('Augustus Nicodemus', self.scrape_augustus_nicodemus),
            ('BBC News Brasil', self.scrape_bbc_portuguese),
            ('BBC News Brasil - Arqueologia', self.scrape_bbc_arqueologia),
            ('Revista Galileu - Arqueologia', self.scrape_galileu_arqueologia),
            ('Revista Galileu', self.scrape_galileu_daily),
            ('CNN Brasil - Arqueologia', self.scrape_cnnbrasil_arqueologia),
            ('National Geographic Brasil - Arqueologia', self.scrape_nationalgeo_br_arqueologia),
            ('Google News (Temas)', self.scrape_google_news)
        ]

        # Filtra para rodar apenas as fontes permitidas
        scrapers = [(name, fn) for (name, fn) in scrapers_all if name in allowed_sources]
        
        for source_name, scraper_func in scrapers:
            try:
                logger.info(f"Scraping {source_name}...")
                news = scraper_func()
                all_news.extend(news)
                logger.info(f"Found {len(news)} articles from {source_name}")
                time.sleep(2)  # Be respectful to servers
            except Exception as e:
                logger.error(f"Failed to scrape {source_name}: {e}")

        # RSS extras (genéricos) para ampliar cobertura de fontes gratuitas
        extra_rss_feeds = [
            ('Folha Gospel', 'https://folhagospel.com/feed/', 'Notícias Cristãs', 8),
            ('Gospel Prime', 'https://www.gospelprime.com.br/feed/', 'Gospel', 10),
            ('Guiame', 'https://www.guiame.com.br/rss.xml', 'Gospel', 8),
            ('Voltemos ao Evangelho', 'https://voltemosaoevangelho.com/blog/feed/', 'Teologia Reformada', 8),
            ('Ministério Fiel', 'https://ministeriofiel.com.br/feed/', 'Teologia Reformada', 8),
            ('CPAD News', 'https://www.cpadnews.com.br/feed/', 'Educação Cristã', 6)
        ]

        for name, url, category, limit in extra_rss_feeds:
            if name in allowed_sources:
                try:
                    logger.info(f"Scraping RSS genérico: {name}")
                    items = self.scrape_generic_rss(name, url, category=category, limit=limit)
                    all_news.extend(items)
                except Exception as e:
                    logger.warning(f"Falha no RSS genérico {name}: {e}")
        
        # If we don't have enough news, add fallback content
        if len(all_news) < 5:
            logger.info("Adding fallback news due to insufficient scraped content")
            all_news.extend(self.get_fallback_news())
        
        # Remover duplicatas (título + URL) e limitar resultados
        seen_titles = set()
        seen_pairs = set()
        unique_news = []
        for news in all_news:
            title = (news.get('title') or '').strip()
            url = (news.get('url') or '').strip()
            key = (title.lower(), url)
            if title and key not in seen_pairs:
                seen_pairs.add(key)
                seen_titles.add(title)
                unique_news.append(news)
        
        # Sort by date (most recent first) and limit to 25 items
        unique_news = unique_news[:25]
        
        # Apply content filter for Reconciliation brotherhood
        logger.info("Applying content filter for Reconciliation brotherhood...")
        filtered_news = self.filter_content_for_reconciliation(unique_news)

        # Apply 24-hour staleness filter server-side
        recent_filtered_news = self.filter_recent_articles(filtered_news, max_age_hours=24)
        
        # If filtered recent news is too few, add some fallback content
        if len(recent_filtered_news) < 3:
            logger.info("Adding fallback news due to insufficient recent filtered content")
            fallback_news = self.get_fallback_news()
            # Fallback items have current datetime, still run through recent filter for consistency
            recent_filtered_news.extend(self.filter_recent_articles(fallback_news, max_age_hours=24))
            # Remove duplicates again
            seen_titles = set()
            final_news = []
            for news in recent_filtered_news:
                if news['title'] not in seen_titles:
                    seen_titles.add(news['title'])
                    final_news.append(news)
            recent_filtered_news = final_news
        
        logger.info(f"Final filtered articles for Reconciliation: {len(recent_filtered_news)}")
        return recent_filtered_news

    def save_news_to_json(self, news_data: List[Dict], filename: str = 'christian_news.json'):
        """Save news data to JSON file and Supabase"""
        try:
            # Save to Supabase first
            if self.supabase:
                # Only save recent articles to Supabase
                recent_news = self.filter_recent_articles(news_data, max_age_hours=24)
                self.save_to_supabase(recent_news)
            
            # Create data directory if it doesn't exist (src)
            data_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
            os.makedirs(data_dir, exist_ok=True)
            
            filepath = os.path.join(data_dir, filename)
            
            # Add metadata
            output_data = {
                'last_updated': datetime.now().isoformat(),
                'total_articles': len(news_data),
                'sources': list(set([article['source'] for article in news_data])),
                'articles': self.filter_recent_articles(news_data, max_age_hours=24)
            }
            
            # Write to src/data
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, ensure_ascii=False, indent=2)
            logger.info(f"News data saved to {filepath}")
            
            # Also write to public/data for frontend to fetch in production
            public_data_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
            os.makedirs(public_data_dir, exist_ok=True)
            public_filepath = os.path.join(public_data_dir, filename)
            with open(public_filepath, 'w', encoding='utf-8') as pf:
                json.dump(output_data, pf, ensure_ascii=False, indent=2)
            logger.info(f"News data saved to {public_filepath}")
            
            return filepath
            
        except Exception as e:
            logger.error(f"Error saving news data: {e}")
            return None

    def save_to_supabase(self, news_data: List[Dict]):
        """Save news data to Supabase database"""
        try:
            logger.info("Saving news to Supabase...")
            
            # Clear existing data (optional - you might want to keep history)
            # self.supabase.table('news_articles').delete().neq('id', 0).execute()
            
            # Prepare data for Supabase
            supabase_data = []
            for article in news_data:
                # Skip stale articles (>24h)
                if not self.is_recent_article(article, max_age_hours=24):
                    continue
                # Check if article already exists
                existing = self.supabase.table('news_articles').select('id').eq('url', article['url']).execute()
                
                if not existing.data:  # Only insert if doesn't exist
                    supabase_article = {
                        'title': article['title'],
                        'summary': article['summary'],
                        'url': article['url'],
                        'source': article['source'],
                        'date': article['date'],
                        'category': article['category'],
                        'image_url': article.get('image_url')
                    }
                    supabase_data.append(supabase_article)
            
            if supabase_data:
                # Insert new articles
                result = self.supabase.table('news_articles').insert(supabase_data).execute()
                logger.info(f"Successfully saved {len(supabase_data)} new recent articles to Supabase")
            else:
                logger.info("No new recent articles to save to Supabase")
                
        except Exception as e:
            logger.error(f"Error saving to Supabase: {e}")
            # Continue execution even if Supabase fails

def main():
    """Main function to run the news scraper"""
    scraper = ChristianNewsScraper()
    
    # Permite rodar somente limpeza via argumento CLI
    if len(sys.argv) > 1 and sys.argv[1].lower() == 'cleanup':
        try:
            scraper.cleanup_old_supabase_records(max_age_hours=24)
            print("✅ Limpeza executada: removidos registros com mais de 24h")
        except Exception as e:
            logger.error(f"Erro na limpeza: {e}")
            print(f"❌ Erro na limpeza: {e}")
        return

    try:
        # Scrape all news
        news_data = scraper.scrape_all_sources()
        
        if news_data:
            # Save to JSON file
            filepath = scraper.save_news_to_json(news_data)
            
            if filepath:
                print(f"✅ Successfully scraped {len(news_data)} articles")
                print(f"📁 Data saved to: {filepath}")
                
                # Print summary
                sources = {}
                for article in news_data:
                    source = article['source']
                    sources[source] = sources.get(source, 0) + 1
                
                print("\n📊 Articles by source:")
                for source, count in sources.items():
                    print(f"  • {source}: {count} articles")
            else:
                print("❌ Failed to save news data")
        else:
            print("❌ No news data collected")
            
    except Exception as e:
        logger.error(f"Error in main execution: {e}")
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()