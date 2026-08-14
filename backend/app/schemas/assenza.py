from pydantic import BaseModel, field_validator
from datetime import date


class CreazioneAssenza(BaseModel):
    id_medico: int
    data_inizio: date
    data_fine: date
    motivo: str

    @field_validator("motivo")
    @classmethod
    def valida_motivo(cls, valore: str) -> str:
        valore = valore.strip()
        if valore == "":
            raise ValueError("Il motivo è obbligatorio")
        if len(valore) > 100:
            raise ValueError("Il motivo non può superare i 100 caratteri")
        return valore

    @field_validator("data_fine")
    @classmethod
    def valida_date(cls, valore: date, info) -> date:
        inizio = info.data.get("data_inizio")
        if inizio is not None and valore < inizio:
            raise ValueError("La data di fine non può precedere quella di inizio")
        return valore


class AssenzaRisposta(BaseModel):
    id: int
    id_medico: int
    data_inizio: date
    data_fine: date
    motivo: str

    model_config = {"from_attributes": True}