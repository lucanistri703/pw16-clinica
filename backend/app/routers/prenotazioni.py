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
from app.models.impostazioni_clinica import ImpostazioniClinica
from app.schemas.prenotazione import PrenotazioneDettagliata


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


@router.patch("/{id_prenotazione}/cancella", response_model=PrenotazioneRisposta)
def cancella_prenotazione(
    id_prenotazione: int,
    dati_utente = Depends(solo_paziente),
    db: Session = Depends(get_db),
):
    paziente, tipo = dati_utente

    prenotazione = db.query(Prenotazione).filter(
        Prenotazione.id == id_prenotazione
    ).first()

    if prenotazione is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prenotazione non trovata",
        )

    if prenotazione.id_paziente != paziente.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Non puoi cancellare una prenotazione non tua",
        )

    if prenotazione.cancellata:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Prenotazione già cancellata",
        )

    impostazioni = db.query(ImpostazioniClinica).first()
    preavviso = impostazioni.preavviso_cancellazione
    data_visita = prenotazione.fascia_oraria.data
    giorni_mancanti = (data_visita - date.today()).days

    if giorni_mancanti < preavviso:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"La cancellazione richiede almeno {preavviso} giorni di preavviso",
        )

    prenotazione.cancellata = True
    db.commit()
    db.refresh(prenotazione)

    return prenotazione


@router.get("/mie", response_model=list[PrenotazioneDettagliata])
def le_mie_prenotazioni(
    dati_utente = Depends(solo_paziente),
    db: Session = Depends(get_db),
):
    paziente, tipo = dati_utente

    prenotazioni = db.query(Prenotazione).filter(
    Prenotazione.id_paziente == paziente.id,
    Prenotazione.cancellata == False,
    ).all()

    risultato = []
    for p in prenotazioni:
        fascia = p.fascia_oraria
        medico = fascia.medico
        risultato.append(PrenotazioneDettagliata(
            id=p.id,
            medico_nome=medico.nome,
            medico_cognome=medico.cognome,
            specializzazione=medico.specializzazione.nome,
            ambulatorio=medico.ambulatorio.nome,
            data=fascia.data,
            ora_inizio=fascia.ora_inizio,
            ora_fine=fascia.ora_fine,
            nota_paziente=p.nota_paziente,
            cancellata=p.cancellata,
            da_segreteria=p.da_segreteria,
        ))

    return risultato