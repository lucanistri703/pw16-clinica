from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class Ambulatorio(Base):
    __tablename__ = "ambulatori"

    id = Column(Integer, primary_key=True)
    nome = Column(String, unique=True, nullable=False)

    medici = relationship("Medico", back_populates="ambulatorio")