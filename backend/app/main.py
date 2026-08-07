from fastapi import FastAPI
from app.database import Base, engine
from app import models
from app.routers import autenticazione

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Gestione Clinica")

app.include_router(autenticazione.router)

@app.get("/")
def home():
    return {"messaggio": "API Gestione Clinica - funzionante"}