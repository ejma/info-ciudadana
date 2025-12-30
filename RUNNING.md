# Cómo ejecutar Info Ciudadana

Para ejecutar la aplicación necesitas correr tanto el frontend como el backend simultáneamente.

## 1. Backend

El backend es una API en Python (FastAPI).

### Requisitos
- Python 3.8+ instalado.
- Entorno virtual creado y activado.

### Comandos
Desde la carpeta `info-ciudadana/backend`:

```bash
# Activar entorno virtual (Windows)
./venv/Scripts/activate

# Instalar dependencias (primera vez o si hay cambios)
pip install -r requirements.txt

# Ejecutar servidor
python -m uvicorn main:app --reload --port 8000
```

El servidor estará disponible en: [http://127.0.0.1:8000](http://127.0.0.1:8000)
Documentación interactiva (Swagger): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 2. Frontend

El frontend es una aplicación React (Vite).

### Requisitos
- Node.js instalado (v18+ recomendado).

### Comandos
Desde la carpeta `info-ciudadana/frontend`:

```bash
# Instalar dependencias (primera vez)
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

El frontend estará disponible normalmente en: [http://localhost:5173](http://localhost:5173)

## Notas
- El frontend está configurado para conectarse al backend en el puerto 8000.
- Si obtienes errores de `ECONNREFUSED` en el frontend, verifica que el backend no se haya detenido.
