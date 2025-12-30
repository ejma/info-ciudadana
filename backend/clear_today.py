import sqlite3
from datetime import datetime

today_str = datetime.now().strftime("%d.%m.%Y")
conn = sqlite3.connect('agenda.db')
cursor = conn.cursor()
cursor.execute("DELETE FROM agenda WHERE fecha = ?", (today_str,))
conn.commit()
rows_deleted = cursor.rowcount
conn.close()
print(f"Deleted {rows_deleted} records for {today_str}")
