from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from datetime import datetime
from database import get_db_connection
from scraper import scrape_agenda

router = APIRouter(
    prefix="/agenda",
    tags=["agenda"],
    responses={404: {"description": "Not found"}},
)

class AgendaItem(BaseModel):
    id: int
    fecha: str 
    hora: str
    persona: str
    cargo: str
    descripcion: str

@router.post("/scrape")
def trigger_scrape(urls: List[str]):
    """
    Trigger a scrape for the provided URLs manually.
    """
    count = scrape_agenda(urls)
    return {"message": f"Scraped {count} items"}

@router.get("/", response_model=List[AgendaItem])
def get_agenda(
    limit: int = 100, 
    persona: Optional[str] = None, 
    cargo: Optional[str] = None, 
    fecha: Optional[str] = None
):
    today_iso = datetime.now().strftime("%Y-%m-%d")
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    # Enable dictionary access for rows
    conn.row_factory = sqlite3.Row
    try:
        cursor = conn.cursor()
        
        # 1. Lazy Update Check
        should_check_lazy = fecha is None or fecha == today_iso
        
        if should_check_lazy:
            cursor.execute("SELECT COUNT(*) FROM agenda WHERE fecha = ?", (today_iso,))
            count = cursor.fetchone()[0]
            if count == 0:
                today_param = datetime.now().strftime("%Y%m%d")
                url = f"https://www.lamoncloa.gob.es/gobierno/agenda/Paginas/agenda.aspx?d={today_param}"
                scrape_agenda([url])

        # 2. Build Query
        query = "SELECT * FROM agenda"
        conditions = []
        params = []

        if persona:
            conditions.append("persona LIKE ?")
            params.append(f"%{persona}%")
        if cargo:
            conditions.append("cargo LIKE ?")
            params.append(f"%{cargo}%")
        if fecha:
            conditions.append("fecha = ?")
            params.append(fecha)
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        query += " ORDER BY fecha DESC, hora DESC LIMIT ?"
        params.append(limit)

        cursor.execute(query, tuple(params))
        result = cursor.fetchall()
        items = [dict(row) for row in result]
    finally:
        conn.close()
    
    return items
