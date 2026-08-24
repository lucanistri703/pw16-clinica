from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from app.models.medico import Medico
from app.models.orario_ricevimento import OrarioRicevimento
from app.models.assenza import Assenza
from app.models.specializzazione import Specializzazione
from app.models.fascia_oraria_visita import FasciaOrariaVisita
from app.models.prenotazione import Prenotazione

# festività italiane fisse (giorno, mese)
FESTIVITA_FISSE = [
    (1, 1),    # Capodanno
    (6, 1),    # Epifania
    (25, 4),   # Liberazione
    (1, 5),    # Festa del lavoro
    (2, 6),    # Festa della Repubblica
    (15, 8),   # Ferragosto
    (1, 11),   # Ognissanti
    (8, 12),   # Immacolata
    (25, 12),  # Natale
    (26, 12),  # Santo Stefano
]


def e_festivo(giorno: date) -> bool:
    """Verifica se una data è una festività fissa italiana."""
    return (giorno.day, giorno.month) in FESTIVITA_FISSE


def calcola_disponibilita(db: Session, id_medico: int, giorno: date):
    """Calcola gli slot orari disponibili per un medico in una data.
    Restituisce una lista di slot liberi (ora_inizio, ora_fine)."""

    if e_festivo(giorno):
        return []

    giorno_settimana = giorno.weekday()
    orari = db.query(OrarioRicevimento).filter(
        OrarioRicevimento.id_medico == id_medico,
        OrarioRicevimento.giorno_settimana == giorno_settimana,
    ).all()

    if not orari:
        return []

    assenza = db.query(Assenza).filter(
        Assenza.id_medico == id_medico,
        Assenza.data_inizio <= giorno,
        Assenza.data_fine >= giorno,
    ).first()

    if assenza is not None:
        return []

    medico = db.query(Medico).filter(Medico.id == id_medico).first()
    if medico is None:
        return []
    
    specializzazione = db.query(Specializzazione).filter(
        Specializzazione.id == medico.id_specializzazione
    ).first()

    durata = specializzazione.durata_minuti

    fasce_generate = []

    for orario in orari:
        inizio_corrente = datetime.combine(giorno, orario.ora_inizio)
        fine_fascia = datetime.combine(giorno, orario.ora_fine)

        while inizio_corrente + timedelta(minutes=durata) <= fine_fascia:
            fine_slot = inizio_corrente + timedelta(minutes=durata)
            fasce_generate.append((inizio_corrente.time(), fine_slot.time()))
            inizio_corrente = fine_slot

    fasce_occupate = db.query(FasciaOrariaVisita.ora_inizio).join(Prenotazione).filter(
        FasciaOrariaVisita.id_medico == id_medico,
        FasciaOrariaVisita.data == giorno,
        Prenotazione.cancellata == False,
    ).all()

    orari_occupati = [fascia.ora_inizio for fascia in fasce_occupate]

    fasce_disponibili = [
        fascia for fascia in fasce_generate
        if fascia[0] not in orari_occupati
    ]

    return fasce_disponibili