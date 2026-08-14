from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.assenza import CreazioneAssenza, AssenzaRisposta
from app.models.assenza import Assenza
from app.models.medico import Medico
from app.auth.dipendenze import solo_segreteria

router = APIRouter(prefix="/assenze", tags=["Assenze"])


@router.post("/", response_model=AssenzaRisposta, status_code=status.HTTP_201_CREATED)
def crea_assenza(
    dati: CreazioneAssenza,
    dati_utente = Depends(solo_segreteria),
    db: Session = Depends(get_db),
):
    
    medico = db.query(Medico).filter(Medico.id == dati.id_medico).first()
    if medico is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medico non trovato",
        )

    nuova_assenza = Assenza(
        id_medico=dati.id_medico,
        data_inizio=dati.data_inizio,
        data_fine=dati.data_fine,
        motivo=dati.motivo,
    )

    db.add(nuova_assenza)
    db.commit()
    db.refresh(nuova_assenza)

    return nuova_assenza