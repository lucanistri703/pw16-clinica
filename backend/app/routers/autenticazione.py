from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.auth.autenticazione import trova_utente_per_email
from app.auth.sicurezza import verifica_password
from app.auth.jwt import crea_token

router = APIRouter(prefix="/auth", tags=["Autenticazione"])


@router.post("/login", response_model=TokenResponse)
def login(dati: LoginRequest, db: Session = Depends(get_db)):
    utente, tipo = trova_utente_per_email(db, dati.email)

    if utente is None or not verifica_password(dati.password, utente.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenziali non valide",
        )

    token = crea_token(id_utente=utente.id, tipo_utente=tipo)
    return TokenResponse(access_token=token, tipo_utente=tipo)