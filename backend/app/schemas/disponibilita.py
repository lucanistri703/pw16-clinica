from pydantic import BaseModel
from datetime import time


class SlotDisponibile(BaseModel):
    ora_inizio: time
    ora_fine: time