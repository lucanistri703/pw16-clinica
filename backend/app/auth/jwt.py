from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

# chiave segreta per firmare i token (in produzione andrebbe tenuta fuori dal codice)
SECRET_KEY = "chiave_segreta_da_cambiare_in_produzione"
ALGORITMO = "HS256"
DURATA_TOKEN_MINUTI = 60


def crea_token(id_utente: int, tipo_utente: str) -> str:
    """Genera un token JWT contenente id e tipo dell'utente, con scadenza."""
    scadenza = datetime.now(timezone.utc) + timedelta(minutes=DURATA_TOKEN_MINUTI)
    dati = {
        "sub": str(id_utente),
        "tipo": tipo_utente,
        "exp": scadenza,
    }
    token = jwt.encode(dati, SECRET_KEY, algorithm=ALGORITMO)
    return token


def decodifica_token(token: str):
    """Verifica e decodifica un token JWT.
    Restituisce il payload (dati) se valido, oppure None se non valido o scaduto."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITMO])
        return payload
    except JWTError:
        return None