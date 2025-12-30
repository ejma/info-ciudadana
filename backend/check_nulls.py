import sqlite3

DB_FILE = "agenda.db"

def check_nulls():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        fields = ['fecha', 'hora', 'persona', 'cargo', 'descripcion']
        
        for field in fields:
            cursor.execute(f"SELECT COUNT(*) FROM agenda WHERE {field} IS NULL")
            count = cursor.fetchone()[0]
            if count > 0:
                print(f"WARNING: Found {count} rows with NULL in '{field}'")
                
                # Show sample
                cursor.execute(f"SELECT * FROM agenda WHERE {field} IS NULL LIMIT 3")
                rows = cursor.fetchall()
                for row in rows:
                    print(row)
            else:
                print(f"No NULLs in '{field}'")
                
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_nulls()
