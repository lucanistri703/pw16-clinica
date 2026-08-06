from sqlalchemy import Column, Integer, Text, DateTime, Boolean, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base


class Prenotazione(Base):
    __tablename__ = "prenotazioni"

    id = Column(Integer, primary_key=True)
    id_fascia_oraria_visita = Column(Integer, ForeignKey("fasce_orarie_visita.id"), nullable=False)
    id_paziente = Column(Integer, ForeignKey("pazienti.id"), nullable=False)
    nota_paziente = Column(Text, nullable=True)
    data_creazione = Column(DateTime, nullable=False)
    da_segreteria = Column(Boolean, nullable=False, default=False)
    cancellata = Column(Boolean, nullable=False, default=False)

    __table_args__ = (
        Index(
            "uq_fascia_attiva",
            "id_fascia_oraria_visita",
            unique=True,
            sqlite_where=(cancellata == False),
        ),
    )

    fascia_oraria = relationship("FasciaOrariaVisita", back_populates="prenotazioni")
    paziente = relationship("Paziente", back_populates="prenotazioni")