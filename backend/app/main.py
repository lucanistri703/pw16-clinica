from fastapi import FastAPI

app = FastAPI(title="API Gestione Clinica")

@app.get("/")
def root():
    return {"message": "API Gestione Clinica - funzionante"}