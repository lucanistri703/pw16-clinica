from sqlalchemy import Column, Integer, Text, DateTime, String
from app.database import Base


class LogAttivita(Base):
    __tablename__ = "log_attivita"

    id = Column(Integer, primary_key=True)
    data_ora = Column(DateTime, nullable=False)
    id_utente = Column(Integer, nullable=False)
    tipo_utente = Column(String, nullable=False)
    azione = Column(Text, nullable=False)