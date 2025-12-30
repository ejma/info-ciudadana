import sqlite3
import os

DB_FILE = "agenda.db"

def check_db():
    if not os.path.exists(DB_FILE):
        print(f"Database file {DB_FILE} not found!")
        return

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Check total count
        cursor.execute("SELECT COUNT(*) FROM agenda")
        total_count = cursor.fetchone()[0]
        print(f"Total rows in agenda: {total_count}")
        
        # Check latest date
        cursor.execute("SELECT MAX(fecha) FROM agenda")
        max_date = cursor.fetchone()[0]
        print(f"Latest date in agenda: {max_date}")

        # Show sample
        cursor.execute("SELECT * FROM agenda ORDER BY fecha DESC LIMIT 5")
        rows = cursor.fetchall()
        print("Latest 5 entries:")
        for row in rows:
            print(row)
            
        conn.close()
    except Exception as e:
        print(f"Error checking DB: {e}")

if __name__ == "__main__":
    check_db()
