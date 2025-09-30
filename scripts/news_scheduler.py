#!/usr/bin/env python3
"""
News Scheduler - Automatic News Refresh System
Runs the news scraper at regular intervals to keep content fresh
"""

import os
import sys
import time
import schedule
import subprocess
from datetime import datetime
import json
import logging

# Add the scripts directory to Python path
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(script_dir)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(script_dir, 'news_scheduler.log')),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class NewsScheduler:
    def __init__(self):
        self.script_path = os.path.join(script_dir, 'news_scraper.py')
        self.project_root = os.path.dirname(script_dir)
        self.news_file = os.path.join(self.project_root, 'src', 'data', 'christian_news.json')
        
    def run_news_scraper(self):
        """Run the news scraper script"""
        try:
            logger.info("🔄 Starting scheduled news refresh...")
            
            # Run the news scraper
            result = subprocess.run([
                sys.executable, self.script_path
            ], capture_output=True, text=True, cwd=script_dir)
            
            if result.returncode == 0:
                logger.info("✅ News scraper completed successfully")
                
                # Check if news file was updated
                if os.path.exists(self.news_file):
                    with open(self.news_file, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        article_count = data.get('total_articles', 0)
                        sources = data.get('sources', [])
                        logger.info(f"📰 Updated with {article_count} articles from {len(sources)} sources")
                else:
                    logger.warning("⚠️ News file not found after scraping")
                    
            else:
                logger.error(f"❌ News scraper failed with return code {result.returncode}")
                logger.error(f"Error output: {result.stderr}")
                
        except Exception as e:
            logger.error(f"❌ Error running news scraper: {e}")
    
    def check_news_freshness(self):
        """Check if news data is fresh enough"""
        try:
            if not os.path.exists(self.news_file):
                logger.info("📰 No news file found, running initial scrape...")
                self.run_news_scraper()
                return
                
            # Check file modification time
            file_time = os.path.getmtime(self.news_file)
            current_time = time.time()
            age_hours = (current_time - file_time) / 3600
            
            logger.info(f"📊 News data is {age_hours:.1f} hours old")
            
            # If data is older than 2 hours, refresh it
            if age_hours > 1:
                logger.info("🔄 News data is stale, refreshing...")
                self.run_news_scraper()
            else:
                logger.info("✅ News data is fresh")
                
        except Exception as e:
            logger.error(f"❌ Error checking news freshness: {e}")
    
    def start_scheduler(self):
        """Start the news refresh scheduler"""
        logger.info("📅 Schedule: Every 1 hour")
        
        # Run initial check
        self.check_news_freshness()
        
        # Schedule regular updates every 1 hour
        schedule.every().hour.do(self.run_news_scraper)
        
        # Also schedule a daily check at 6 AM and 6 PM
        schedule.every().day.at("06:00").do(self.run_news_scraper)
        schedule.every().day.at("18:00").do(self.run_news_scraper)
        
        logger.info("⏰ Scheduler started. Press Ctrl+C to stop.")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
                
        except KeyboardInterrupt:
            logger.info("🛑 Scheduler stopped by user")
        except Exception as e:
            logger.error(f"❌ Scheduler error: {e}")

def main():
    """Main function"""
    scheduler = NewsScheduler()
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == 'run':
            # Run scraper once
            scheduler.run_news_scraper()
        elif command == 'check':
            # Check freshness
            scheduler.check_news_freshness()
        elif command == 'start':
            # Start scheduler
            scheduler.start_scheduler()
        else:
            print("Usage: python news_scheduler.py [run|check|start]")
            print("  run   - Run news scraper once")
            print("  check - Check news freshness and update if needed")
            print("  start - Start continuous scheduler")
    else:
        # Default: start scheduler
        scheduler.start_scheduler()

if __name__ == "__main__":
    main()