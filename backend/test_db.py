from database import get_db_connection

print("Testing connection...")
conn = get_db_connection()
if conn:
    print("Connection SUCCESS")
    conn.close()
else:
    print("Connection FAILED")
