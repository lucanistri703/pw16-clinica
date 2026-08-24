from pydantic import BaseModel
from datetime import date, time


class CreazionePrenotazione(BaseModel):
    id_medico: int
    giorno: date
    ora_inizio: time
    nota_paziente: str | None = None


class PrenotazioneRisposta(BaseModel):
    id: int
    id_fascia_oraria_visita: int
    id_paziente: int
    nota_paziente: str | None
    da_segreteria: bool
    cancellata: bool

    model_config = {"from_attributes": True}