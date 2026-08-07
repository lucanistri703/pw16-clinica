from datetime import datetime, timedelta, timezone
from jose import jwt

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