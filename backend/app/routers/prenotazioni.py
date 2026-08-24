from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.schemas.disponibilita import SlotDisponibile
from app.services.disponibilita import calcola_disponibilita
from app.auth.dipendenze import utente_corrente


router = APIRouter(prefix="/prenotazioni", tags=["Prenotazioni"])


@router.get("/disponibilita", response_model=list[SlotDisponibile])
def disponibilita(
    id_medico: int,
    giorno: date,
    dati_utente = Depends(utente_corrente),
    db: Session = Depends(get_db),
):
    slot_liberi = calcola_disponibilita(db, id_medico, giorno)
    return [
        SlotDisponibile(ora_inizio=inizio, ora_fine=fine)
        for inizio, fine in slot_liberi
    ]