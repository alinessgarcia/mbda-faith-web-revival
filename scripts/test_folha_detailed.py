import requests
from bs4 import BeautifulSoup
import re

def test_folha_detailed():
    try:
        # Test the main page first
        url = 'https://folhagospel.com/'
        print(f"Testing main page: {url}")
        response = requests.get(url, timeout=15)
        print(f'Status: {response.status_code}')
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for article links on main page
            links = soup.find_all('a', href=True)
            article_links = []
            
            for link in links:
                href = link.get('href', '')
                text = link.get_text(strip=True)
                
                # Check if it looks like an article
                if (text and len(text) > 15 and 
                    ('folhagospel.com' in href or href.startswith('/')) and
                    not any(skip in href.lower() for skip in ['categoria', 'tag', 'author', 'page', '#', 'wp-content', 'javascript'])):
                    
                    article_links.append({
                        'title': text,
                        'url': href if href.startswith('http') else f"https://folhagospel.com{href}"
                    })
            
            print(f"\nFound {len(article_links)} potential articles on main page:")
            for i, article in enumerate(article_links[:10]):
                print(f"{i+1}. {article['title'][:60]}...")
                print(f"   URL: {article['url']}")
        
        # Now test the specific news category page
        print(f"\n{'='*60}")
        url2 = 'https://folhagospel.com/c/fg-news/'
        print(f"Testing news category: {url2}")
        response2 = requests.get(url2, timeout=15)
        print(f'Status: {response2.status_code}')
        
        if response2.status_code == 200:
            soup2 = BeautifulSoup(response2.content, 'html.parser')
            
            # Look for article links on news page
            links2 = soup2.find_all('a', href=True)
            article_links2 = []
            
            for link in links2:
                href = link.get('href', '')
                text = link.get_text(strip=True)
                
                # Check if it looks like an article
                if (text and len(text) > 15 and 
                    ('folhagospel.com' in href or href.startswith('/')) and
                    not any(skip in href.lower() for skip in ['categoria', 'tag', 'author', 'page', '#', 'wp-content', 'javascript'])):
                    
                    article_links2.append({
                        'title': text,
                        'url': href if href.startswith('http') else f"https://folhagospel.com{href}"
                    })
            
            print(f"\nFound {len(article_links2)} potential articles on news page:")
            for i, article in enumerate(article_links2[:10]):
                print(f"{i+1}. {article['title'][:60]}...")
                print(f"   URL: {article['url']}")
        
        # Test RSS feed if available
        print(f"\n{'='*60}")
        rss_url = 'https://folhagospel.com/feed/'
        print(f"Testing RSS feed: {rss_url}")
        try:
            rss_response = requests.get(rss_url, timeout=15)
            print(f'RSS Status: {rss_response.status_code}')
            if rss_response.status_code == 200:
                print("RSS feed is available!")
                # Parse RSS
                rss_soup = BeautifulSoup(rss_response.content, 'xml')
                items = rss_soup.find_all('item')
                print(f"Found {len(items)} RSS items")
                for i, item in enumerate(items[:5]):
                    title = item.find('title')
                    link = item.find('link')
                    if title and link:
                        print(f"{i+1}. {title.get_text()}")
                        print(f"   URL: {link.get_text()}")
        except Exception as e:
            print(f"RSS test failed: {e}")
            
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    test_folha_detailed()