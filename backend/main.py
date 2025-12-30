from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import (
    agenda,
    parliament,
    legislature,
    subsidies,
    contracting,
    legislation,
    alerts,
    corruption,
    participation,
    participation,
    government,
    auth
)

app = FastAPI(title="Ciudadano Informado API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

# Create static directory if it doesn't exist
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.on_event("startup")
def on_startup():
    init_db()
    
    # Create default admin user if not exists
    from routers.auth import get_user, get_password_hash
    from database import get_db_connection
    
    if not get_user("admin"):
        print("Creating default admin user...")
        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor()
                hashed = get_password_hash("admin123")
                cursor.execute(
                    "INSERT INTO users (username, hashed_password, role) VALUES (?, ?, ?)", 
                    ("admin", hashed, "admin")
                )
                conn.commit()
                print("Default admin created: admin / admin123")
            except Exception as e:
                print(f"Error creating default admin: {e}")
            finally:
                conn.close()

app.include_router(auth.router)
app.include_router(agenda.router, tags=["agenda"])
app.include_router(parliament.router)
app.include_router(legislature.router)
# Force reload
app.include_router(subsidies.router)
app.include_router(contracting.router)
app.include_router(legislation.router)
app.include_router(alerts.router)
app.include_router(corruption.router)
app.include_router(participation.router)
app.include_router(government.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Ciudadano Informado"}
