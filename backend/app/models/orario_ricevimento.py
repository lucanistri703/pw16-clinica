from sqlalchemy import Column, Integer, Time, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class OrarioRicevimento(Base):
    __tablename__ = "orari_ricevimento"

    id = Column(Integer, primary_key=True)
    id_medico = Column(Integer, ForeignKey("medici.id"), nullable=False)
    giorno_settimana = Column(Integer, nullable=False)
    ora_inizio = Column(Time, nullable=False)
    ora_fine = Column(Time, nullable=False)

    medico = relationship("Medico", back_populates="orari_ricevimento")