from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Medico(Base):
    __tablename__ = "medici"

    id = Column(Integer, primary_key=True)
    nome = Column(String, nullable=False)
    cognome = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    telefono = Column(String, nullable=True)
    password = Column(String, nullable=False)
    attivo = Column(Boolean, nullable=False, default=True)
    id_specializzazione = Column(Integer, ForeignKey("specializzazioni.id"), nullable=False)
    id_ambulatorio = Column(Integer, ForeignKey("ambulatori.id"), nullable=False)

    specializzazione = relationship("Specializzazione", back_populates="medici")
    ambulatorio = relationship("Ambulatorio", back_populates="medici")
    orari_ricevimento = relationship("OrarioRicevimento", back_populates="medico")
    assenze = relationship("Assenza", back_populates="medico")
    fasce_orarie = relationship("FasciaOrariaVisita", back_populates="medico")