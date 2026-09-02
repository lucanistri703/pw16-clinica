from pydantic import BaseModel, EmailStr, field_validator
import re


class MedicoRisposta(BaseModel):
    id: int
    nome: str
    cognome: str
    email: str
    telefono: str | None
    attivo: bool
    id_specializzazione: int
    id_ambulatorio: int
    specializzazione: str
    ambulatorio: str

    model_config = {"from_attributes": True}


class CreazioneMedico(BaseModel):
    nome: str
    cognome: str
    email: EmailStr
    telefono: str
    password: str
    id_specializzazione: int
    id_ambulatorio: int

    @field_validator("telefono")
    @classmethod
    def valida_telefono(cls, valore: str) -> str:
        valore = valore.strip()
        pattern = r"^(\+39)?\d{9,10}$"
        if not re.match(pattern, valore):
            raise ValueError("Numero di telefono non valido")
        return valore

    @field_validator("password")
    @classmethod
    def valida_password(cls, valore: str) -> str:
        if len(valore) < 8:
            raise ValueError("La password deve avere almeno 8 caratteri")
        return valore