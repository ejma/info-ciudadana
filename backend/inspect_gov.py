
import requests
from bs4 import BeautifulSoup

url = "https://www.lamoncloa.gob.es/gobierno/composiciondelgobierno/Paginas/index.aspx"

try:
    response = requests.get(url, verify=False, timeout=10)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        with open("gov_page.html", "w", encoding="utf-8") as f:
            f.write(soup.prettify())
        print("HTML saved to gov_page.html")
except Exception as e:
    print(f"Error: {e}")
