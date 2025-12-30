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
            # Users table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    hashed_password TEXT NOT NULL,
                    role TEXT DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Resources table (Participation)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS resources (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    slug TEXT UNIQUE NOT NULL,
                    excerpt TEXT,
                    content TEXT,
                    image_url TEXT,
                    published_at DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            print("Database initialized successfully (SQLite).")
        except Error as e:
            print(f"Error initializing database: {e}")
        finally:
            conn.close()
