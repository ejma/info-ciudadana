
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
import sqlite3
from database import get_db_connection
from routers.auth import get_current_admin_user

router = APIRouter(
    prefix="/participation",
    tags=["participation"],
    responses={404: {"description": "Not found"}},
)

# --- Models ---
class ResourceBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    published_at: Optional[date] = None

class ResourceCreate(ResourceBase):
    pass

class Resource(ResourceBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# --- Routes ---

@router.get("/resources", response_model=List[Resource])
def get_resources(skip: int = 0, limit: int = 20):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM resources ORDER BY published_at DESC LIMIT ? OFFSET ?", 
        (limit, skip)
    )
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

@router.get("/resources/{slug}", response_model=Resource)
def get_resource(slug: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM resources WHERE slug = ?", (slug,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    return dict(row)

# Protected Admin Routes

@router.post("/resources", response_model=Resource)
def create_resource(resource: ResourceCreate, current_user = Depends(get_current_admin_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO resources (title, slug, excerpt, content, image_url, published_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (resource.title, resource.slug, resource.excerpt, resource.content, resource.image_url, resource.published_at)
        )
        conn.commit()
        new_id = cursor.lastrowid
        
        # Return newly created item
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor() # Get new cursor to ensure row_factory is respected
        cursor.execute("SELECT * FROM resources WHERE id = ?", (new_id,))
        row = cursor.fetchone()
        return dict(row)
        
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Slug already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.put("/resources/{id}", response_model=Resource)
def update_resource(id: int, resource: ResourceCreate, current_user = Depends(get_current_admin_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE resources 
            SET title=?, slug=?, excerpt=?, content=?, image_url=?, published_at=?
            WHERE id=?
            """,
            (resource.title, resource.slug, resource.excerpt, resource.content, resource.image_url, resource.published_at, id)
        )
        conn.commit()
        
        if cursor.rowcount == 0:
             raise HTTPException(status_code=404, detail="Resource not found")

        # Return updated item
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor() 
        cursor.execute("SELECT * FROM resources WHERE id = ?", (id,))
        row = cursor.fetchone()
        return dict(row)

    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Slug already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.delete("/resources/{id}")
def delete_resource(id: int, current_user = Depends(get_current_admin_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM resources WHERE id = ?", (id,))
        conn.commit()
        
        if cursor.rowcount == 0:
             raise HTTPException(status_code=404, detail="Resource not found")
             
        return {"message": "Resource deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
