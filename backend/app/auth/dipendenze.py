from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.jwt import decodifica_token
from app.models.paziente import Paziente
from app.models.medico import Medico
from app.models.segreteria import Segreteria

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


def utente_corrente(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Estrae e verifica il token, restituisce l'utente autenticato e il suo tipo."""
    errore = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token non valido o scaduto",
    )

    payload = decodifica_token(token)
    if payload is None:
        raise errore

    id_utente = payload.get("sub")
    tipo = payload.get("tipo")
    if id_utente is None or tipo is None:
        raise errore

    id_utente = int(id_utente)

    if tipo == "paziente":
        utente = db.query(Paziente).filter(Paziente.id == id_utente).first()
    elif tipo == "medico":
        utente = db.query(Medico).filter(Medico.id == id_utente).first()
    elif tipo == "segreteria":
        utente = db.query(Segreteria).filter(Segreteria.id == id_utente).first()
    else:
        utente = None

    if utente is None:
        raise errore

    return utente, tipo