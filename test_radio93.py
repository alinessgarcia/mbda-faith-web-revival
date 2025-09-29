import requests
from bs4 import BeautifulSoup
import json

def test_radio93():
    url = "https://radio93.com.br/noticias/giro-cristao/"
    
    # Headers para simular um navegador real
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    try:
        print(f"Testando: {url}")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Analisar estrutura geral
        print(f"Status: {response.status_code}")
        print(f"Título da página: {soup.title.text if soup.title else 'Não encontrado'}")
        
        # Procurar por artigos/posts
        articles = soup.find_all('article')
        print(f"Artigos encontrados: {len(articles)}")
        
        # Procurar por divs com classes relacionadas a posts/notícias
        post_divs = soup.find_all('div', class_=lambda x: x and any(word in x.lower() for word in ['post', 'article', 'news', 'item', 'card']))
        print(f"Divs com classes de post: {len(post_divs)}")
        
        # Procurar por links
        links = soup.find_all('a', href=True)
        print(f"Links encontrados: {len(links)}")
        
        # Analisar primeiros artigos/posts encontrados
        print("\n--- Análise dos primeiros elementos ---")
        
        if articles:
            print("Primeiros 3 artigos:")
            for i, article in enumerate(articles[:3]):
                title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                title = title_elem.text.strip() if title_elem else "Título não encontrado"
                link_elem = article.find('a', href=True)
                link = link_elem['href'] if link_elem else "Link não encontrado"
                print(f"  {i+1}. {title[:100]}...")
                print(f"     Link: {link}")
        
        elif post_divs:
            print("Primeiros 3 divs de post:")
            for i, div in enumerate(post_divs[:3]):
                title_elem = div.find(['h1', 'h2', 'h3', 'h4'])
                title = title_elem.text.strip() if title_elem else "Título não encontrado"
                link_elem = div.find('a', href=True)
                link = link_elem['href'] if link_elem else "Link não encontrado"
                print(f"  {i+1}. {title[:100]}...")
                print(f"     Link: {link}")
        
        # Verificar se há RSS feed
        rss_links = soup.find_all('link', {'type': 'application/rss+xml'})
        if rss_links:
            print(f"\nRSS Feed encontrado: {rss_links[0].get('href')}")
        else:
            # Tentar URLs comuns de RSS
            common_rss_urls = [
                "https://radio93.com.br/feed/",
                "https://radio93.com.br/rss/",
                "https://radio93.com.br/noticias/giro-cristao/feed/"
            ]
            
            for rss_url in common_rss_urls:
                try:
                    rss_response = requests.get(rss_url, headers=headers, timeout=5)
                    if rss_response.status_code == 200 and 'xml' in rss_response.headers.get('content-type', ''):
                        print(f"RSS Feed encontrado em: {rss_url}")
                        break
                except:
                    continue
            else:
                print("Nenhum RSS Feed encontrado")
        
        # Analisar classes mais comuns
        all_classes = []
        for elem in soup.find_all(class_=True):
            if isinstance(elem.get('class'), list):
                all_classes.extend(elem.get('class'))
            else:
                all_classes.append(elem.get('class'))
        
        from collections import Counter
        common_classes = Counter(all_classes).most_common(10)
        print(f"\nClasses mais comuns:")
        for class_name, count in common_classes:
            print(f"  {class_name}: {count}")
            
    except Exception as e:
        print(f"Erro ao acessar {url}: {e}")

if __name__ == "__main__":
    test_radio93()