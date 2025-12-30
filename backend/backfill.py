import requests
from datetime import datetime, timedelta
import time
from scraper import scrape_agenda
from database import init_db

def backfill_agenda(start_date_str, end_date_str):
    init_db()
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
    
    current_date = start_date
    delta = timedelta(days=1)
    
    print(f"Starting backfill from {start_date_str} to {end_date_str}")
    
    while current_date <= end_date:
        date_param = current_date.strftime("%Y%m%d")
        url = f"https://www.lamoncloa.gob.es/gobierno/agenda/Paginas/agenda.aspx?d={date_param}"
        
        print(f"Scraping date: {current_date.strftime('%Y-%m-%d')} ...", end=" ", flush=True)
        try:
            # We call the scraper for one URL at a time to be safe and allow delays
            count = scrape_agenda([url])
            print(f"Done. Found {count} items.")
        except Exception as e:
            print(f"Failed: {e}")
        
        # Delay to avoid IP blocking
        time.sleep(1)
        current_date += delta

if __name__ == "__main__":
    # Scrape from Jan 1st 2025 to today
    today = datetime.now().strftime("%Y-%m-%d")
    backfill_agenda("2025-01-01", today)
