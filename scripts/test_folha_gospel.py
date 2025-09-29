import requests
from bs4 import BeautifulSoup
import re

def test_folha_gospel():
    try:
        url = 'https://folhagospel.com/c/fg-news/'
        response = requests.get(url, timeout=15)
        print(f'Status: {response.status_code}')
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Test different selectors
            print("\n=== Testing different selectors ===")
            
            # Try to find articles
            articles = soup.find_all('article')
            print(f'Articles found: {len(articles)}')
            
            # Try to find divs with post-related classes
            post_divs = soup.find_all('div', class_=re.compile(r'(post|article|news|entry|item)', re.I))
            print(f'Post divs found: {len(post_divs)}')
            
            # Try to find any divs with classes
            all_divs = soup.find_all('div', class_=True)
            print(f'All divs with classes: {len(all_divs)}')
            
            # Show some class names
            print("\n=== Sample class names ===")
            for i, div in enumerate(all_divs[:20]):
                classes = div.get('class', [])
                if classes:
                    print(f'{i+1}. {" ".join(classes)}')
            
            # Try to find links
            links = soup.find_all('a', href=True)
            print(f'\nTotal links found: {len(links)}')
            
            # Show some links that might be articles
            print("\n=== Sample article links ===")
            for i, link in enumerate(links[:10]):
                href = link.get('href', '')
                text = link.get_text(strip=True)
                if text and len(text) > 10 and 'folhagospel.com' in href:
                    print(f'{i+1}. {text[:50]}... -> {href}')
                    
        else:
            print(f'Failed to access site. Status: {response.status_code}')
            
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    test_folha_gospel()