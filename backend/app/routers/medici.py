from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.medico import MedicoRisposta, CreazioneMedico
from app.models.medico import Medico
from app.models.specializzazione import Specializzazione
from app.models.ambulatorio import Ambulatorio
from app.auth.sicurezza import hash_password
from app.auth.dipendenze import utente_corrente, solo_segreteria


router = APIRouter(prefix="/medici", tags=["Medici"])


@router.get("/", response_model=list[MedicoRisposta])
def lista_medici(
    specializzazione_id: int | None = None,
    includi_disattivati: bool = False,
    dati_utente = Depends(utente_corrente),
    db: Session = Depends(get_db),
):
    query = db.query(Medico)

    if specializzazione_id is not None:
        query = query.filter(Medico.id_specializzazione == specializzazione_id)

    if not includi_disattivati:
        query = query.filter(Medico.attivo == True)

    medici = query.all()

    risultato = []
    for m in medici:
        risultato.append(MedicoRisposta(
            id=m.id,
            nome=m.nome,
            cognome=m.cognome,
            email=m.email,
            telefono=m.telefono,
            attivo=m.attivo,
            id_specializzazione=m.id_specializzazione,
            id_ambulatorio=m.id_ambulatorio,
            specializzazione=m.specializzazione.nome,
            ambulatorio=m.ambulatorio.nome,
        ))

    return risultato


@router.post("/", response_model=MedicoRisposta, status_code=status.HTTP_201_CREATED)
def crea_medico(
    dati: CreazioneMedico,
    dati_utente = Depends(solo_segreteria),
    db: Session = Depends(get_db),
):
    
    if db.query(Medico).filter(Medico.email == dati.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email già registrata",
        )


    if not db.query(Specializzazione).filter(Specializzazione.id == dati.id_specializzazione).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specializzazione non valida",
        )
    
    if not db.query(Ambulatorio).filter(Ambulatorio.id == dati.id_ambulatorio).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ambulatorio non valido",
        )



    nuovo_medico = Medico(
        nome=dati.nome,
        cognome=dati.cognome,
        email=dati.email,
        telefono=dati.telefono,
        password=hash_password(dati.password),
        attivo=True,
        id_specializzazione=dati.id_specializzazione,
        id_ambulatorio=dati.id_ambulatorio,
    )

    db.add(nuovo_medico)
    db.commit()
    db.refresh(nuovo_medico)

    return nuovo_medico


@router.patch("/{id_medico}/stato", response_model=MedicoRisposta)
def cambia_stato_medico(
    id_medico: int,
    dati_utente = Depends(solo_segreteria),
    db: Session = Depends(get_db),
):
    medico = db.query(Medico).filter(Medico.id == id_medico).first()
    if medico is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medico non trovato",
        )

    medico.attivo = not medico.attivo

    db.commit()
    db.refresh(medico)

    return MedicoRisposta(
        id=medico.id,
        nome=medico.nome,
        cognome=medico.cognome,
        email=medico.email,
        telefono=medico.telefono,
        attivo=medico.attivo,
        id_specializzazione=medico.id_specializzazione,
        id_ambulatorio=medico.id_ambulatorio,
        specializzazione=medico.specializzazione.nome,
        ambulatorio=medico.ambulatorio.nome,
    )