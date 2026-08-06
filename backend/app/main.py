from fastapi import FastAPI
from app.database import Base, engine
from app import models  # importa tutti i modelli tramite __init__.py

# crea tutte le tabelle nel database (se non esistono già)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Gestione Clinica")

@app.get("/")
def root():
    return {"message": "API Gestione Clinica - funzionante"}