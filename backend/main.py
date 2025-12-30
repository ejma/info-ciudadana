from fastapi import FastAPI
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
    participation
)

app = FastAPI(title="Ciudadano Informado API")

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(agenda.router)
app.include_router(parliament.router)
app.include_router(legislature.router)
app.include_router(subsidies.router)
app.include_router(contracting.router)
app.include_router(legislation.router)
app.include_router(alerts.router)
app.include_router(corruption.router)
app.include_router(participation.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Ciudadano Informado"}
