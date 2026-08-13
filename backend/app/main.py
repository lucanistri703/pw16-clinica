from fastapi import FastAPI
from app.database import Base, engine
from app import models
from app.routers import autenticazione
from app.routers import pazienti
from app.routers import medici

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Gestione Clinica")

app.include_router(autenticazione.router)
app.include_router(pazienti.router)
app.include_router(medici.router)

@app.get("/")
def home():
    return {"messaggio": "API Gestione Clinica - funzionante"}