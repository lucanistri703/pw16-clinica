from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Assenza(Base):
    __tablename__ = "assenze"

    id = Column(Integer, primary_key=True)
    id_medico = Column(Integer, ForeignKey("medici.id"), nullable=False)
    data_inizio = Column(Date, nullable=False)
    data_fine = Column(Date, nullable=False)
    motivo = Column(String, nullable=False)

    medico = relationship("Medico", back_populates="assenze")