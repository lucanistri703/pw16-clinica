# PW16 - Sistema di gestione prenotazioni per poliambulatorio

Applicazione web full-stack per la gestione delle prenotazioni di visite mediche di un poliambulatorio. Il sistema è composto da un backend basato su API REST (FastAPI) e da un frontend sviluppato con React.

## Prerequisiti

Prima di avviare il progetto è necessario avere installato:

- Python 3.14 (o versione compatibile)
- Node.js 24 (o versione compatibile) e npm

## Struttura del progetto

- `backend/`: Backend FastAPI (API REST)
- `frontend/`: Frontend React
- `requirements.txt`: Dipendenze Python
- `README.md`

Il database SQLite non è incluso nel repository e viene creato automaticamente durante la fase di inizializzazione descritta di seguito.

## Installazione e avvio

### 1. Backend

Dalla cartella principale del progetto, creare e attivare l'ambiente virtuale Python:

    python -m venv venv
    venv\Scripts\activate

Installare le dipendenze (solo la prima volta):

    pip install -r requirements.txt

Entrare nella cartella backend:

    cd backend

Inizializzare il database con i dati di partenza (solo la prima volta):

    python -m app.seed

Questo comando crea il database e lo popola con dati di esempio (specializzazioni, ambulatori, medici, pazienti e un account di segreteria).

Tornare nella cartella principale e avviare il server backend:

    cd ..
    uvicorn app.main:app --reload --app-dir backend

Il backend sarà disponibile su http://127.0.0.1:8000  
La documentazione interattiva delle API (Swagger) è accessibile su http://127.0.0.1:8000/docs

### 2. Frontend

Aprire un secondo terminale ed entrare nella cartella del frontend:

    cd frontend

Installare le dipendenze (solo la prima volta):

    npm install

Avviare l'applicazione:

    npm run dev

Il frontend sarà disponibile all'indirizzo indicato nel terminale (in genere http://localhost:5173).

## Utilizzo

Il backend e il frontend devono essere avviati entrambi e mantenuti in esecuzione contemporaneamente su due terminali distinti.

### Credenziali di esempio

Dopo l'inizializzazione del database, è possibile accedere con i seguenti account (password comune: password123):

- Paziente: giovanni.neri@gmail.com
- Segreteria: segreteria@clinica.it

## Tecnologie utilizzate

Backend: Python, FastAPI, SQLAlchemy, SQLite, Pydantic, autenticazione JWT, bcrypt  
Frontend: React, Vite, React Router, Bootstrap