import requests
import xml.etree.ElementTree as ET
from datetime import datetime

def test_radio93_rss():
    rss_url = "https://radio93.com.br/categoria/giro-cristao/feed/"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml',
    }
    
    try:
        print(f"Testando RSS: {rss_url}")
        response = requests.get(rss_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type')}")
        
        # Parse XML
        root = ET.fromstring(response.content)
        
        # Encontrar todos os itens
        items = root.findall('.//item')
        print(f"Artigos encontrados no RSS: {len(items)}")
        
        print("\n--- Primeiros 5 artigos ---")
        for i, item in enumerate(items[:5]):
            title = item.find('title')
            link = item.find('link')
            description = item.find('description')
            pub_date = item.find('pubDate')
            
            print(f"\n{i+1}. Título: {title.text if title is not None else 'N/A'}")
            print(f"   Link: {link.text if link is not None else 'N/A'}")
            print(f"   Data: {pub_date.text if pub_date is not None else 'N/A'}")
            if description is not None and description.text:
                desc_text = description.text[:200] + "..." if len(description.text) > 200 else description.text
                print(f"   Descrição: {desc_text}")
            
            # Verificar se há imagem
            enclosure = item.find('enclosure')
            if enclosure is not None:
                print(f"   Imagem: {enclosure.get('url', 'N/A')}")
            
            # Verificar outros elementos
            for child in item:
                if child.tag not in ['title', 'link', 'description', 'pubDate', 'enclosure']:
                    print(f"   {child.tag}: {child.text[:100] if child.text else 'N/A'}")
        
    except Exception as e:
        print(f"Erro ao acessar RSS {rss_url}: {e}")

if __name__ == "__main__":
    test_radio93_rss()