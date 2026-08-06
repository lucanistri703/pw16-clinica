from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


class Paziente(Base):
    __tablename__ = "pazienti"

    id = Column(Integer, primary_key=True)
    nome = Column(String, nullable=False)
    cognome = Column(String, nullable=False)
    data_nascita = Column(Date, nullable=False)
    codice_fiscale = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    telefono = Column(String, nullable=True)
    password = Column(String, nullable=False)
    token_recupero = Column(String, nullable=True)
    scadenza_token = Column(DateTime, nullable=True)

    prenotazioni = relationship("Prenotazione", back_populates="paziente")