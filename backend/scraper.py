import requests
from bs4 import BeautifulSoup
from database import get_db_connection

def scrape_agenda(urls):
    """
    Scrapes the agenda from the provided URLs and saves to the database.
    """
    registros = []
    
    print(f"Starting scrape for {len(urls)} URLs...")

    for url in urls:
        try:
            # Obtener la página web
            response = requests.get(url)
            response.encoding = 'utf-8' # Preservar acentos

            if response.status_code != 200:
                print(f"Failed to fetch {url}: Status {response.status_code}")
                continue

            # Parsear el contenido HTML
            soup = BeautifulSoup(response.text, 'html.parser')

            # Obtener la fecha de la agenda
            header_agenda = soup.find(id="headerAgenda")
            if not header_agenda:
                print(f"No headerAgenda found for {url}")
                continue
                
            h1_tag = header_agenda.find('h1')
            if not h1_tag:
                print(f"No h1 found in headerAgenda for {url}")
                continue

            try:
               fecha_text = h1_tag.text.split(" - ")[1].strip()
               # Normalize date from "DD.MM.YYYY" or "D.M.YYYY" to "YYYY-MM-DD"
               parts = fecha_text.split(".")
               if len(parts) == 3:
                   d, m, y = parts
                   fecha = f"{y}-{int(m):02d}-{int(d):02d}"
               else:
                   # Fallback to text if parsing fails (should not happen with regular Moncloa)
                   fecha = fecha_text
            except Exception as e:
                print(f"Could not parse date from '{h1_tag.text}': {e}")
                continue

            # Encontrar todas las personas
            people = soup.find_all('li')

            for person in people:
                persona_tag = person.find('span', class_='nombrePersona')
                cargo_tag = person.find('p', class_='eventDescription cargo')

                if persona_tag and cargo_tag:
                    persona = persona_tag.text.strip()
                    cargo = cargo_tag.text.strip()

                    # Encontrar todos los eventos para la persona actual
                    events = person.find_all('li')
                    
                    # If no sub-li found, maybe the structure is flattened or different?
                    # The user's code nested: for event in events...
                    # Let's keep that structure.

                    if not events: 
                        # Sometimes person has events directly?
                        pass

                    for event in events:
                        hora = event.find('span', class_='eventDate').text.strip() if event.find('span', class_='eventDate') else ''
                        event_right = event.find('div', class_='eventRight')

                        if event_right:
                            # Obtener toda la descripción en eventRight
                            descripcion = ' '.join([p.text.strip() for p in event_right.find_all('p')])

                            # Agregar el registro a la lista
                            registros.append((fecha, hora, persona, cargo, descripcion))
        except Exception as e:
            print(f"Error scraping {url}: {e}")

    if registros:
        save_to_db(registros)
        return len(registros)
    else:
        print("No records found.")
        return 0

def save_to_db(registros):
    conn = get_db_connection()
    if not conn:
        print("Could not save to DB: No connection.")
        return

    try:
        cursor = conn.cursor()
        # SQLite uses ? for placeholders. Use INSERT OR IGNORE for unique constraint.
        insert_query = '''
            INSERT OR IGNORE INTO agenda (fecha, hora, persona, cargo, descripcion)
            VALUES (?, ?, ?, ?, ?)
        '''
        cursor.executemany(insert_query, registros)
        conn.commit()
        print(f"Inserted {len(registros)} records successfully.")
    except Exception as e:
        print(f"Error executing insert: {e}")
    finally:
        conn.close()
