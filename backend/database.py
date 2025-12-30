import sqlite3
from sqlite3 import Error

DB_FILE = "agenda.db"

def get_db_connection():
    """Establishes and returns a database connection."""
    try:
        connection = sqlite3.connect(DB_FILE)
        return connection
    except Error as e:
        print(f"Error connecting to database: {e}")
        return None

def init_db():
    """Initializes the database schema."""
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            # SQLite Syntax for Auto Increment is slightly different
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS agenda (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    fecha TEXT, 
                    hora TEXT,
                    persona TEXT,
                    cargo TEXT,
                    descripcion TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(fecha, hora, persona, descripcion)
                )
            ''')
            conn.commit()
            print("Database initialized successfully (SQLite).")
        except Error as e:
            print(f"Error initializing database: {e}")
        finally:
            conn.close()
