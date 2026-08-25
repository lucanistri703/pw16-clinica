from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.anagrafiche import SpecializzazioneRisposta, AmbulatorioRisposta
from app.models.specializzazione import Specializzazione
from app.models.ambulatorio import Ambulatorio
from app.auth.dipendenze import utente_corrente

router = APIRouter(prefix="/anagrafiche", tags=["Anagrafiche"])


@router.get("/specializzazioni", response_model=list[SpecializzazioneRisposta])
def lista_specializzazioni(
    dati_utente = Depends(utente_corrente),
    db: Session = Depends(get_db),
):
    return db.query(Specializzazione).all()


@router.get("/ambulatori", response_model=list[AmbulatorioRisposta])
def lista_ambulatori(
    dati_utente = Depends(utente_corrente),
    db: Session = Depends(get_db),
):
    return db.query(Ambulatorio).all()