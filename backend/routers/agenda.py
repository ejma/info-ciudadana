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

@router.get("/dates", response_model=List[str])
def get_available_dates(
    persona: Optional[str] = None, 
    cargo: Optional[str] = None
):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor()
        query = "SELECT DISTINCT fecha FROM agenda"
        conditions = []
        params = []

        if persona:
            conditions.append("persona LIKE ?")
            params.append(f"%{persona}%")
        if cargo:
            conditions.append("cargo LIKE ?")
            params.append(f"%{cargo}%")
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        query += " ORDER BY fecha DESC"

        cursor.execute(query, tuple(params))
        result = cursor.fetchall()
        dates = [row[0] for row in result if row[0]] # Filter None if any
        return dates

    except Exception as e:
        print(f"ERROR IN GET /agenda/dates: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")
    finally:
        conn.close()

@router.get("/", response_model=List[AgendaItem])
def get_agenda(
    limit: int = 100, 
    skip: int = 0,
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
        # Only check on first page and if no specific date filter or today is requested
        should_check_lazy = (skip == 0) and (fecha is None or fecha == today_iso)
        
        if should_check_lazy:
            cursor.execute("SELECT COUNT(*) FROM agenda WHERE fecha = ?", (today_iso,))
            row = cursor.fetchone()
            count = row[0] if row else 0
            if count == 0:
                today_param = datetime.now().strftime("%Y%m%d")
                url = f"https://www.lamoncloa.gob.es/gobierno/agenda/Paginas/agenda.aspx?d={today_param}"
                print(f"Triggering auto-scrape for {url}")
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
        
        # Add LIMIT and OFFSET
        query += " ORDER BY fecha DESC, hora DESC LIMIT ? OFFSET ?"
        params.append(limit)
        params.append(skip)

        cursor.execute(query, tuple(params))
        result = cursor.fetchall()
        items = [dict(row) for row in result]
        return items

    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        with open("error.log", "w") as f:
            f.write(error_msg)
        print(f"ERROR IN GET /agenda: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")
    finally:
        conn.close()
