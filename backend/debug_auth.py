
import sqlite3
from passlib.context import CryptContext

# Setup pwd context same as auth.py
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def debug_users():
    conn = sqlite3.connect("agenda.db")
    cursor = conn.cursor()
    
    print("--- Users Table ---")
    try:
        cursor.execute("SELECT id, username, hashed_password, role FROM users")
        rows = cursor.fetchall()
        
        if not rows:
            print("No users found in database! Creating default admin...")
            new_hash = get_password_hash("admin123")
            cursor.execute(
                "INSERT INTO users (username, hashed_password, role) VALUES (?, ?, ?)", 
                ("admin", new_hash, "admin")
            )
            conn.commit()
            print("Default admin created: admin / admin123")
            return
        
        for row in rows:
            uid, username, hashed, role = row
            print(f"User: {username}, Role: {role}")
            
            # Verify admin password
            if username == "admin":
                is_valid = verify_password("admin123", hashed)
                print(f"  Password 'admin123' valid? {is_valid}")
                if not is_valid:
                    print("  -> Resetting password to 'admin123'...")
                    new_hash = get_password_hash("admin123")
                    cursor.execute("UPDATE users SET hashed_password = ? WHERE id = ?", (new_hash, uid))
                    conn.commit()
                    print("  -> Password reset.")
                    
    except sqlite3.OperationalError as e:
        print(f"Error querying users table: {e}")
        
    conn.close()

if __name__ == "__main__":
    debug_users()
