
from fastapi import APIRouter, HTTPException, Query, Request
from typing import List, Optional
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import os
from PIL import Image
from io import BytesIO
import hashlib

router = APIRouter(
    prefix="/government",
    tags=["government"],
    responses={404: {"description": "Not found"}},
)

BASE_URL = "https://www.lamoncloa.gob.es"
COMPOSITION_URL = "https://www.lamoncloa.gob.es/gobierno/composiciondelgobierno/Paginas/index.aspx"

# Setup directories
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BACKEND_DIR, "static")
THUMBNAILS_DIR = os.path.join(STATIC_DIR, "thumbnails")
os.makedirs(THUMBNAILS_DIR, exist_ok=True)

class GovernmentMember(BaseModel):
    name: str
    cargo: str
    photo_url: str
    thumbnail_url: Optional[str] = None
    bio_url: str

def get_thumbnail_url(original_url: str, request: Request) -> Optional[str]:
    if not original_url:
        return None
        
    try:
        # Create a unique filename based on the URL
        hash_name = hashlib.md5(original_url.encode()).hexdigest()
        filename = f"{hash_name}.jpg"
        filepath = os.path.join(THUMBNAILS_DIR, filename)
        
        # Check if thumbnail already exists
        if not os.path.exists(filepath):
            # Download original image
            response = requests.get(original_url, verify=False, timeout=10)
            if response.status_code == 200:
                img = Image.open(BytesIO(response.content))
                
                # Convert to RGB if needed (e.g. for PNGs)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                    
                # Resize to max 300x300
                img.thumbnail((300, 300))
                
                # Save as JPEG
                img.save(filepath, "JPEG", quality=85)
            else:
                return None
                
        # Return the static URL
        base_url = str(request.base_url).rstrip("/")
        return f"{base_url}/static/thumbnails/{filename}"
        
    except Exception as e:
        print(f"Error creating thumbnail for {original_url}: {e}")
        return None

@router.get("/", response_model=List[GovernmentMember])
def get_government_composition(request: Request):
    try:
        # Verify=False used as per previous checks on this host
        response = requests.get(COMPOSITION_URL, verify=False, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        members = []
        
        # The container identified in research
        container = soup.find("ul", class_="container-advanced-news")
        if not container:
            # Fallback or empty return
            print("Container 'ul.container-advanced-news' not found")
            return []
            
        items = container.find_all("li", class_="advanced-new")
        
        for item in items:
            try:
                # Name and Bio Link
                title_div = item.find("p", class_="title-advanced-news")
                link_tag = title_div.find("a") if title_div else None
                
                if not link_tag:
                    continue
                    
                name = link_tag.get_text(strip=True)
                relative_bio_url = link_tag.get('href')
                bio_url = urljoin(BASE_URL, relative_bio_url)
                
                # Cargo
                subtitle_div = item.find("p", class_="subTitle-advanced-news")
                cargo = subtitle_div.get_text(strip=True) if subtitle_div else "Cargo desconocido"
                
                # Photo
                img_div = item.find("div", class_="image-advanced-new")
                img_tag = img_div.find("img") if img_div else None
                photo_url = ""
                thumbnail_url = None
                
                if img_tag:
                    relative_img_src = img_tag.get('src')
                    photo_url = urljoin(BASE_URL, relative_img_src)
                    # Generate/Get Thumbnail
                    thumbnail_url = get_thumbnail_url(photo_url, request)
                
                members.append(GovernmentMember(
                    name=name,
                    cargo=cargo,
                    photo_url=photo_url,
                    thumbnail_url=thumbnail_url, # Include thumbnail URL
                    bio_url=bio_url
                ))
            except Exception as e:
                print(f"Error parsing item: {e}")
                continue
                
        return members

    except Exception as e:
        print(f"Scraping error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch government data: {str(e)}")

class BioResponse(BaseModel):
    html_content: str

@router.get("/bio", response_model=BioResponse)
def get_bio_content(url: str = Query(..., description="Full URL of the bio page")):
    try:
        # Security/Validation: Ensure URL belongs to lamoncloa.gob.es to prevent arbitrary proxying
        if "lamoncloa.gob.es" not in url:
             raise HTTPException(status_code=400, detail="Invalid domain. Only lamoncloa.gob.es allowed.")

        response = requests.get(url, verify=False, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Target div per user request
        main_content = soup.find("div", id="MainContent")
        
        if not main_content:
            return BioResponse(html_content="<p>No se pudo extraer el contenido de la biografía.</p>")
            
        # Optional: Clean up content (remove scripts, etc)
        for script in main_content(["script", "style"]):
            script.decompose()
            
        # Fix relative image paths in bio - Keep Original URL for bio images
        for img in main_content.find_all('img'):
            if img.get('src'):
                img['src'] = urljoin(BASE_URL, img['src'])
                
        return BioResponse(html_content=str(main_content))

    except Exception as e:
        print(f"Bio Scraping error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch bio: {str(e)}")
