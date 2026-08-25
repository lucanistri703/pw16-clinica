from pydantic import BaseModel


class SpecializzazioneRisposta(BaseModel):
    id: int
    nome: str
    costo: float
    durata_minuti: int

    model_config = {"from_attributes": True}


class AmbulatorioRisposta(BaseModel):
    id: int
    nome: str

    model_config = {"from_attributes": True}