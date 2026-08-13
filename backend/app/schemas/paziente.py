from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
import re



class RegistrazionePaziente(BaseModel):
    nome: str
    cognome: str
    data_nascita: date
    codice_fiscale: str
    email: EmailStr
    telefono: str | None = None
    password: str


    @field_validator("codice_fiscale")
    @classmethod
    def valida_codice_fiscale(cls, valore: str) -> str:
        valore = valore.upper().strip()
        pattern = r"^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$"
        if not re.match(pattern, valore):
            raise ValueError("Codice fiscale non valido")
        return valore

    @field_validator("telefono")
    @classmethod
    def valida_telefono(cls, valore: str | None) -> str | None:
        if valore is None or valore.strip() == "":
            return None
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



class PazienteRisposta(BaseModel):
    id: int
    nome: str
    cognome: str
    data_nascita: date
    codice_fiscale: str
    email: EmailStr
    telefono: str | None

    model_config = {"from_attributes": True}