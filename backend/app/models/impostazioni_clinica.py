from sqlalchemy import Column, Integer
from app.database import Base


class ImpostazioniClinica(Base):
    __tablename__ = "impostazioni_clinica"

    id = Column(Integer, primary_key=True)
    limite_giorni = Column(Integer, nullable=False, default=30)
    preavviso_cancellazione = Column(Integer, nullable=False, default=2)