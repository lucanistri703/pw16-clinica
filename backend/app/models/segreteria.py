from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base


class Segreteria(Base):
    __tablename__ = "segreterie"

    id = Column(Integer, primary_key=True)
    nome = Column(String, nullable=False)
    cognome = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    token_recupero = Column(String, nullable=True)
    scadenza_token = Column(DateTime, nullable=True)