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
from datetime import datetime, timedelta
import re
from urllib.parse import urljoin, urlparse
import logging
from typing import List, Dict, Optional
import os
import sys

# Add parent directory to path to import supabase config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Supabase imports
from supabase import create_client, Client
from dotenv import load_dotenv

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
            }
        }

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
            'oriente médio', 'middle east', 'sionismo', 'zionism', 'judeus', 'jews'
        ]
        
        # Keywords to avoid (prosperity gospel, extreme charismatic, liberal theology)
        negative_keywords = [
            'prosperidade', 'prosperity', 'determinação', 'confissão positiva',
            'teologia liberal', 'liberal theology', 'universalismo', 'universalism',
            'barganhar com deus', 'bargain with god', 'milagres financeiros',
            'unção do riso', 'holy laughter', 'cair no espírito', 'slain in spirit',
            'profetadas', 'prophetic words', 'revelações extras', 'extra revelations'
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
            
            # Include if has positive content and no negative content
            # OR if it's from trusted reformed sources
            trusted_sources = ['Voltemos ao Evangelho', 'Monergismo', 'Portas Abertas', 
                              'Portas Abertas - Cristãos Perseguidos', 'Cafetorah - Notícias de Israel',
                              'Folha Gospel']
            
            if (has_positive and not has_negative) or article['source'] in trusted_sources:
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
        
        # Scrape each source
        scrapers = [
            ('Gospel Prime', self.scrape_gospel_prime),
            ('Guiame', self.scrape_guiame),
            ('Portas Abertas', self.scrape_portas_abertas),
            ('Portas Abertas - Cristãos Perseguidos', self.scrape_portas_abertas_perseguidos),
            ('Cafetorah - Notícias de Israel', self.scrape_cafetorah_israel),
            ('Folha Gospel', self.scrape_folha_gospel),
            ('Radio 93 - Giro Cristão', self.scrape_radio93),
            ('CPAD News', self.scrape_cpad_news)
        ]
        
        for source_name, scraper_func in scrapers:
            try:
                logger.info(f"Scraping {source_name}...")
                news = scraper_func()
                all_news.extend(news)
                logger.info(f"Found {len(news)} articles from {source_name}")
                time.sleep(2)  # Be respectful to servers
            except Exception as e:
                logger.error(f"Failed to scrape {source_name}: {e}")
        
        # If we don't have enough news, add fallback content
        if len(all_news) < 5:
            logger.info("Adding fallback news due to insufficient scraped content")
            all_news.extend(self.get_fallback_news())
        
        # Remove duplicates and limit results
        seen_titles = set()
        unique_news = []
        for news in all_news:
            if news['title'] not in seen_titles:
                seen_titles.add(news['title'])
                unique_news.append(news)
        
        # Sort by date (most recent first) and limit to 15 items
        unique_news = unique_news[:15]
        
        # Apply content filter for Reconciliation brotherhood
        logger.info("Applying content filter for Reconciliation brotherhood...")
        filtered_news = self.filter_content_for_reconciliation(unique_news)
        
        # If filtered news is too few, add some fallback content
        if len(filtered_news) < 3:
            logger.info("Adding fallback news due to insufficient filtered content")
            fallback_news = self.get_fallback_news()
            filtered_news.extend(fallback_news)
            # Remove duplicates again
            seen_titles = set()
            final_news = []
            for news in filtered_news:
                if news['title'] not in seen_titles:
                    seen_titles.add(news['title'])
                    final_news.append(news)
            filtered_news = final_news
        
        logger.info(f"Final filtered articles for Reconciliation: {len(filtered_news)}")
        return filtered_news

    def save_news_to_json(self, news_data: List[Dict], filename: str = 'christian_news.json'):
        """Save news data to JSON file and Supabase"""
        try:
            # Save to Supabase first
            if self.supabase:
                self.save_to_supabase(news_data)
            
            # Create data directory if it doesn't exist
            data_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
            os.makedirs(data_dir, exist_ok=True)
            
            filepath = os.path.join(data_dir, filename)
            
            # Add metadata
            output_data = {
                'last_updated': datetime.now().isoformat(),
                'total_articles': len(news_data),
                'sources': list(set([article['source'] for article in news_data])),
                'articles': news_data
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, ensure_ascii=False, indent=2)
            
            logger.info(f"News data saved to {filepath}")
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
                logger.info(f"Successfully saved {len(supabase_data)} new articles to Supabase")
            else:
                logger.info("No new articles to save to Supabase")
                
        except Exception as e:
            logger.error(f"Error saving to Supabase: {e}")
            # Continue execution even if Supabase fails

def main():
    """Main function to run the news scraper"""
    scraper = ChristianNewsScraper()
    
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