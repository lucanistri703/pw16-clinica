from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.paziente import RegistrazionePaziente, PazienteRisposta
from app.models.paziente import Paziente
from app.auth.sicurezza import hash_password
from app.auth.dipendenze import solo_segreteria


router = APIRouter(prefix="/pazienti", tags=["Pazienti"])


@router.post("/registrazione", response_model=PazienteRisposta, status_code=status.HTTP_201_CREATED)
def registra_paziente(dati: RegistrazionePaziente, db: Session = Depends(get_db)):
    
    email_esistente = db.query(Paziente).filter(Paziente.email == dati.email).first()
    if email_esistente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email già registrata",
        )

    cf_esistente = db.query(Paziente).filter(Paziente.codice_fiscale == dati.codice_fiscale).first()
    if cf_esistente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Codice fiscale già registrato",
        )

    nuovo_paziente = Paziente(
        nome=dati.nome,
        cognome=dati.cognome,
        data_nascita=dati.data_nascita,
        codice_fiscale=dati.codice_fiscale,
        email=dati.email,
        telefono=dati.telefono,
        password=hash_password(dati.password),
    )

    db.add(nuovo_paziente)
    db.commit()
    db.refresh(nuovo_paziente)

    return nuovo_paziente



@router.get("/", response_model=list[PazienteRisposta])
def lista_pazienti(
    dati_utente = Depends(solo_segreteria),
    db: Session = Depends(get_db),
):
    pazienti = db.query(Paziente).all()
    return pazienti