import sqlite3
import re

DB_FILE = "agenda.db"

def check_dates():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, fecha FROM agenda")
        rows = cursor.fetchall()
        
        iso_pattern = re.compile(r'^\d{4}-\d{2}-\d{2}$')
        
        bad_dates = []
        for r_id, fecha in rows:
            if not fecha:
                bad_dates.append((r_id, "None"))
                continue
            if not iso_pattern.match(fecha):
                bad_dates.append((r_id, fecha))
                
        print(f"Total rows: {len(rows)}")
        print(f"Rows with non-ISO dates: {len(bad_dates)}")
        
        if bad_dates:
            print("Sample bad dates:")
            for item in bad_dates[:20]:
                print(item)
                
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_dates()
