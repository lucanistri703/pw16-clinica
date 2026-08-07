from sqlalchemy.orm import Session
from app.models.paziente import Paziente
from app.models.medico import Medico
from app.models.segreteria import Segreteria


def trova_utente_per_email(db: Session, email: str):
    """Cerca un utente per email nelle tre tabelle (paziente, medico, segreteria).
    Restituisce l'oggetto utente e il suo tipo, oppure (None, None) se non trovato."""
    paziente = db.query(Paziente).filter(Paziente.email == email).first()
    if paziente:
        return paziente, "paziente"

    medico = db.query(Medico).filter(Medico.email == email).first()
    if medico:
        return medico, "medico"

    segreteria = db.query(Segreteria).filter(Segreteria.email == email).first()
    if segreteria:
        return segreteria, "segreteria"

    return None, None