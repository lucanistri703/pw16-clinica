from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.orm import relationship
from app.database import Base


class Specializzazione(Base):
    __tablename__ = "specializzazioni"

    id = Column(Integer, primary_key=True)
    nome = Column(String, unique=True, nullable=False)
    costo = Column(Numeric(6, 2), nullable=False)
    durata_minuti = Column(Integer, nullable=False)

    medici = relationship("Medico", back_populates="specializzazione")