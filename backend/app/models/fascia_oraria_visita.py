from sqlalchemy import Column, Integer, Date, Time, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class FasciaOrariaVisita(Base):
    __tablename__ = "fasce_orarie_visita"

    id = Column(Integer, primary_key=True)
    id_medico = Column(Integer, ForeignKey("medici.id"), nullable=False)
    data = Column(Date, nullable=False)
    ora_inizio = Column(Time, nullable=False)
    ora_fine = Column(Time, nullable=False)
    prenotata = Column(Boolean, nullable=False, default=False)

    __table_args__ = (
        UniqueConstraint("id_medico", "data", "ora_inizio", name="uq_medico_data_ora"),
    )

    medico = relationship("Medico", back_populates="fasce_orarie")
    prenotazioni = relationship("Prenotazione", back_populates="fascia_oraria")