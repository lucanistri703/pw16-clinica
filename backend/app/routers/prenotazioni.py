from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import date, datetime, timedelta
from app.database import get_db
from app.schemas.disponibilita import SlotDisponibile
from app.schemas.prenotazione import CreazionePrenotazione, PrenotazioneRisposta
from app.services.disponibilita import calcola_disponibilita
from app.models.fascia_oraria_visita import FasciaOrariaVisita
from app.models.prenotazione import Prenotazione
from app.models.medico import Medico
from app.models.specializzazione import Specializzazione
from app.auth.dipendenze import utente_corrente, solo_paziente


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


@router.post("/", response_model=PrenotazioneRisposta, status_code=status.HTTP_201_CREATED)
def crea_prenotazione(
    dati: CreazionePrenotazione,
    dati_utente = Depends(solo_paziente),
    db: Session = Depends(get_db),
):
    paziente, tipo = dati_utente

    slot_liberi = calcola_disponibilita(db, dati.id_medico, dati.giorno)
    orari_liberi = [inizio for inizio, fine in slot_liberi]
    if dati.ora_inizio not in orari_liberi:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Orario non più disponibile",
        )

    medico = db.query(Medico).filter(Medico.id == dati.id_medico).first()

    specializzazione = db.query(Specializzazione).filter(
        Specializzazione.id == medico.id_specializzazione
    ).first()

    durata = specializzazione.durata_minuti

    inizio_dt = datetime.combine(dati.giorno, dati.ora_inizio)

    ora_fine = (inizio_dt + timedelta(minutes=durata)).time()

    sovrapposta = db.query(Prenotazione).join(FasciaOrariaVisita).filter(
        Prenotazione.id_paziente == paziente.id,
        Prenotazione.cancellata == False,
        FasciaOrariaVisita.data == dati.giorno,
        FasciaOrariaVisita.ora_inizio == dati.ora_inizio,
    ).first()

    if sovrapposta is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Hai già una prenotazione in questo orario",
        )

    
    try:
        fascia = FasciaOrariaVisita(
            id_medico=dati.id_medico,
            data=dati.giorno,
            ora_inizio=dati.ora_inizio,
            ora_fine=ora_fine,
            prenotata=True,
        )
        db.add(fascia)
        db.flush()  # forza l'assegnazione dell'id alla fascia senza chiudere la transazione

        prenotazione = Prenotazione(
            id_fascia_oraria_visita=fascia.id,
            id_paziente=paziente.id,
            nota_paziente=dati.nota_paziente,
            data_creazione=datetime.now(),
            da_segreteria=False,
            cancellata=False,
        )
        db.add(prenotazione)
        db.commit()
        db.refresh(prenotazione)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Orario non più disponibile",
        )

    return prenotazione